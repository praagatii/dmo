import { useMemo } from 'react'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { LAYERS } from '../../data/layers'
import { LayerPlane } from './LayerPlane'

interface CorridorLayersProps {
  quality: 'full' | 'lite'
}

/**
 * The corridor background. It renders the single full reference image on one
 * plane sized so that, from the start camera, it fills the viewport exactly.
 * As the camera advances the plane grows, giving a gentle walk-in zoom.
 */
export function CorridorLayers({ quality }: CorridorLayersProps) {
  const textures = useLoader(THREE.TextureLoader, LAYERS.map((l) => l.file))

  const srgbTextures = useMemo(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 4
      t.needsUpdate = true
    })
    return textures
  }, [textures])

  const visible = quality === 'full' ? LAYERS : LAYERS.filter((l) => l.id !== 'L12')

  return (
    <group>
      {visible.map((layer) => {
        const index = LAYERS.indexOf(layer)
        return (
          <LayerPlane key={layer.id} texture={srgbTextures[index]} z={layer.z} />
        )
      })}
    </group>
  )
}