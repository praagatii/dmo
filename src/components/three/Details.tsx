import { useMemo } from 'react'
import * as THREE from 'three'
import { CORRIDOR, PALETTE } from './config'

interface ToranProps {
  /** y of the lintel underside the garland hangs from. */
  baseY: number
  materials: { leaf: THREE.Material; marigoldA: THREE.Material; marigoldB: THREE.Material }
}

/**
 * Toran — the traditional mango-leaf (and marigold) garland strung above a
 * doorway to welcome guests. A small, literally lightweight cultural detail
 * that reinforces the "big house, open door" identity at the journey's end.
 */
export function Toran({ baseY, materials }: ToranProps) {
  const leaves = useMemo(() => {
    const span = CORRIDOR.halfWidth + 0.55
    const sag = 1.05
    const n = 13
    const list: { x: number; y: number; rot: number }[] = []
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1)
      list.push({
        x: -span + 2 * span * t,
        y: baseY - sag * 4 * t * (1 - t),
        rot: (t - 0.5) * 0.8,
      })
    }
    return list
  }, [baseY])

  return (
    <group position={[0, 0, CORRIDOR.doorZ + 0.5]}>
      {leaves.map((leaf, i) => (
        <group key={i} position={[leaf.x, leaf.y, 0]} rotation={[0.18, leaf.rot, leaf.rot * 0.6]}>
          <mesh material={materials.leaf} castShadow={false}>
            <planeGeometry args={[0.42, 0.2]} />
          </mesh>
          {/* tiny stem line */}
          <mesh position={[0, 0.12, -0.02]} material={materials.leaf}>
            <boxGeometry args={[0.02, 0.14, 0.02]} />
          </mesh>
        </group>
      ))}
      {/* marigold accents between the leaves */}
      {leaves.map((leaf, i) =>
        i % 2 === 0 && i < leaves.length - 1 ? (
          <mesh
            key={`mg-${i}`}
            position={[(leaf.x + leaves[i + 1].x) / 2, (leaf.y + leaves[i + 1].y) / 2 - 0.06, 0.05]}
            material={i % 4 === 0 ? materials.marigoldA : materials.marigoldB}
          >
            <sphereGeometry args={[0.08, 10, 8]} />
          </mesh>
        ) : null,
      )}
    </group>
  )
}

interface LanternProps {
  z: number
  materials: { body: THREE.Material; glow: THREE.Material }
}

/**
 * Hanging diya lantern suspended from the ceiling along the corridor
 * centre line. The brass body makes it read as a fixture rather than
 * scenery — strong perspective depth cues and warm pools of light.
 */
export function Lantern({ z, materials }: LanternProps) {
  const { height } = CORRIDOR
  const drop = 1.35
  return (
    <group position={[0, height - 0.35, z]}>
      {/* suspension cord */}
      <mesh material={materials.body}>
        <cylinderGeometry args={[0.02, 0.02, drop, 6]} />
      </mesh>
      {/* brass lamp cage */}
      <mesh position={[0, -drop, 0]} material={materials.body}>
        <cylinderGeometry args={[0.2, 0.24, 0.14, 10]} />
      </mesh>
      {/* rim */}
      <mesh position={[0, -drop + 0.09, 0]} material={materials.body}>
        <cylinderGeometry args={[0.21, 0.21, 0.02, 10]} />
      </mesh>
      {/* flame */}
      <mesh position={[0, -drop - 0.04, 0]} material={materials.glow}>
        <sphereGeometry args={[0.13, 12, 10]} />
      </mesh>
    </group>
  )
}

interface SconceProps {
  side: -1 | 1
  z: number
  materials: { brass: THREE.Material; glow: THREE.Material }
}

/**
 * Small brass wall sconce — a subtle, architectural brass light fixture
 * holding a tiny warm flame. Mounted symmetrically on both walls.
 */
export function Sconce({ side, z, materials }: SconceProps) {
  const x = side * (CORRIDOR.halfWidth - 0.26)
  return (
    <group position={[x, 2.1, z]}>
      {/* bracket arm, angled slightly downward/inward */}
      <mesh material={materials.brass} rotation={[0, side * 0.35, 0]}>
        <cylinderGeometry args={[0.022, 0.032, 0.34, 8]} />
      </mesh>
      {/* collar */}
      <mesh position={[-side * 0.18, 0.01, 0]} material={materials.brass}>
        <cylinderGeometry args={[0.045, 0.045, 0.05, 10]} />
      </mesh>
      {/* flame tip */}
      <mesh position={[-side * 0.18, 0.07, 0]} material={materials.glow}>
        <sphereGeometry args={[0.07, 10, 8]} />
      </mesh>
    </group>
  )
}

export function makeToranMaterials(): ToranProps['materials'] {
  const leaf = new THREE.MeshStandardMaterial({
    color: '#4c7a35',
    roughness: 0.7,
    metalness: 0,
    side: THREE.DoubleSide,
  })
  const marigoldA = new THREE.MeshStandardMaterial({
    color: PALETTE.gold,
    emissive: new THREE.Color('#7a4a12'),
    emissiveIntensity: 0.35,
    roughness: 0.6,
  })
  const marigoldB = new THREE.MeshStandardMaterial({
    color: '#e07a1f',
    emissive: new THREE.Color('#6a2c08'),
    emissiveIntensity: 0.3,
    roughness: 0.6,
  })
  return { leaf, marigoldA, marigoldB }
}