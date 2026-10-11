import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CORRIDOR, PALETTE } from './config'
import { glowTexture } from '../../lib/textures'
import { scrollState } from '../../lib/scroll'
import { Toran, makeToranMaterials } from './Details'

interface DoorwayProps {
  doorMaterial: THREE.Material
  frameMaterial: THREE.Material
  shadows: boolean
}

const OPEN_FROM = 0.7
const OPEN_TO = 0.98

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/**
 * The ornate wooden doorway that anchors the journey.
 * Its two leaves swing open as the viewer arrives.
 */
export function Doorway({ doorMaterial, frameMaterial, shadows }: DoorwayProps) {
  const left = useRef<THREE.Group>(null)
  const right = useRef<THREE.Group>(null)
  const glow = useRef<THREE.Mesh>(null)

  const { halfWidth, doorZ, doorHeight } = CORRIDOR
  const leafWidth = halfWidth - 0.05
  const glowTex = useMemo(() => glowTexture(), [])
  const toranMats = useMemo(() => makeToranMaterials(), [])

  useFrame(() => {
    const open = smoothstep(OPEN_FROM, OPEN_TO, scrollState.progress)
    const angle = open * (Math.PI * 0.62)
    if (left.current) left.current.rotation.y = angle
    if (right.current) right.current.rotation.y = -angle
    if (glow.current) {
      const m = glow.current.material as THREE.MeshBasicMaterial
      m.opacity = 0.22 + open * 0.4
    }
  })

  const hingeX = halfWidth
  const cy = doorHeight / 2

  return (
    <group position={[0, 0, doorZ]}>
      {/* Opening frame */}
      <mesh position={[-halfWidth - 0.35, doorHeight / 2, 0]} material={frameMaterial} castShadow={shadows}>
        <boxGeometry args={[0.7, doorHeight + 1.4, 0.9]} />
      </mesh>
      <mesh position={[halfWidth + 0.35, doorHeight / 2, 0]} material={frameMaterial} castShadow={shadows}>
        <boxGeometry args={[0.7, doorHeight + 1.4, 0.9]} />
      </mesh>
      <mesh position={[0, doorHeight + 0.85, 0]} material={frameMaterial} castShadow={shadows}>
        <boxGeometry args={[halfWidth * 2 + 1.7, 1.1, 1.0]} />
      </mesh>

      {/* Toran — mango-leaf garland welcoming guests */}
      <Toran baseY={doorHeight + 0.3} materials={toranMats} />
      {/* Threshold */}
      <mesh position={[0, 0.06, 0]} material={frameMaterial}>
        <boxGeometry args={[halfWidth * 2 + 1.0, 0.16, 1.2]} />
      </mesh>

      {/* Left leaf (hinged at -halfWidth) */}
      <group ref={left} position={[-hingeX, cy, 0]}>
        <mesh position={[leafWidth / 2, 0, 0]} material={doorMaterial}>
          <boxGeometry args={[leafWidth, doorHeight, 0.18]} />
        </mesh>
        <mesh position={[leafWidth - 0.22, 0, 0.16]} material={frameMaterial}>
          <sphereGeometry args={[0.09, 12, 12]} />
        </mesh>
      </group>

      {/* Right leaf (hinged at +halfWidth) */}
      <group ref={right} position={[hingeX, cy, 0]}>
        <mesh position={[-leafWidth / 2, 0, 0]} material={doorMaterial}>
          <boxGeometry args={[leafWidth, doorHeight, 0.18]} />
        </mesh>
        <mesh position={[-(leafWidth - 0.22), 0, 0.16]} material={frameMaterial}>
          <sphereGeometry args={[0.09, 12, 12]} />
        </mesh>
      </group>

      {/* The warm home beyond the door */}
      <mesh ref={glow} position={[0, doorHeight / 2 - 0.4, -9]}>
        <planeGeometry args={[18, 13]} />
        <meshBasicMaterial
          map={glowTex}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.22}
        />
      </mesh>
      <pointLight
        position={[0, 3, -6]}
        color={PALETTE.lamp}
        intensity={11}
        distance={26}
        decay={2}
      />
    </group>
  )
}
