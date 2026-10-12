import { useMemo } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { CORRIDOR, DEPTH, PARALLAX } from './config'

interface LayerPlaneProps {
  /** Colour map (the hallway image). */
  texture: THREE.Texture
  /** Monochrome depth map, white = near. Optional -> flat plane. */
  depthTexture?: THREE.Texture
  /** Base world-space z of the backdrop. */
  z: number
  opacity?: number
}

function readDepthGrid(
  image: HTMLImageElement | ImageBitmap,
  gw: number,
  gh: number,
): Float32Array {
  const canvas = document.createElement('canvas')
  canvas.width = gw
  canvas.height = gh
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return new Float32Array(gw * gh)
  ctx.drawImage(image, 0, 0, gw, gh)
  const px = ctx.getImageData(0, 0, gw, gh).data
  const out = new Float32Array(gw * gh)
  for (let i = 0; i < gw * gh; i++) out[i] = px[i * 4] / 255
  return out
}

/**
 * The hero backdrop: one hallway image mapped onto a depth-extruded grid.
 * The grid sits at `z` (the doorway) and each vertex is pushed toward the
 * camera by its depth value (white = near) times CORRIDOR.tunnelDepth, so the
 * floor, walls and ceiling nearest the viewer come right up to the camera and
 * the doorway recedes far away — a real corridor rather than a flat card.
 * Cursor and scroll become real camera moves through that geometry.
 *
 * Sizing keeps the near rim cover-fitting the frame (PARALLAX.margin), so
 * advancing z never exposes an edge. The colour map is applied with
 * MeshBasicMaterial for byte-exact brightness.
 */
export function LayerPlane({
  texture,
  depthTexture,
  z,
  opacity = 1,
}: LayerPlaneProps) {
  const size = useThree((s) => s.size)
  const canvasAspect = size.width / size.height

  const dims = useMemo(() => {
    // The corridor is sized so its NEAR rim (the floor/walls at the viewer)
    // fills the frame from the start camera — that rim is what frames the
    // entrance. The far doorway then recedes to a small opening in the middle.
    const nearZ = z + CORRIDOR.tunnelDepth
    const refDist = CORRIDOR.cameraStartZ - nearZ
    const fillH = CORRIDOR.viewScale * refDist
    const h =
      fillH *
      Math.max(1, canvasAspect / CORRIDOR.imageAspect) *
      PARALLAX.margin
    const w = h * CORRIDOR.imageAspect
    return { w, h }
  }, [z, canvasAspect])

  // Seat the corridor's vanishing point on the camera's level line (plain
  // geometry — no filters or post effects). See CORRIDOR.horizonRow.
  const yOffset = (CORRIDOR.horizonRow - 0.5) * dims.h

  const depth = useMemo(() => {
    const img = depthTexture?.image as
      | HTMLImageElement
      | ImageBitmap
      | undefined
    if (!img || !img.width || !img.height) return null
    const gw = DEPTH.grid
    const gh = Math.max(1, Math.round(gw * (img.height / img.width)))
    return { gw, data: readDepthGrid(img, gw, gh) }
  }, [depthTexture])

  const geometry = useMemo(() => {
    if (!depth) return new THREE.PlaneGeometry(dims.w, dims.h)

    const segW = DEPTH.segments
    const segH = Math.max(1, Math.round((DEPTH.segments * dims.h) / dims.w))
    const geo = new THREE.PlaneGeometry(dims.w, dims.h, segW, segH)
    const pos = geo.attributes.position as THREE.BufferAttribute
    const uv = geo.attributes.uv as THREE.BufferAttribute
    const { gw, data } = depth
    const gh = data.length / gw
    for (let i = 0; i < pos.count; i++) {
      const d = bilinear(data, uv.getX(i), uv.getY(i), gw, gh)
      pos.setZ(i, d * CORRIDOR.tunnelDepth)
    }
    return geo
  }, [dims.w, dims.h, depth])

  const material = useMemo(() => {
    const mat = new THREE.MeshBasicMaterial({ map: texture })
    mat.opacity = opacity
    mat.transparent = opacity < 1
    ;(mat as unknown as { renderOrder: number }).renderOrder = z
    return mat
  }, [texture, opacity, z])

  return (
    <mesh
      position={[0, yOffset, z]}
      material={material}
      geometry={geometry}
    />
  )
}

/** Bilinear sample of a depth grid at vertex UV (v: 1 = image top). */
function bilinear(
  d: Float32Array,
  u: number,
  v: number,
  gw: number,
  gh: number,
): number {
  const gx = u * (gw - 1)
  const gy = (1 - v) * (gh - 1)
  const x0 = Math.floor(gx)
  const y0 = Math.floor(gy)
  const x1 = Math.min(x0 + 1, gw - 1)
  const y1 = Math.min(y0 + 1, gh - 1)
  const fx = gx - x0
  const fy = gy - y0
  const top = d[y0 * gw + x0] + (d[y0 * gw + x1] - d[y0 * gw + x0]) * fx
  const bottom = d[y1 * gw + x0] + (d[y1 * gw + x1] - d[y1 * gw + x0]) * fx
  return top + (bottom - top) * fy
}