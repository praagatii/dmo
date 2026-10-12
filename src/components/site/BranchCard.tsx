import type { Branch } from '../../data/branches'
import { Link } from '../../lib/router'

// Shared branch card — used by the homepage "Our Branches" section and the
// dedicated /branches page so both stay identical.
export function BranchCard({
  branch,
  onOrder,
}: {
  branch: Branch
  onOrder?: () => void
}) {
  return (
    <article className="branch-card">
      <div className="branch-card__media">
        <img
          src={branch.image}
          alt={`${branch.name} — placeholder photograph`}
          loading="lazy"
        />
      </div>
      <div className="branch-card__body">
        <h3 className="branch-card__name">{branch.name}</h3>
        <p className="branch-card__addr">
          {branch.address}
          <br />
          {branch.area}, {branch.city}, {branch.pincode}
        </p>
        <dl className="branch-card__meta">
          <div>
            <dt>Hours</dt>
            <dd>{branch.hours}</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>
              <a href={`tel:${branch.phoneHref}`}>{branch.phoneDisplay}</a>
            </dd>
          </div>
        </dl>
        <div className="branch-card__actions">
          {onOrder ? (
            <button type="button" className="btn btn--primary" onClick={onOrder}>
              Order now
            </button>
          ) : (
            <Link to="/order" className="btn btn--primary">
              Order now
            </Link>
          )}
          <a
            className="btn btn--ghost"
            href={branch.mapUrl}
            target="_blank"
            rel="noreferrer"
          >
            Directions
          </a>
        </div>
      </div>
    </article>
  )
}
