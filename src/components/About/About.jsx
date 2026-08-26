import { Fragment, useState } from 'react';
import useReveal from '../../hooks/useReveal';
import './About.scss';

export default function About({ data }) {
  const [open, setOpen] = useState(false);
  const [ref, shown] = useReveal();
  const last = data.trajectory.length - 1;

  return (
    <section id="about" className={`band reveal${shown ? ' is-in' : ''}`} ref={ref}>
      <div className="wrap two about-grid">
        <div>
          <p className="kicker gold">About</p>
          <h2 className="display sm">{data.heading}</h2>
          <p className="sub">{data.sub}</p>

          <button
            type="button"
            className="btn-mono"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Less —' : 'More +'}
          </button>

          <div className={`disclose${open ? ' is-open' : ''}`}>
            {data.more.map((para) => (
              <p className="body" key={para.slice(0, 24)}>{para}</p>
            ))}
            <p className="kicker cyan">The trajectory</p>
            <div className="traj">
              {data.trajectory.map((step, i) => (
                <Fragment key={step}>
                  <span className={i === last ? 'on' : undefined}>{step}</span>
                  {i < last && <b>→</b>}
                </Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card cv">
            {data.cv.map((job, i) => (
              <Fragment key={job.org}>
                {i > 0 && <hr />}
                <div>
                  <div className="cv-top">
                    <h4>{job.org}</h4>
                    <span className="mono muted">{job.when}</span>
                  </div>
                  <p>{job.role}</p>
                </div>
              </Fragment>
            ))}
            <hr />
            {data.education.map((ed) => (
              <div key={ed.degree}>
                <h4>{ed.degree}</h4>
                <p>{ed.school}</p>
              </div>
            ))}
          </div>

          <div className="card">
            <p className="kicker gold">Toolkit</p>
            <div className="chips">
              {data.toolkit.map((t) => <span key={t}>{t}</span>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
