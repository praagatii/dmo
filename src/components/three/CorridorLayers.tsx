import { useMemo } from 'react'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { LAYERS } from '../../data/layers'
import { LayerPlane } from './LayerPlane'

interface CorridorLayersProps {
  quality: 'full' | 'lite'
}

/**
 * The multiplane corridor: every supplied layer on its own full-frame
 * plane at the depth recorded in the manifest. All planes are coaxial and
 * parallel, so from the start camera the stack composites to the master
 * reference, and as the camera advances the nearer planes outgrow and pass
 * out of view while the door grows ahead.
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
          <LayerPlane
            key={layer.id}
            texture={srgbTextures[index]}
            z={layer.z}
            blend={layer.blend}
            opacity={layer.opacity}
          />
        )
      })}
    </group>
  )
}