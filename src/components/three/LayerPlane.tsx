import { useMemo } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { CORRIDOR } from './config'

interface LayerPlaneProps {
  texture: THREE.Texture
  z: number
  opacity?: number
}

/**
 * One full-frame image plane sized to always cover the viewport from the
 * start camera. The height matches the vertical frustum at the plane depth;
 * the width is widened to the larger of the image aspect and the actual
 * canvas aspect, so the image fills the window edge-to-edge on any screen
 * (standard "cover" behaviour — cropping is determined by the window, not
 * by the image).
 */
export function LayerPlane({ texture, z, opacity = 1 }: LayerPlaneProps) {
  const size = useThree((s) => s.size)
  const canvasAspect = size.width / size.height

  const dims = useMemo(() => {
    const dist = CORRIDOR.cameraStartZ - z
    const h = CORRIDOR.viewScale * dist
    const w = h * Math.max(CORRIDOR.imageAspect, canvasAspect)
    return { w, h }
  }, [z, canvasAspect])

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
          gl_FragColor = vec4(t.rgb, a);
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