import { branches } from '../../data/branches'
import { restaurant } from '../../data/restaurant'
import { BranchCard } from '../site/BranchCard'

// Standalone Branches page. Uses the same verified branch data and the same
// BranchCard component as the homepage "Our Branches" section.
export function BranchesPage() {
  return (
    <main className="page page--branches">
      <header className="page-hero">
        <p className="page-hero__kn" lang="kn">
          ಶಾಖೆಗಳು
        </p>
        <h1 className="page-hero__title">Find your nearest kitchen.</h1>
        <p className="page-hero__lead">
          Every Doddmane Oota serves the same home-style Karnataka oota. Here is
          where you can find us — more branches will appear as they open.
        </p>
      </header>

      <div className="branch-grid">
        {branches.map((branch) => (
          <BranchCard key={branch.id} branch={branch} />
        ))}

        <aside className="branch-soon">
          <h3 className="branch-soon__title">More branches coming soon</h3>
          <p className="branch-soon__text">
            This space is ready for our next kitchens. Follow along on Instagram
            for opening news and updates.
          </p>
          <a
            className="btn btn--ghost"
            href={restaurant.verified.instagramUrl}
            target="_blank"
            rel="noreferrer"
          >
            {restaurant.verified.instagramHandle}
          </a>
        </aside>
      </div>
    </main>
  )
}
