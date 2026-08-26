import useReveal from '../../hooks/useReveal';
import './Stakes.scss';

/**
 * Why it mattered. The two package rows drift on coprime periods (5.5s / 7.3s)
 * so they slide permanently out of phase and never re-align — the section's
 * argument is "two things that should move together don't", so the graphic
 * performs it rather than describing it.
 */
export default function Stakes() {
  const [ref, shown] = useReveal();

  return (
    <section
      id="stakes"
      className={`band band-red reveal${shown ? ' is-in' : ''}`}
      ref={ref}
    >
      <div className="wrap">
        <p className="kicker red rowline">
          <span>Why it mattered</span>
          <span className="rule" />
        </p>
        <h2 className="display">
          The manual step wasn&apos;t slow. It was a way for broken combinations to
          reach production.
        </h2>
        <p className="sub">
          Some packages only work at matched versions — they have to go out together
          or not at all. A human doing that by hand, several times a day, will
          eventually get it wrong.
        </p>

        <div className="two stakes-grid">
          <div className="card">
            <p className="kicker muted">One missed pairing</p>
            <div className="pair">
              <div className="pkg pkg-ok">
                <span>component-core</span>
                <span className="gold">2.2 ✓ shipped</span>
              </div>
              <div className="pkg pkg-bad">
                <span>component-forms</span>
                <span className="red">1.4 ✗ left behind</span>
              </div>
              <div className="fracture">
                <span />
                <em>contract broken</em>
                <span />
              </div>
              <div className="prod">live on the customer-facing site</div>
            </div>
          </div>

          <div className="col">
            <div className="card">
              <h3>Runtime failures, not build failures</h3>
              <p>
                A mismatched pair often compiles fine. It breaks in the browser, on
                real traffic, where the first person to notice is a customer.
              </p>
            </div>
            <div className="card">
              <h3>Visual and behavioral drift</h3>
              <p>
                Half-updated shared components render inconsistently across brands
                and pages — the kind of bug that gets filed five separate times
                before anyone traces it to a version.
              </p>
            </div>
            <div className="card">
              <h3>Nothing was watching for it</h3>
              <p>
                Versions could ship decoupled from the changes they belonged to with
                no check that would catch the drift. Diagnosis started from the
                symptom, hours downstream.
              </p>
            </div>
          </div>
        </div>

        <div className="card blast">
          <p className="kicker red">The cost of the blast radius</p>
          <p className="blast-lead">
            These are storefront and purchase surfaces for a company that sells
            continuously, worldwide. Minutes of a degraded checkout path are
            expensive in a way a release ticket never captures.
          </p>
          <p className="body">
            I won&apos;t put a dollar figure on it — I never instrumented one, and
            I&apos;d rather say that than invent it. What I can say precisely:
            reconciliation makes the broken combination <em className="red">unrepresentable</em>.
            The system can no longer emit a version set that doesn&apos;t hold
            together, so that whole class of production incident stops originating
            here.
          </p>
        </div>
      </div>
    </section>
  );
}
