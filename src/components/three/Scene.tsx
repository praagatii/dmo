import { Suspense } from 'react'
import { CameraRig } from './CameraRig'
import { CorridorLayers } from './CorridorLayers'

interface SceneProps {
  quality: 'full' | 'lite'
  reduced: boolean
}

export function Scene({ quality, reduced }: SceneProps) {
  return (
    <>
      <CameraRig reduced={reduced} />

      <Suspense fallback={null}>
        <CorridorLayers quality={quality} />
      </Suspense>
    </>
  )
}