import { restaurant } from '../../data/restaurant'
import { branches } from '../../data/branches'
import { Link } from '../../lib/router'

// Shared site footer — used on the homepage and every standalone page so the
// brand, links and spacing stay identical across the whole site.
export function SiteFooter() {
  const v = restaurant.verified
  return (
    <footer className="rs-footer">
      <div className="rs-container">
        <div className="rs-footer-grid">
          <div className="rs-footer-col rs-footer-brand">
            <span className="rs-footer-mark">
              {restaurant.name}
              <small lang="kn">{restaurant.nameKannada}</small>
            </span>
            <p className="rs-footer-tag">
              A home-style Karnataka oota, cooked the way it has always been at
              home — creamy saaru, seasonal palya, and a sweet finish.
            </p>
            <a
              className="rs-footer-social"
              href={v.instagramUrl}
              target="_blank"
              rel="noreferrer"
            >
              {v.instagramHandle}
            </a>
          </div>

          <nav className="rs-footer-col" aria-label="Footer">
            <p className="rs-footer-heading">Explore</p>
            <ul className="rs-footer-list">
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/branches">Branches</Link>
              </li>
              <li>
                <Link to="/order">Order</Link>
              </li>
            </ul>
          </nav>

          <div className="rs-footer-col">
            <p className="rs-footer-heading">Find us</p>
            <p className="rs-footer-text">
              {v.address}
              <br />
              {v.area}, {v.city}, {v.pincode}
            </p>
            <dl className="rs-footer-meta">
              <div>
                <dt>Hours</dt>
                <dd>{v.hours}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href={`tel:${v.phoneHref}`}>{v.phoneDisplay}</a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="rs-footer-col">
            <p className="rs-footer-heading">Branches</p>
            <ul className="rs-footer-list">
              {branches.map((b) => (
                <li key={b.id}>
                  <a href={b.mapUrl} target="_blank" rel="noreferrer">
                    {b.name} ↗
                  </a>
                </li>
              ))}
            </ul>
            <Link to="/order" className="btn btn--primary rs-footer-cta">
              Order now
            </Link>
          </div>
        </div>

        <div className="rs-footer-bottom">
          <span className="rs-footer-copy">© MMXXVI · cooked at home</span>
        </div>
      </div>
    </footer>
  )
}