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
 * both directions with no per-frame fighting. The cursor additionally
 * shifts the camera a little (scrollState.pointerX/Y) with a slight gaze
 * steer, so the background parallaxes with the pointer — a real camera
 * move, not a screen-space layer shift.
 */
export function CameraRig({ reduced }: CameraRigProps) {
  const { camera } = useThree()
  const look = useRef(new THREE.Vector3(0, 0, -10))

  useFrame((_state, delta) => {
    const dt = Math.min(delta, 0.05)
    const p = scrollState.smooth

    const k = 1 - Math.exp(-dt * 6)
    // Parallax is eased much more gently than the dolly, so the camera
    // glides toward the cursor instead of chasing it (floating, smooth feel).
    const kp = 1 - Math.exp(-dt * 2.5)

    // Forward dolly along -Z follows the smoothed scroll progress; the
    // cursor parallax (disabled for users who prefer reduced motion) is
    // eased separately so it feels like a camera floating with the pointer.
    const targetZ =
      CORRIDOR.cameraStartZ +
      (CORRIDOR.cameraEndZ - CORRIDOR.cameraStartZ) * p
    const pan = reduced ? 0 : PARALLAX.pan
    const tx = scrollState.pointerX * pan
    const ty = scrollState.pointerY * pan

    const cam = camera as THREE.PerspectiveCamera
    cam.position.x += (tx - cam.position.x) * kp
    cam.position.y += (ty - cam.position.y) * kp
    cam.position.z += (targetZ - cam.position.z) * k

    look.current.set(
      tx * PARALLAX.look,
      ty * PARALLAX.look,
      cam.position.z - 12,
    )
    cam.lookAt(look.current)
  })

  return null
}