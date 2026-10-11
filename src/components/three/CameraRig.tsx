import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { CORRIDOR } from './config'
import { scrollState } from '../../lib/scroll'

interface CameraRigProps {
  reduced: boolean
}

/**
 * Drives the one-point-perspective forward travel.
 * Scroll writes scrollState.progress; this lerps the camera toward it so
 * movement stays buttery even when the scroll wheel is jumpy.
 */
export function CameraRig({ reduced }: CameraRigProps) {
  const { camera } = useThree()
  const look = useRef(new THREE.Vector3(0, CORRIDOR.eyeHeight, -10))

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const p = scrollState.progress
    const intro = scrollState.intro

    const k = 1 - Math.exp(-dt * 5.5)

    const travel =
      CORRIDOR.cameraStartZ +
      (CORRIDOR.cameraEndZ - CORRIDOR.cameraStartZ) * p
    // Cinematic opening: a small arrival offset that settles to zero.
    const targetZ = travel + (1 - intro) * 3.2

    const cam = camera as THREE.PerspectiveCamera
    cam.position.z += (targetZ - cam.position.z) * k

    const t = state.clock.elapsedTime
    const breathe = reduced ? 0 : Math.sin(t * 0.9) * 0.012
    cam.position.y = CORRIDOR.eyeHeight + breathe

    look.current.set(
      cam.position.x * 0.4,
      CORRIDOR.eyeHeight - 0.05,
      cam.position.z - 12,
    )
    cam.lookAt(look.current)
  })

  return null
}
