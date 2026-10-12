// Homepage sections below the hero. Order: Our Story → Our Branches →
// Ambience → Featured Guests → Footer. All content is verified data from
// src/data (restaurant.ts, branches.ts) — nothing invented. The homepage menu
// belongs to the dedicated ordering experience, not here.
import { restaurant, navSections } from '../../data/restaurant'
import { branches } from '../../data/branches'
import { Link } from '../../lib/router'
import { BranchCard } from './BranchCard'
import { SiteFooter } from './SiteFooter'

interface Props {
  onOrder: () => void
}

const storyLabel = navSections.find((s) => s.id === 'story')

export default function RealSections({ onOrder }: Props) {
  const v = restaurant.verified
  return (
    <>
      <section id="story" className="rs-section rs-cream">
        <div className="rs-container rs-grid rs-story">
          <div className="rs-head">
            <p className="rs-label">
              {storyLabel?.kannada} · 01 — {storyLabel?.label}
            </p>
            <h2 className="rs-title">The meal of the big house.</h2>
            <p className="rs-lead">
              Dodda Mane Oota — “the big house meal” — is home-style Karnataka
              cooking served from a family kitchen in {v.area}, Bengaluru.
            </p>
            <p className="rs-body">
              Every day the leaf is set with a rotating oota: rice, saaru,
              seasonal palya and a sweet finish, cooked the way it has always
              been at home. Veg and non-veg plates, {v.cuisines.join(', ')}.
            </p>
          </div>
          <div className="rs-story-media">
            <img src="/bg1.png" alt="" className="rs-media-img" />
          </div>
        </div>
      </section>

      <section id="branches" className="rs-section rs-white">
        <div className="rs-container">
          <div className="rs-head rs-center">
            <p className="rs-label">ಶಾಖೆಗಳು · 02 — Our Branches</p>
            <h2 className="rs-title">The big-house meal, wherever you are.</h2>
            <p className="rs-lead">
              Our kitchen in {v.area} serves the oota every day. More branches
              will appear here as they open.
            </p>
          </div>
          <div className="branch-grid">
            {branches.map((branch) => (
              <BranchCard key={branch.id} branch={branch} onOrder={onOrder} />
            ))}
            <aside className="branch-soon">
              <h3 className="branch-soon__title">More branches coming soon</h3>
              <p className="branch-soon__text">
                Our next Doddmane Oota kitchens will be listed here as they
                open. Follow along for announcements.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section id="experience" className="rs-section rs-dark">
        <div className="rs-container">
          <div className="rs-head rs-center">
            <p className="rs-label rs-on-dark">ಅನುಭವ · 03 — The Experience</p>
            <h2 className="rs-title rs-title-dark">A room made for long meals.</h2>
            <p className="rs-lead rs-on-dark">
              A family kitchen that feels like walking into a Karnataka home — a
              leaf set out, the kitchen working, and the evening unhurried.
            </p>
          </div>
          <div className="ambience-grid">
            <figure className="ambience-item ambience-item--wide">
              <img
                src="/herobg.png"
                alt="Doddmane Oota — placeholder photograph of the dining space"
                loading="lazy"
              />
            </figure>
            <figure className="ambience-item">
              <img
                src="/bg1.png"
                alt="Meals served at Doddmane Oota — placeholder photograph"
                loading="lazy"
              />
            </figure>
            <figure className="ambience-item">
              <img
                src="/bgdm1.png"
                alt="Doddmane Oota detail — placeholder photograph"
                loading="lazy"
              />
            </figure>
          </div>
          <p className="ambience-note">
            Placeholder photographs — replaced with the real space once the
            restaurant shares images.
          </p>
        </div>
      </section>

      <section id="guests" className="rs-section rs-cream">
        <div className="rs-container">
          <div className="rs-head rs-center">
            <p className="rs-label">ಅತಿಥಿಗಳು · 04 — Featured Guests</p>
            <h2 className="rs-title">Notable visits.</h2>
            <p className="rs-lead">
              Honest reviews and verified visits, shared as they are confirmed.
            </p>
          </div>
          <div className="guest-placeholder">
            <p className="guest-placeholder__text">
              This space is reserved for featured guests and genuine customer
              reviews — nothing is published here until it is confirmed. Follow{' '}
              {v.instagramHandle} for updates, and tell us about your oota after
              your visit.
            </p>
            <Link to="/order" className="btn btn--primary">
              Order now
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  )
}