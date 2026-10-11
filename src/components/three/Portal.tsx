import * as THREE from 'three'
import { CORRIDOR } from './config'

interface PortalProps {
  z: number
  materials: {
    pillar: THREE.Material
    arch: THREE.Material
    wood: THREE.Material
  }
  shadows: boolean
}

/**
 * A single architectural arch spanning the corridor.
 * Two columns + a semicircular head, with capitals and a keystone.
 */
export function Portal({ z, materials, shadows }: PortalProps) {
  const { halfWidth, columnWidth, columnHeight, archDepth, archTube } = CORRIDOR
  const colCenterX = halfWidth - columnWidth / 2
  const radius = halfWidth - columnWidth / 2

  return (
    <group position={[0, 0, z]}>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * colCenterX, 0, 0]}>
          <mesh
            position={[0, columnHeight / 2, 0]}
            material={materials.pillar}
            castShadow={shadows}
            receiveShadow={shadows}
          >
            <boxGeometry args={[columnWidth, columnHeight, archDepth]} />
          </mesh>
          {/* Capital */}
          <mesh
            position={[0, columnHeight - 0.12, 0]}
            material={materials.wood}
            castShadow={shadows}
          >
            <boxGeometry args={[columnWidth + 0.28, 0.32, archDepth + 0.24]} />
          </mesh>
          {/* Base plinth */}
          <mesh position={[0, 0.16, 0]} material={materials.wood}>
            <boxGeometry args={[columnWidth + 0.34, 0.34, archDepth + 0.3]} />
          </mesh>
        </group>
      ))}

{/* Arch head */}
      <mesh
        position={[0, columnHeight, 0]}
        material={materials.arch}
        castShadow={shadows}
      >
        <torusGeometry args={[radius, archTube, 8, 30, Math.PI]} />
      </mesh>

      {/* Keystone */}
      <mesh
        position={[0, columnHeight + radius + 0.05, 0]}
        material={materials.wood}
        castShadow={shadows}
      >
        <boxGeometry args={[0.7, 0.6, archDepth + 0.14]} />
      </mesh>
    </group>
  )
}
