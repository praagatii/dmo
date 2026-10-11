import { Suspense, lazy, useEffect, useState } from 'react'
import { useCapability } from './lib/capability'
import { StaticSite } from './components/site/StaticSite'

// The 3D experience (three.js + R3F) is code-split so that devices that
// fall back to the static site never download the heavy bundle.
const ThreeSite = lazy(() =>
  import('./components/site/ThreeSite').then((m) => ({ default: m.ThreeSite })),
)

export default function App() {
  const capability = useCapability()
  const [choice, setChoice] = useState<'3d' | '2d' | null>(null)

  const defaultChoice = capability.mode === 'static' ? '2d' : '3d'
  const requested = choice ?? defaultChoice
  const show3D = capability.canRender3D && requested === '3d'
  const quality = capability.mode === 'lite' ? 'lite' : 'full'

  // Start each mode at the top of the journey.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [show3D])

  if (show3D) {
    return (
      <Suspense
        fallback={
          <div className="curtain">
            <span className="curtain__mark" lang="kn">
              ಊ
            </span>
            <span className="curtain__text">Opening the door…</span>
          </div>
        }
      >
        <ThreeSite
          quality={quality}
          reduced={capability.reducedMotion}
          onExit={() => setChoice('2d')}
        />
      </Suspense>
    )
  }

  return (
    <StaticSite
      canRender3D={capability.canRender3D}
      onEnter={() => setChoice('3d')}
    />
  )
}
