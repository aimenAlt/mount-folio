import useReveal from '../../hooks/useReveal';
import './Platform.scss';

/**
 * The platform section — the larger half of the job, so it sits ahead of the
 * release-automation case study.
 *
 * The pipeline is a real read of the chain, left to right. A pulse travels each
 * connector on a stagger so the diagram performs the flow it describes; it is
 * transform and opacity only, and it stops on touch devices and under reduced
 * motion (see Platform.scss).
 */
export default function Platform({ data }) {
  const [ref, shown] = useReveal();

  return (
    <section id="platform" className={`reveal${shown ? ' is-in' : ''}`} ref={ref}>
      <div className="wrap">
        <p className="kicker cyan rowline">
          <span>{data.kicker}</span>
          <span className="rule" />
          <span className="muted">{data.meta}</span>
        </p>
        <h2 className="display">{data.heading}</h2>

        {data.body.map((para) => (
          <p className="sub" key={para.slice(0, 24)}>{para}</p>
        ))}

        <div className="card pipe-card">
          <ol className="pipe">
            {data.pipeline.map((node, i) => (
              <li
                key={node.label}
                className={`pipe-node${node.tone ? ` ${node.tone}` : ''}`}
                style={{ '--i': i }}
              >
                <span className="pipe-label">{node.label}</span>
                {node.note && <span className="pipe-note">{node.note}</span>}
              </li>
            ))}
          </ol>
          <p className="pipe-caption">{data.pipelineCaption}</p>
        </div>

        <div className="stat-strip">
          {data.metrics.map((m) => (
            <div className="card metric" key={m.label}>
              <p className={`metric-n ${m.tone}`}>{m.value}</p>
              <p>{m.label}</p>
            </div>
          ))}
        </div>

        <div className="platform-cards">
          {data.cards.map((c) => (
            <div className="card" key={c.title}>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
