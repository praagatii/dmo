import { Suspense } from 'react'
import { CameraRig } from './CameraRig'
import { CorridorLayers } from './CorridorLayers'

interface SceneProps {
  quality: 'full' | 'lite'
  reduced: boolean
  /** Fired once the corridor backdrop textures have loaded. */
  onReady?: () => void
}

export function Scene({ quality, reduced, onReady }: SceneProps) {
  return (
    <>
      <CameraRig reduced={reduced} />

      <Suspense fallback={null}>
        <CorridorLayers quality={quality} onReady={onReady} />
      </Suspense>
    </>
  )
}