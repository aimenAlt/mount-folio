import { useState } from 'react';
import useReveal from '../../hooks/useReveal';
import './Work.scss';

/** Collapsed one-line rows — details only when asked for. */
export default function Work({ projects }) {
  const [open, setOpen] = useState(null);
  const [ref, shown] = useReveal();

  return (
    <section id="work" className={`reveal${shown ? ' is-in' : ''}`} ref={ref}>
      <div className="wrap">
        <p className="kicker cyan rowline">
          <span>Also on my desk</span>
          <span className="rule" />
          <span className="muted">tap any row</span>
        </p>
        <h2 className="display sm">Six more systems</h2>

        <div className="rows">
          {projects.map((p, i) => (
            <div className={`row${open === i ? ' is-open' : ''}`} key={p.title}>
              <button
                type="button"
                className="row-head"
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="row-kicker">{p.kicker}</span>
                <span className="row-title">{p.title}</span>
                <span className="row-icon">+</span>
              </button>
              <div className="row-body">
                <div className="row-body-inner">
                  <p>{p.body}</p>
                  <div className="tags">
                    {p.tags.map((t) => <span key={t}>{t}</span>)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
