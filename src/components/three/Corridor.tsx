import { useMemo } from 'react'
import * as THREE from 'three'
import { CORRIDOR, PALETTE } from './config'
import { Portal } from './Portal'
import { Doorway } from './Doorway'
import { Lantern, Sconce } from './Details'
import {
  carpetTexture,
  doorTexture,
  stoneTexture,
  wallTexture,
  woodTexture,
} from '../../lib/textures'

interface CorridorProps {
  quality: 'full' | 'lite'
  shadows: boolean
}

export function Corridor({ quality, shadows }: CorridorProps) {
  const { halfWidth, height, nearZ, farZ, carpetHalfWidth, doorZ } = CORRIDOR

  const materials = useMemo(() => {
    const stone = stoneTexture()
    stone.repeat.set(4, 22)

    const pillar = stoneTexture()
    pillar.repeat.set(1.5, 6)

    const wall = wallTexture()
    wall.repeat.set(9, 1.4)

    const wood = woodTexture()
    wood.repeat.set(1, 2)

    const carpet = carpetTexture()
    carpet.repeat.set(1, 14)

    const door = doorTexture()

    const stoneMat = new THREE.MeshStandardMaterial({
      map: stone,
      color: '#b19a80',
      roughness: 0.95,
      metalness: 0.02,
    })
    const pillarMat = new THREE.MeshStandardMaterial({
      map: pillar,
      color: '#b19a80',
      roughness: 0.95,
      metalness: 0.02,
    })
    const wallMat = new THREE.MeshStandardMaterial({
      map: wall,
      color: '#e2cda4',
      roughness: 1,
      metalness: 0,
    })
    const woodMat = new THREE.MeshStandardMaterial({
      map: wood,
      color: '#9c6a3f',
      roughness: 0.72,
      metalness: 0.06,
    })
    const carpetMat = new THREE.MeshStandardMaterial({
      map: carpet,
      color: '#c9302c',
      roughness: 1,
      metalness: 0,
    })
    const doorMat = new THREE.MeshStandardMaterial({
      map: door,
      color: '#a86f3c',
      roughness: 0.6,
      metalness: 0.08,
    })
    const frameMat = new THREE.MeshStandardMaterial({
      color: '#48290f',
      roughness: 0.66,
      metalness: 0.1,
    })
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: '#3c2816',
      roughness: 1,
    })
    const brassMat = new THREE.MeshStandardMaterial({
      color: '#c9a24b',
      metalness: 0.85,
      roughness: 0.3,
    })
    const lampMat = new THREE.MeshStandardMaterial({
      color: PALETTE.lamp,
      emissive: new THREE.Color(PALETTE.lamp),
      emissiveIntensity: 2.4,
      roughness: 0.5,
    })

    return {
      stoneMat,
      wallMat,
      woodMat,
      pillarMat,
      carpetMat,
      doorMat,
      frameMat,
      ceilingMat,
      brassMat,
      lampMat,
    }
  }, [])

  const length = nearZ - farZ
  const centerZ = (nearZ + farZ) / 2
  const floorWidth = halfWidth * 2 + 1

  const arches = useMemo(
    () =>
      Array.from({ length: CORRIDOR.archCount }, (_, i) => ({
        key: i,
        z: CORRIDOR.archFirstZ - i * CORRIDOR.archSpacing,
      })),
    [],
  )

  const sconceZ = useMemo(
    () => (quality === 'full' ? [-6, -12, -18, -24, -30, -36, -42] : [-12, -24, -36]),
    [quality],
  )

  return (
    <group>
      {/* Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, centerZ]}
        material={materials.stoneMat}
        receiveShadow={shadows}
      >
        <planeGeometry args={[floorWidth, length]} />
      </mesh>

      {/* Red carpet runner */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, centerZ]}
        material={materials.carpetMat}
        receiveShadow={shadows}
      >
        <planeGeometry args={[carpetHalfWidth * 2, length]} />
      </mesh>

      {/* Walls */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * halfWidth, 0, 0]}>
          <mesh
            rotation={[0, side * -Math.PI / 2, 0]}
            position={[0, height / 2, centerZ]}
            material={materials.wallMat}
            receiveShadow={shadows}
          >
            <planeGeometry args={[length, height]} />
          </mesh>
          {/* Skirting */}
          <mesh position={[side * -0.15, 0.28, centerZ]} material={materials.woodMat}>
            <boxGeometry args={[0.3, 0.4, length]} />
          </mesh>
          {/* Cornice */}
          <mesh position={[side * -0.2, height - 0.25, centerZ]} material={materials.woodMat}>
            <boxGeometry args={[0.4, 0.5, length]} />
          </mesh>
        </group>
      ))}

      {/* Ceiling */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, height, centerZ]}
        material={materials.ceilingMat}
      >
        <planeGeometry args={[floorWidth, length]} />
      </mesh>

      {/* Ceiling beams */}
      {arches.map((a) => (
        <mesh
          key={`beam-${a.key}`}
          position={[0, height - 0.9, a.z + 3]}
          material={materials.woodMat}
        >
          <boxGeometry args={[halfWidth * 2, 0.5, 0.6]} />
        </mesh>
      ))}

      {/* Arches */}
      {arches.map((a) => (
        <Portal
          key={a.key}
          z={a.z}
          shadows={shadows}
          materials={{
            pillar: materials.pillarMat,
            arch: materials.wallMat,
            wood: materials.woodMat,
          }}
        />
      ))}

      {/* Subtle brass wall sconces — symmetric, architectural light fixtures */}
      {sconceZ.map((z) => (
        <group key={`sconce-${z}`}>
          <Sconce side={-1} z={z} materials={{ brass: materials.brassMat, glow: materials.lampMat }} />
          <Sconce side={1} z={z} materials={{ brass: materials.brassMat, glow: materials.lampMat }} />
        </group>
      ))}

      {/* Hanging brass lanterns down the centre — depth cues and warm pools of light */}
      {(quality === 'full' ? [-10, -22, -34, -44] : [-14, -26, -38]).map((z) => (
        <Lantern
          key={z}
          z={z}
          materials={{ body: materials.brassMat, glow: materials.lampMat }}
        />
      ))}

      {/* Warm interior lighting (few lights, on purpose) */}
      <ambientLight intensity={0.55} color="#ffd7ab" />
      <hemisphereLight args={['#ffca92', '#241609', 0.6]} />
      <directionalLight position={[6, 9, 10]} intensity={0.55} color="#ffd9a6" />

      {quality === 'full' ? (
        <>
          <pointLight position={[0, 3.2, -12]} color={PALETTE.lamp} intensity={14} distance={26} decay={2} />
          <pointLight position={[0, 3.2, -30]} color={PALETTE.lamp} intensity={14} distance={26} decay={2} />
          <pointLight position={[0, 3.2, -44]} color={PALETTE.lamp} intensity={11} distance={22} decay={2} />
        </>
      ) : (
        <pointLight position={[0, 3.2, -26]} color={PALETTE.lamp} intensity={12} distance={36} decay={2} />
      )}

      {shadows && (
        <spotLight
          position={[0, 6, doorZ + 9]}
          angle={0.7}
          penumbra={0.8}
          intensity={45}
          distance={34}
          color="#ffc98a"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0006}
        />
      )}

      <Doorway
        doorMaterial={materials.doorMat}
        frameMaterial={materials.frameMat}
        shadows={shadows}
      />
    </group>
  )
}
