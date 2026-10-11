import { Suspense } from 'react'
import { CameraRig } from './CameraRig'
import { CorridorLayers } from './CorridorLayers'
import { CorridorBackdrop } from './LayerPlane'
import { PALETTE } from './config'

interface SceneProps {
  quality: 'full' | 'lite'
  reduced: boolean
}

export function Scene({ quality, reduced }: SceneProps) {
  return (
    <>
      <color attach="background" args={[PALETTE.background]} />

      <CameraRig reduced={reduced} />

      <Suspense fallback={null}>
        <CorridorBackdrop />
        <CorridorLayers quality={quality} />
      </Suspense>
    </>
  )
}