import { useEffect, useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { LAYERS } from '../../data/layers'
import { LayerPlane } from './LayerPlane'

interface CorridorLayersProps {
  quality: 'full' | 'lite'
  /** Fired once the colour + depth textures are available. */
  onReady?: () => void
}

/**
 * The hero backdrop: the hallway image displaced by its matching depth map,
 * so scroll and cursor become real moves through 3D geometry.
 */
export function CorridorLayers({ onReady }: CorridorLayersProps) {
  const layer = LAYERS[0]
  const [color, depth] = useLoader(THREE.TextureLoader, [
    layer.file,
    layer.depth,
  ])
  const announced = useRef(false)

  // useLoader suspends until both maps are loaded, so this runs when the
  // hero is actually ready to be shown.
  useEffect(() => {
    if (announced.current) return
    announced.current = true
    onReady?.()
  }, [onReady])

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