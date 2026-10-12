import { restaurant, ootaElements } from '../../data/restaurant'
import { Link } from '../../lib/router'

export function AboutPage() {
  const v = restaurant.verified
  return (
    <main className="page page--about">
      <header className="page-hero">
        <p className="page-hero__kn" lang="kn">
          ನಮ್ಮ ಕಥೆ
        </p>
        <h1 className="page-hero__title">The meal of the big house.</h1>
        <p className="page-hero__lead">
          Dodda Mane Oota — the big house meal — is home-style Karnataka
          cooking served from a family kitchen in {v.area}, Bengaluru.
        </p>
      </header>

      <section className="about-section">
        <h2 className="about-title">What an oota is made of</h2>
        <p className="about-lead">
          Six things you will meet on the leaf — in order, roughly.
        </p>
        <ol className="rs-oota">
          {ootaElements.map((el, i) => (
            <li key={el.name}>
              <span className="rs-oota-index">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="rs-oota-name">
                  <span lang="kn">{el.kannada}</span> · {el.name}
                </p>
                <p className="rs-oota-note">{el.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="about-section about-section--visit">
        <h2 className="about-title">Come hungry, leave happy.</h2>
        <div className="about-visit-grid">
          <div>
            <p className="about-label">Hours</p>
            <p>{v.hours}</p>
            <p className="about-label">Cuisines</p>
            <p>{v.cuisines.join(' · ')}</p>
          </div>
          <div>
            <p className="about-label">Find us</p>
            <p>
              {v.address}
              <br />
              {v.area}, {v.city}, {v.pincode}
            </p>
            <a href={`tel:${v.phoneHref}`} className="rs-link">
              {v.phoneDisplay}
            </a>
            <a
              href={v.instagramUrl}
              className="rs-link"
              target="_blank"
              rel="noreferrer"
            >
              {v.instagramHandle}
            </a>
          </div>
        </div>
        <div className="about-cta">
          <Link to="/order" className="btn btn--primary">
            Order now
          </Link>
          <Link to="/branches" className="btn btn--ghost">
            See our branches
          </Link>
        </div>
      </section>
    </main>
  )
}
