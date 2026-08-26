import { useEffect, useRef, useState } from 'react';
import useReveal from '../../hooks/useReveal';
import useReducedMotion from '../../hooks/useReducedMotion';
import './Machine.scss';

/**
 * The by-hand / automated comparison.
 *
 * The chain is colour-coded AT REST — a wall of red human steps versus gold
 * automated ones — because that ratio IS the argument. The playhead then walks
 * it, dwelling on human steps and blasting through automated ones.
 */
export default function Machine({ data }) {
  const [mode, setMode] = useState('before');
  const [cursor, setCursor] = useState(-1);
  const [running, setRunning] = useState(false);
  const [deepOpen, setDeepOpen] = useState(false);
  const [ref, shown] = useReveal(0.3);
  const reduced = useReducedMotion();
  const timer = useRef(null);
  const autoplayed = useRef(false);

  const steps = data.chain[mode];
  const humanTotal = steps.filter((s) => s[1] === 'human').length;
  const active = cursor >= 0 ? steps[cursor] : null;

  const stop = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setRunning(false);
  };

  // Advance the playhead. Human steps dwell — that pause is the whole point.
  useEffect(() => {
    if (!running || cursor < 0 || cursor >= steps.length) return undefined;
    const dwell = steps[cursor][1] === 'human' ? 1500 : 460;
    timer.current = setTimeout(() => {
      if (cursor + 1 >= steps.length) {
        setRunning(false);
        return;
      }
      setCursor(cursor + 1);
    }, dwell);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [running, cursor, steps]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const play = () => {
    if (timer.current) clearTimeout(timer.current);
    setCursor(0);
    setRunning(true);
  };

  const switchMode = (next) => {
    if (timer.current) clearTimeout(timer.current);
    setMode(next);
    setCursor(0);
    setRunning(true);
  };

  // Autoplay once, when it first scrolls into view.
  useEffect(() => {
    if (shown && !autoplayed.current && !reduced) {
      autoplayed.current = true;
      play();
    }
  }, [shown, reduced]);

  return (
    <section
      id="machine"
      className={`band reveal${shown ? ' is-in' : ''}`}
      ref={ref}
    >
      <div className="wrap">
        <p className="kicker gold rowline">
          <span>{data.kicker}</span>
          <span className="rule" />
          <span className="muted">{data.meta}</span>
        </p>
        <h2 className="display">{data.heading}</h2>
        <p className="sub">{data.sub}</p>

        <div className="controls">
          <div className="seg">
            <button
              type="button"
              className={`seg-btn${mode === 'before' ? ' is-on' : ''}`}
              onClick={() => switchMode('before')}
            >
              By hand
            </button>
            <button
              type="button"
              className={`seg-btn${mode === 'after' ? ' is-on' : ''}`}
              onClick={() => switchMode('after')}
            >
              Automated
            </button>
          </div>
          <button
            type="button"
            className="btn-mono"
            onClick={() => (running ? stop() : play())}
          >
            {running ? '❙❙ Pause' : '▶ Play'}
          </button>
        </div>

        <div className="card chain-card">
          <div className="chain">
            {steps.map(([label, kind], i) => (
              <div
                key={label}
                title={label}
                className={[
                  'node',
                  kind,
                  i === cursor ? 'on' : '',
                  i < cursor ? 'done' : ''
                ].filter(Boolean).join(' ')}
              />
            ))}
          </div>

          <ul className="chain-legend">
            <li><span className="sw red" />Someone has to do this</li>
            <li><span className="sw gold" />The machine does this</li>
          </ul>

          <div className="chain-foot">
            <div>
              <p
                className="kicker"
                style={{
                  color: active && active[1] === 'human'
                    ? 'oklch(0.70 0.15 32)'
                    : 'var(--gold)'
                }}
              >
                {active ? (active[1] === 'human' ? 'Human step' : 'Automated') : 'Idle'}
              </p>
              <p className="step-label">{active ? active[0] : 'Ready'}</p>
            </div>
            <div className="counts">
              <div>
                <p className="tiny">Human touchpoints</p>
                <p
                  className="num"
                  style={{ color: mode === 'before' ? 'oklch(0.68 0.16 32)' : 'var(--gold)' }}
                >
                  {humanTotal}
                </p>
              </div>
              <div>
                <p className="tiny">Steps</p>
                <p className="num dim">{steps.length}</p>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn-mono spaced"
          aria-expanded={deepOpen}
          onClick={() => setDeepOpen((v) => !v)}
        >
          {deepOpen ? 'Hide the detail —' : 'How it actually works +'}
        </button>

        <div className={`disclose${deepOpen ? ' is-open' : ''}`}>
          <div className="two">
            <div className="card">
              <p className="kicker cyan">The actual hard part</p>
              <h3>Reconciling state, not opening PRs</h3>
              <p className="body">
                Releases overlap. Related packages travel in synchronized groups. A
                naive consumer opens contradictory branches — so the system computes
                the newest valid group before it emits anything downstream.
              </p>
              <div className="events">
                <div className="ev"><span className="muted">event A</span><span>package-x → 2.1</span></div>
                <div className="ev"><span className="muted">event B</span><span>x → 2.2, y → 4.0</span></div>
                <div className="ev-join" />
                <div className="ev ev-out"><span className="gold">result</span><span>coalesced, one valid group</span></div>
              </div>
            </div>

            <div className="col">
              <div className="card outcomes">
                {data.outcomes.map((o) => (
                  <div key={o.title}>
                    <h4>{o.title}</h4>
                    <p>{o.body}</p>
                  </div>
                ))}
              </div>
              <div className="metrics">
                {data.metrics.map((m) => (
                  <div className="card metric" key={m.label}>
                    <p className={`metric-n ${m.tone}`}>{m.value}</p>
                    <p>{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
