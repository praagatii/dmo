import { useLayoutEffect } from 'react'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { LAYERS } from '../../data/layers'
import { LayerPlane } from './LayerPlane'

interface CorridorLayersProps {
  quality: 'full' | 'lite'
}

/**
 * The hero backdrop: the hallway image displaced by its matching depth map,
 * so scroll and cursor become real moves through 3D geometry.
 */
export function CorridorLayers(_props: CorridorLayersProps) {
  const layer = LAYERS[0]
  const [color, depth] = useLoader(THREE.TextureLoader, [
    layer.file,
    layer.depth,
  ])

  // Colour-manage only the colour map: sRGB decode so the standard shader
  // pipeline re-encodes it to a byte-exact image (the depth map is only
  // sampled for geometry, never displayed).
  useLayoutEffect(() => {
    color.colorSpace = THREE.SRGBColorSpace
    color.anisotropy = 4
    color.needsUpdate = true
  }, [color])

  return <LayerPlane texture={color} depthTexture={depth} z={layer.z} />
}