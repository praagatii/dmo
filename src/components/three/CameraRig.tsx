import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { CORRIDOR, PARALLAX } from './config'
import { scrollState } from '../../lib/scroll'

interface CameraRigProps {
  reduced: boolean
}

/**
 * Drives the hero camera. Scroll writes scrollState.progress and the GSAP
 * ticker glides scrollState.smooth toward it each frame at 60fps; the
 * camera follows that smoothed value directly, so movement stays fluid in
 * both directions with no per-frame fighting. The cursor slightly shifts
 * the camera in the opposite direction (scrollState.pointerX/Y), keeping it
 * perfectly parallel, so the backdrop travels with the pointer for a clean
 * depth parallax rather than a skew.
 */
export function CameraRig({ reduced }: CameraRigProps) {
  const { camera } = useThree()
  const look = useRef(new THREE.Vector3(0, 0, -10))

  useFrame((_state, delta) => {
    const dt = Math.min(delta, 0.05)
    const p = scrollState.smooth

    const k = 1 - Math.exp(-dt * 6)

    // Forward dolly along -Z follows the smoothed scroll progress; the
    // cursor parallax (disabled for users who prefer reduced motion) is
    // eased separately so it feels like a camera floating with the pointer.
    const targetZ =
      CORRIDOR.cameraStartZ +
      (CORRIDOR.cameraEndZ - CORRIDOR.cameraStartZ) * p
    const pan = reduced ? 0 : PARALLAX.pan

    const cam = camera as THREE.PerspectiveCamera
    // Parallax: move the camera away from the cursor so the backdrop appears
    // to travel with the pointer (near parts a little faster than far ones).
    // The camera stays parallel (looks exactly where it sits) so the image
    // never skews or drifts off-centre.
    const tx = -scrollState.pointerX * pan
    const ty = -scrollState.pointerY * pan
    cam.position.x += (tx - cam.position.x) * k
    cam.position.y += (ty - cam.position.y) * k
    cam.position.z += (targetZ - cam.position.z) * k

    look.current.set(
      cam.position.x,
      cam.position.y,
      cam.position.z - 12,
    )
    cam.lookAt(look.current)
  })

  return null
}