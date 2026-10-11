import type { CSSProperties, MouseEvent, ReactNode } from 'react'
import { ootaElements, restaurant } from '../../data/restaurant'
import { goToSection } from '../../lib/nav'

const { verified } = restaurant

const mapsQuery = `${verified.lat},${verified.lng}`
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`
const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`

function Cta({
  href,
  children,
  tone = 'solid',
}: {
  href: string
  children: ReactNode
  tone?: 'solid' | 'ghost'
}) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      goToSection(href.slice(1))
    }
  }
  const external = href.startsWith('http')
  return (
    <a
      className={`cta cta--${tone}`}
      href={href}
      onClick={onClick}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {children}
    </a>
  )
}

export function Hero() {
  return (
    <div className="hero-panel">
      <p className="hero-panel__greeting" lang="kn">
        {restaurant.greeting}
      </p>
      <h1 className="hero-panel__title">
        <span className="hero-panel__title-en">Dodda Mane Oota</span>
        <span className="hero-panel__title-kn" lang="kn">
          {restaurant.nameKannada}
        </span>
      </h1>
      <p className="hero-panel__sub">
        A Karnataka oota served the way it is at home — slowly, with care,
        and a lot of heart.
      </p>
      <div className="hero-panel__actions">
        <Cta href="#story">Walk in</Cta>
        <Cta href={`tel:${verified.phoneHref}`} tone="ghost">
          Call to order
        </Cta>
      </div>
      <p className="hero-panel__scroll" aria-hidden="true">
        <span className="hero-panel__scroll-line" />
        Scroll to enter
      </p>
    </div>
  )
}

export function Story() {
  return (
    <>
      <p className="kicker" lang="kn">
        ನಮ್ಮ ಕಥೆ
      </p>
      <h2>The big house down the lane</h2>
      <p>
        <em>Dodda mane</em> simply means “big house”. In Karnataka, the big
        house is where the door is always open, where the smell of saaru
        reaches the gate, and where nobody leaves without eating.
      </p>
      <p>
        We cook the way it should be done — patiently, in small batches, and
        with a lot of heart. Every dish leaves the kitchen the way it would
        leave a family kitchen at home.
      </p>
      <ul className="mini-list">
        <li>
          <span lang="kn">ಸ್ವಾಗತ</span> A warm welcome, always
        </li>
        <li>
          <span lang="kn">ಊಟ</span> Home-style Karnataka cooking
        </li>
        <li>
          <span lang="kn">ಉಪಚಾರ</span> Served with genuine hospitality
        </li>
      </ul>
    </>
  )
}

export function Oota() {
  return (
    <>
      <p className="kicker" lang="kn">
        ಊಟ
      </p>
      <h2>The oota</h2>
      <p>
        An oota is a full spread, traditionally served on a banana leaf. Ours
        follows the shape of a Karnataka meal — something to sip, something to
        stir into rice, a vegetable, a cooling salad, a crunch, and a sweet to
        finish.
      </p>
      <ul className="dish-grid">
        {ootaElements.map((d) => (
          <li key={d.name} className="dish">
            <span className="dish__kn" lang="kn">
              {d.kannada}
            </span>
            <span className="dish__name">{d.name}</span>
            <span className="dish__note">{d.note}</span>
          </li>
        ))}
      </ul>
      <p className="note">
        The spread changes with the day and the season. Call{" "}
        <a href={`tel:${verified.phoneHref}`}>{verified.phoneDisplay}</a> to
        check what’s cooking today’s oota.
      </p>
      <p className="cuisines">
        Kitchen: {verified.cuisines.join(" · ")}
      </p>
    </>
  )
}

export function Dining() {
  return (
    <>
      <p className="kicker" lang="kn">
        ಉಪಚಾರ
      </p>
      <h2>Come in, sit down</h2>
      <p>
        You push open a carved wooden door and the noise of the street falls
        away. Warm light, the low hum of a busy kitchen, and a leaf kept ready
        for you. Somewhere between the first sip of saaru and the last spoon of
        payasa, the meal stops feeling like a restaurant and starts feeling
        like a home.
      </p>
      <ul className="experience-list">
        <li>
          <strong>Dine in</strong>
          <span>Indoor and outdoor seating</span>
        </li>
        <li>
          <strong>Takeaway</strong>
          <span>Packed and ready when you are</span>
        </li>
        <li>
          <strong>Home delivery</strong>
          <span>Order in for lunch or dinner</span>
        </li>
      </ul>
      <div className="hours-chip">
        <span className="hours-chip__open">Open daily</span>
        <span>{verified.hours}</span>
      </div>
    </>
  )
}

