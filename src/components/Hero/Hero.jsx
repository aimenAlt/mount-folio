import { useCallback, useEffect, useRef } from 'react';
import useRafScroll from '../../hooks/useRafScroll';
import useReducedMotion from '../../hooks/useReducedMotion';
import './Hero.scss';

/**
 * The propagation stack: one change entering at the base and rising through
 * four layers — shared packages, rendering layer, brand surfaces. Tilts with
 * the cursor and turns as you scroll.
 */

function rigScale() {
  const w = window.innerWidth;
  if (w <= 700) return 0.42;
  if (w <= 1020) return 0.58;
  return 0.82;
}

export default function Hero({ data }) {
  const rigRef = useRef(null);
  const stackRef = useRef(null);
  const pose = useRef({ dx: 0, dy: 0, scroll: 0 });
  const reduced = useReducedMotion();

  const apply = useCallback(() => {
    const stack = stackRef.current;
    if (!stack) return;
    const { dx, dy, scroll } = pose.current;
    const s = rigScale();
    stack.style.setProperty('--rig-scale', s);
    stack.style.transform =
      `scale(${s}) `
      + `rotateX(${60 - dy * 13 - scroll * 20}deg) `
      + `rotateZ(${-32 + dx * 16}deg) `
      + `rotateY(${dx * 5}deg)`;
  }, []);

  const onScroll = useCallback((y) => {
    if (reduced) return;
    pose.current.scroll = Math.max(0, Math.min(1.6, y / Math.max(1, window.innerHeight)));
    apply();
  }, [apply, reduced]);

  useRafScroll(onScroll);

  useEffect(() => {
    apply();
    if (reduced) return undefined;

    const onMove = (e) => {
      const rig = rigRef.current;
      if (!rig) return;
      const r = rig.getBoundingClientRect();
      if (r.bottom < 0) return; // hero is off screen — skip the work
      const clamp = (v) => Math.max(-1, Math.min(1, v));
      pose.current.dx = clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2));
      pose.current.dy = clamp((e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2));
      apply();
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('resize', apply, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', apply);
    };
  }, [apply, reduced]);

  const cells = (n) => Array.from({ length: n }, (_, i) => <i key={i} />);
  const [first, emphasis, last] = data.headline;

  return (
    <header id="top">
      <div className="hero-copy">
        <p className="kicker cyan"><span className="dot" />{data.kicker}</p>
        <h1>
          {first}<br />
          <em>{emphasis}</em><br />
          {last}
        </h1>
        <p className="lede">{data.lede}</p>
        <div className="btn-row">
          <a href="#machine" className="btn btn-solid">Watch a system run →</a>
          <a href="Aimen-Altaiyeb-Resume.pdf" className="btn btn-ghost">Résumé</a>
        </div>
      </div>

      <div className="rig" ref={rigRef}>
        <div className="rig-glow" />
        <div className="stack" ref={stackRef}>
          <span className="beam b1" />
          <span className="beam b2" />
          <span className="beam b3" />
          <span className="beam b4" />

          <div className="plate plate-1"><div className="cells">{cells(12)}</div></div>
          <div className="plate plate-2"><div className="cells">{cells(6)}</div></div>
          <div className="plate plate-3"><div className="cells">{cells(4)}</div></div>
          <div className="plate plate-4"><div className="cells">{cells(6)}</div></div>
        </div>

        <ul className="rig-legend">
          {data.legend.map((item) => (
            <li key={item.label}>
              <span className={`sw ${item.swatch}`} />
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
