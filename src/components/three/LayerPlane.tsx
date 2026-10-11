import { useMemo } from 'react'
import * as THREE from 'three'
import { CORRIDOR, PALETTE } from './config'

interface LayerPlaneProps {
  texture: THREE.Texture
  z: number
  opacity?: number
}

/**
 * One full-frame image plane of the multiplane corridor.
 *
 * Sized so that from the start camera (z = 0) it fills the viewport
 * exactly; every plane shares the master's vanishing point and image
 * aspect, so the depths are correct by construction.
 *
 * The supplied layers carry a genuine alpha channel (re-audit: no baked
 * checkerboard). The shader reads the real alpha, writes premultiplied
 * colour, and uses `renderOrder = z` so the painter's order matches the
 * depth stack during the forward camera travel.
 */
export function LayerPlane({ texture, z, opacity = 1 }: LayerPlaneProps) {
  const dims = useMemo(() => {
    const dist = CORRIDOR.cameraStartZ - z
    const h = CORRIDOR.viewScale * dist
    const w = h * CORRIDOR.imageAspect
    return { w, h }
  }, [z])

  const material = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: texture },
        uOpacity: { value: opacity },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uMap;
        uniform float uOpacity;
        varying vec2 vUv;
        void main() {
          vec4 t = texture2D(uMap, vUv);
          float a = t.a * uOpacity;
          if (a < 0.001) discard;
          gl_FragColor = vec4(t.rgb * a, a);
        }
      `,
    })
    mat.transparent = true
    mat.depthWrite = false
    mat.premultipliedAlpha = true
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

export function CorridorBackdrop() {
  const geo = useMemo(() => {
    const h = CORRIDOR.viewScale * 360 * 1.6
    const w = h * CORRIDOR.imageAspect
    return new THREE.PlaneGeometry(w, h)
  }, [])
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: PALETTE.background,
      }),
    [],
  )
  return <mesh position={[0, 0, -360]} material={mat} geometry={geo} />
}