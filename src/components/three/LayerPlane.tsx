import { useMemo } from 'react'
import * as THREE from 'three'
import { CORRIDOR, PALETTE } from './config'
import { CHECKER_KEY } from '../../data/layers'

interface LayerPlaneProps {
  texture: THREE.Texture
  z: number
  blend?: 'additive'
  opacity?: number
}

/**
 * One full-frame image plane of the multiplane corridor.
 *
 * Sized so that from the start camera (z = 0) it fills the viewport
 * exactly, all planes share the master's vanishing point, and depth
 * matching is exact by construction.
 *
 * Layers that were shipped without alpha get their baked checkerboard
 * removed at render time — the original pixels are never modified.
 */
export function LayerPlane({
  texture,
  z,
  blend,
  opacity = 1,
}: LayerPlaneProps) {
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
        uLumLo: { value: CHECKER_KEY.lumLo },
        uLumHi: { value: CHECKER_KEY.lumHi },
        uChroma: { value: CHECKER_KEY.chroma },
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
        uniform float uLumLo;
        uniform float uLumHi;
        uniform float uChroma;
        uniform float uOpacity;
        varying vec2 vUv;
        void main() {
          vec3 c = texture2D(uMap, vUv).rgb;
          float lum = dot(c, vec3(0.2126, 0.7152, 0.0722));
          float cr = max(max(abs(c.r - c.g), abs(c.g - c.b)), abs(c.b - c.r));
          // Baked checkerboard: discard bright, neutral (chroma-low) pixels.
          bool bg = (lum > uLumHi) || (lum > uLumLo && cr < uChroma);
          if (bg) discard;
          gl_FragColor = vec4(c, uOpacity);
        }
      `,
    })
    if (blend === 'additive') {
      mat.blending = THREE.AdditiveBlending
      mat.transparent = true
      mat.depthWrite = false
      ;(mat as unknown as { renderOrder: number }).renderOrder = 100
    }
    return mat
  }, [texture, blend, opacity])

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