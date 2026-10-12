import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { useCapability } from './lib/capability'
import { useRoute, Link } from './lib/router'
import { CartProvider } from './lib/cart'
import { RealHome } from './components/site/RealHome'
import { Loader } from './components/site/Loader'
import { AppHeader } from './components/site/AppHeader'
import { SiteFooter } from './components/site/SiteFooter'
import { OrderPage } from './components/order/OrderPage'
import { CartPage } from './components/order/CartPage'
import { CheckoutPage } from './components/order/CheckoutPage'
import { ConfirmationPage } from './components/order/ConfirmationPage'

// The 3D experience (three.js + R3F) is code-split so that devices that
// fall back to the static site never download the heavy bundle.
const ThreeSite = lazy(() =>
  import('./components/site/ThreeSite').then((m) => ({ default: m.ThreeSite })),
)

// Session-scoped key: marks that the 3D intro has finished for this browser
// tab. It survives ordinary and hard refreshes (same session) but not a new
// browsing session, so the intro only plays once per session.
const SESSION_KEY = 'dmo.intro.done'

function readIntroDone(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

// White handoff overlay: the 3D scene ends on a fully-white doorway flash, so
// we swap the homepage in behind the same white and fade it out.
function IntroReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const raf = requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.55s ease-out'
      el.style.opacity = '0'
    })
    return () => cancelAnimationFrame(raf)
  }, [])
  return <div ref={ref} className="intro-reveal" aria-hidden="true" />
}

// The homepage hosts the one-shot 3D intro; once it has played (or the device
// can't render it) the same global chrome as /order is used, so the homepage
// and the ordering flow always share one navigation bar.
function HomeRoute() {
  const capability = useCapability()
  const [choice, setChoice] = useState<'3d' | '2d' | null>(null)
  const [sceneReady, setSceneReady] = useState(false)
  const [booted, setBooted] = useState(false)
  const [via3D, setVia3D] = useState(false)
  const [introDone] = useState(readIntroDone)

  const defaultChoice = capability.mode === 'static' ? '2d' : '3d'
  const requested = choice ?? defaultChoice
  const show3D = !introDone && capability.canRender3D && requested === '3d'
  const quality = capability.mode === 'lite' ? 'lite' : 'full'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [show3D])

  if (show3D) {
    return (
      <>
        {!booted && (
          <Loader
            ready={sceneReady}
            reduced={capability.reducedMotion}
            onDone={() => setBooted(true)}
          />
        )}
        <Suspense fallback={null}>
          <ThreeSite
            quality={quality}
            reduced={capability.reducedMotion}
            active={booted}
            onReady={() => setSceneReady(true)}
            onExit={() => {
              try {
                sessionStorage.setItem(SESSION_KEY, '1')
              } catch {
                /* private mode — fall back to per-mount behaviour */
              }
              setVia3D(true)
              setChoice('2d')
            }}
          />
        </Suspense>
      </>
    )
  }

  return (
    <>
      <RealHome playIntro={!introDone && !via3D} />
      <SiteFooter />
      {via3D && <IntroReveal />}
    </>
  )
}

function NotFound() {
  return (
    <main className="page page--notfound">
      <div className="empty-state">
        <h1>Page not found</h1>
        <p>That page does not exist.</p>
        <Link to="/" className="btn btn--primary">
          Back to home
        </Link>
      </div>
    </main>
  )
}

// The site is a single long homepage; the ordering flow is its only other
// route, rendered inside the same global chrome.
function renderRoute(route: string) {
  switch (route) {
    case '/order':
      return <OrderPage />
    case '/cart':
      return <CartPage />
    case '/checkout':
      return <CheckoutPage />
    case '/order/confirmation':
      return <ConfirmationPage />
    default:
      return <NotFound />
  }
}

function Shell() {
  const route = useRoute()

  // Every navigation starts at the top of the page.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [route])

  if (route === '/') return <HomeRoute />

  return (
    <div className="app-shell">
      <AppHeader />
      {renderRoute(route)}
      <SiteFooter />
    </div>
  )
}

export default function App() {
  return (
    <CartProvider>
      <Shell />
    </CartProvider>
  )
}