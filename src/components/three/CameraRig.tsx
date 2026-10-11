import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { CORRIDOR } from './config'
import { scrollState } from '../../lib/scroll'

interface CameraRigProps {
  reduced: boolean
}

/**
 * Drives the forward travel through the multiplane corridor.
 * Scroll writes scrollState.progress; camera z is a deterministic lerp
 * between cameraStartZ and cameraEndZ, then eased toward it each frame so
 * movement stays smooth in both directions without any timers. The camera
 * is kept exactly level and on-axis so the layered reconstruction always
 * matches the reference composition.
 */
export function CameraRig(_props: CameraRigProps) {
  const { camera } = useThree()
  const look = useRef(new THREE.Vector3(0, 0, -10))

  useFrame((_state, delta) => {
    const dt = Math.min(delta, 0.05)
    const p = scrollState.progress
    const intro = scrollState.intro

    const k = 1 - Math.exp(-dt * 6)

    const travel =
      CORRIDOR.cameraStartZ +
      (CORRIDOR.cameraEndZ - CORRIDOR.cameraStartZ) * p
    // Cinematic opening: settle from slightly forward of the start framing.
    const targetZ = travel + (1 - intro) * 2.6

    const cam = camera as THREE.PerspectiveCamera
    cam.position.x += (0 - cam.position.x) * k
    cam.position.y += (0 - cam.position.y) * k
    cam.position.z += (targetZ - cam.position.z) * k

    look.current.set(0, 0, cam.position.z - 12)
    cam.lookAt(look.current)
  })

  return null
}