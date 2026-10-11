import { Suspense } from 'react'
import { CameraRig } from './CameraRig'
import { Corridor } from './Corridor'
import { PALETTE } from './config'

interface SceneProps {
  quality: 'full' | 'lite'
  reduced: boolean
}

export function Scene({ quality, reduced }: SceneProps) {
  const shadows = quality === 'full' && !reduced

  return (
    <>
      <color attach="background" args={[PALETTE.background]} />
      <fog attach="fog" args={[PALETTE.fog, 15, 74]} />

      <CameraRig reduced={reduced} />

      <Suspense fallback={null}>
        <Corridor quality={quality} shadows={shadows} />
      </Suspense>
    </>
  )
}