const galleryTiles = [
  { kn: 'ಅನ್ನ', label: 'Anna — steamed rice', hue: 40 },
  { kn: 'ಸಾರು', label: 'Saaru — pepper rasam', hue: 12 },
  { kn: 'ಪಲ್ಯ', label: 'Palya — coconut veg', hue: 78 },
  { kn: 'ಬಾಳೆ ಎಲೆ', label: 'On the banana leaf', hue: 110 },
  { kn: 'ಹಪ್ಪಳ', label: 'Happala — crisp papad', hue: 28 },
  { kn: 'ಪಾಯಸ', label: 'Payasa — jaggery sweet', hue: 34 },
]

export function Gallery() {
  return (
    <>
      <p className="kicker" lang="kn">
        ಚಿತ್ರಗಳು
      </p>
      <h2>From our kitchen</h2>
      <p>
        A look at the oota before you taste it. Follow{" "}
        <a href={verified.instagramUrl} target="_blank" rel="noreferrer">
          {verified.instagramHandle}
        </a>{" "}
        for the latest from the kitchen.
      </p>
      <ul className="gallery-grid" aria-label="Dish placeholders">
        {galleryTiles.map((t) => (
          <li
            key={t.label}
            className="gallery-tile"
            style={{ '--hue': t.hue } as CSSProperties}
          >
            <span className="gallery-tile__kn" lang="kn">
              {t.kn}
            </span>
            <span className="gallery-tile__label">{t.label}</span>
            <span className="gallery-tile__pending">Photo to come</span>
          </li>
        ))}
      </ul>
    </>
  )
}

export function Visit() {
  return (
    <>
      <p className="kicker" lang="kn">
        ಭೇಟಿ
      </p>
      <h2>Visit us in KR Puram</h2>
      <div className="visit-grid">
        <div className="visit-block">
          <p className="visit-block__label">Address</p>
          <p className="visit-block__value">
            {verified.address}
            <br />
            {verified.area}, {verified.city} {verified.pincode}
          </p>
        </div>
        <div className="visit-block">
          <p className="visit-block__label">Hours</p>
          <p className="visit-block__value">Daily · {verified.hours}</p>
        </div>
        <div className="visit-block">
          <p className="visit-block__label">Phone</p>
          <p className="visit-block__value">
            <a href={`tel:${verified.phoneHref}`}>{verified.phoneDisplay}</a>
          </p>
        </div>
        <div className="visit-block">
          <p className="visit-block__label">Approx. cost</p>
          <p className="visit-block__value">{verified.costForTwo}</p>
        </div>
      </div>
      <div className="visit-actions">
        <Cta href={`tel:${verified.phoneHref}`}>Call to order</Cta>
        <Cta href={directionsUrl} tone="ghost">
          Get directions
        </Cta>
        <Cta href={verified.instagramUrl} tone="ghost">
          {verified.instagramHandle}
        </Cta>
      </div>
      <p className="provenance">
        Details shown are taken from public listings (
        <a href={restaurant.sourcing.listingUrl} target="_blank" rel="noreferrer">
          Zomato / District
        </a>
        ) and the restaurant’s{" "}
        <a href={restaurant.sourcing.instagramUrl} target="_blank" rel="noreferrer">
          Instagram
        </a>
        , checked {restaurant.sourcing.verifiedOn}. Please confirm prices and
        timings with the restaurant. This is an independent showcase, not the
        official website.
      </p>
      <p className="map-link">
        <a href={mapsUrl} target="_blank" rel="noreferrer">
          {verified.lat.toFixed(4)}, {verified.lng.toFixed(4)} — open in Maps
        </a>
      </p>
    </>
  )
}

export const sectionRenderers: Record<string, () => ReactNode> = {
  hero: Hero,
  story: Story,
  oota: Oota,
  dining: Dining,
  gallery: Gallery,
  visit: Visit,
}
