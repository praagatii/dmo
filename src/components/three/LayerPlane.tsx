import { useMemo } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { CORRIDOR, PARALLAX } from './config'

interface LayerPlaneProps {
  texture: THREE.Texture
  z: number
  opacity?: number
}

/**
 * A single full-frame background image plane sized to always cover the
 * viewport from the start camera. The height matches the vertical frustum
 * at the plane depth; the width is widened to the larger of the image
 * aspect and the actual canvas aspect, so the image fills the window
 * edge-to-edge on any screen (standard cover behaviour).
 *
 * Rendered with a plain MeshBasicMaterial so the on-screen brightness is
 * byte-identical to the source PNG (three's standard sRGB colour pipeline;
 * no custom shading, no premultiplied-alpha tinting).
 */
export function LayerPlane({ texture, z, opacity = 1 }: LayerPlaneProps) {
  const size = useThree((s) => s.size)
  const canvasAspect = size.width / size.height

  const dims = useMemo(() => {
    const dist = CORRIDOR.cameraStartZ - z
    const h = CORRIDOR.viewScale * dist * PARALLAX.margin
    const w = h * Math.max(CORRIDOR.imageAspect, canvasAspect)
    return { w, h }
  }, [z, canvasAspect])

  const material = useMemo(() => {
    const mat = new THREE.MeshBasicMaterial({ map: texture })
    mat.opacity = opacity
    mat.transparent = opacity < 1
    ;(mat as unknown as { renderOrder: number }).renderOrder = z
    return mat
  }, [texture, opacity, z])

  return (
    <mesh
      position={[0, 0, z]}
      material={material}
      geometry={useMemo(
        () => new THREE.PlaneGeometry(dims.w, dims.h),
        [dims.w, dims.h],
      )}
    />
  )
}