import { useEffect, useState } from 'react'
import { menuCategories, itemsByCategory } from '../../data/menu'
import { ItemCard } from './ItemCard'
import { useCart } from '../../lib/cart'
import { inr } from '../../lib/format'
import { navigate } from '../../lib/router'

export function OrderPage() {
  const [active, setActive] = useState(menuCategories[0]?.id ?? '')
  const { count, subtotal } = useCart()

  useEffect(() => {
    const sections = menuCategories
      .map((c) => document.getElementById(`cat-${c.id}`))
      .filter((el): el is HTMLElement => Boolean(el))
    if (sections.length === 0) return
    const obs = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (top) setActive(top.target.id.replace('cat-', ''))
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] },
    )
    sections.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  const goTo = (id: string) =>
    document
      .getElementById(`cat-${id}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <main className="page page--order">
      <header className="page-head">
        <p className="order-intro__kicker" lang="kn">
          ಊಟ ಆಯ್ತಾ?
        </p>
        <h1 className="page-title">Order your oota</h1>
        <p className="page-sub">
          Home-style Karnataka cooking, packed to travel. Pick your dishes and
          we&apos;ll take it from there.
        </p>
      </header>

      <nav className="cat-nav" aria-label="Menu categories">
        {menuCategories.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`cat-nav__chip${active === c.id ? ' is-active' : ''}`}
            onClick={() => goTo(c.id)}
          >
            <span className="cat-nav__kn" lang="kn">
              {c.kannada}
            </span>
            {c.name}
          </button>
        ))}
      </nav>

      <p className="menu-notice">
        <strong>Temporary photographs.</strong> The dishes and prices are the
        real menu — the images are placeholders that will be swapped for
        Doddmane Oota photographs.
      </p>

      {menuCategories.map((c) => {
        const items = itemsByCategory(c.id)
        if (items.length === 0) return null
        return (
          <section key={c.id} id={`cat-${c.id}`} className="cat-section">
            <div className="cat-section__head">
              <h2 className="cat-section__title">{c.name}</h2>
              <span className="cat-section__kn" lang="kn">
                {c.kannada}
              </span>
            </div>
            <div className="item-grid">
              {items.map((i) => (
                <ItemCard key={i.id} item={i} />
              ))}
            </div>
          </section>
        )
      })}

      {count > 0 && (
        <button
          type="button"
          className="cart-banner"
          onClick={() => navigate('/cart')}
        >
          <span>
            {count} item{count > 1 ? 's' : ''} · {inr(subtotal)}
          </span>
          <span>View cart →</span>
        </button>
      )}
    </main>
  )
}
