import { useEffect, useState } from 'react'

export type ExperienceMode = 'full' | 'lite' | 'static'

export interface Capability {
  /** Which experience we default to on this device. */
  mode: ExperienceMode
  /** True when the device can render *some* 3D (full or lite). */
  canRender3D: boolean
  /** User prefers reduced motion. */
  reducedMotion: boolean
  /** Why we fell back, for messaging. */
  reason: string | null
}

function hasWebGL(): boolean {
  if (typeof document === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    return Boolean(gl)
  } catch {
    return false
  }
}

function detect(): Capability {
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (typeof window === 'undefined') {
    return { mode: 'static', canRender3D: false, reducedMotion, reason: null }
  }

  if (!hasWebGL()) {
    return {
      mode: 'static',
      canRender3D: false,
      reducedMotion,
      reason: 'WebGL is unavailable on this device.',
    }
  }

  if (reducedMotion) {
    return {
      mode: 'static',
      canRender3D: true,
      reducedMotion,
      reason: 'Reduced-motion preference detected.',
    }
  }

  const cores = navigator.hardwareConcurrency ?? 4
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const narrow = window.innerWidth < 820

  const lowEnd = cores <= 4 || memory <= 2
  const mobile = coarse || narrow

  if (lowEnd || (mobile && cores <= 6)) {
    return { mode: 'lite', canRender3D: true, reducedMotion, reason: null }
  }

  return { mode: 'full', canRender3D: true, reducedMotion, reason: null }
}

export function useCapability(): Capability {
  const [cap, setCap] = useState<Capability>(() => detect())

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setCap(detect())
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return cap
}
