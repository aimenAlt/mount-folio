import useReveal from '../../hooks/useReveal';
import './Contact.scss';

export default function Contact({ data }) {
  const [ref, shown] = useReveal();

  return (
    <section id="contact" className={`reveal${shown ? ' is-in' : ''}`} ref={ref}>
      <div className="wrap two contact-grid">
        <div>
          <p className="kicker gold">Let&apos;s talk</p>
          <h2 className="display">{data.heading}</h2>
          <div className="btn-row">
            <a href={`mailto:${data.email}`} className="btn btn-solid">{data.email}</a>
            <a href={data.resume} className="btn btn-ghost">Résumé (PDF)</a>
          </div>
        </div>

        <dl className="meta">
          {data.meta.map((row) => (
            <div key={row.key}>
              <dt>{row.key}</dt>
              <dd>
                {row.href ? <a href={row.href}>{row.value}</a> : row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
