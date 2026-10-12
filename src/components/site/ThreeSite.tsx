import { useEffect, useLayoutEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import * as THREE from 'three'
import { Scene } from '../three/Scene'
import { CORRIDOR } from '../three/config'
import { navSections } from '../../data/restaurant'
import {
  resetScroll,
  scrollState,
  smoothScrollStep,
  updatePointer,
} from '../../lib/scroll'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

interface ThreeSiteProps {
  quality: 'full' | 'lite'
  reduced: boolean
  /** Play the opening once the loading video has finished. */
  active: boolean
  /** Fired once the hero scene has loaded its textures. */
  onReady: () => void
  onExit: () => void
}

const COUNT = navSections.length

/** Scroll range over which the door flash fades in — and back out, in reverse. */
const FLASH_START = 0.9
const FLASH_FULL = 0.99

export function ThreeSite({
  quality,
  reduced,
  active,
  onReady,
  onExit,
}: ThreeSiteProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const flashRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const dimRef = useRef<HTMLDivElement>(null)
  const exitedRef = useRef(false)
  const dpr = quality === 'full' ? 1.8 : 1.25

  // Scroll -> journey progress
  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return

    window.scrollTo(0, 0)
    resetScroll()

    const st = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        scrollState.progress = self.progress
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleY(${self.progress})`
        }
      },
    })

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('resize', refresh)
    const timer = window.setTimeout(refresh, 700)

    return () => {
      st.kill()
      window.removeEventListener('resize', refresh)
      window.clearTimeout(timer)
    }
  }, [])

  // Cinematic opening: begins only after the loading video has finished.
  useEffect(() => {
    if (!active) return
    if (reduced) {
      scrollState.intro = 1
      return
    }
    const proxy = { v: 0 }
    const tween = gsap.to(proxy, {
      v: 1,
      duration: 2.4,
      ease: 'power2.out',
      onUpdate: () => {
        scrollState.intro = proxy.v
      },
    })
    return () => {
      tween.kill()
    }
  }, [active, reduced])

  // Cursor parallax input (window-wide so overlays don't stall it)
  useEffect(() => {
    const onPointer = (e: PointerEvent) => updatePointer(e.clientX, e.clientY)
    const onLeave = () => {
      scrollState.pointerX = 0
      scrollState.pointerY = 0
    }
    window.addEventListener('pointermove', onPointer)
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onPointer)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  // Smooth scroll: ease the shared progress on the GSAP ticker (60fps,
  // frame-rate independent). Everything that reads scrollState.smooth, most
  // notably the 3D camera, therefore glides instead of stepping with scroll.
  // The white door flash is a plain full-screen fade whose opacity tracks the
  // approach to the doorway — so it builds as you arrive and recedes back when
  // you scroll up again.
  useEffect(() => {
    const el = flashRef.current
    const name = nameRef.current
    const dim = dimRef.current
    let last = performance.now()

    const tick = () => {
      const now = performance.now()
      smoothScrollStep((now - last) / 1000)
      last = now

      // Destination: once the doorway flash is fully on (or a reduced-motion
      // user reaches the end), drop into the page content.
      if (!exitedRef.current && scrollState.smooth >= FLASH_FULL) {
        exitedRef.current = true
        onExit()
      }

      // The restaurant name sits centre-screen on desktop: it appears right
      // after the loading screen ends and fades out as soon as the user scrolls.
      // The corridor dims slightly while the name is up.
      if (name && dim) {
        const fadeIn = Math.min(1, Math.max(0, scrollState.intro / 0.2))
        const fadeOut = 1 - Math.min(1, Math.max(0, scrollState.smooth / 0.02))
        const o = fadeIn * fadeOut
        name.style.opacity = String(o)
        name.style.visibility = o > 0.001 ? 'visible' : 'hidden'
        dim.style.opacity = String(o * 0.4)
        dim.style.visibility = o > 0.001 ? 'visible' : 'hidden'
      }

      if (reduced || !el) return
      const t = Math.min(
        1,
        Math.max(
          0,
          (scrollState.smooth - FLASH_START) / (FLASH_FULL - FLASH_START),
        ),
      )
      const eased = t * t * (3 - 2 * t)
      el.style.opacity = String(eased)
      el.style.visibility = eased > 0.001 ? 'visible' : 'hidden'
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [reduced])

  return (
    <>
      <div className="scene-canvas">
        <Canvas
        dpr={dpr}
        shadows={quality === 'full' && !reduced ? 'soft' : false}
        gl={{
          antialias: quality === 'full',
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
        }}
        camera={{
          fov: CORRIDOR.fov,
          near: CORRIDOR.nearPlane,
          far: CORRIDOR.farPlane,
          position: [0, 0, CORRIDOR.cameraStartZ],
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.NoToneMapping
        }}
      >
        <Scene quality={quality} reduced={reduced} onReady={onReady} />
        </Canvas>
      </div>

      <div
        className="scroll-track"
        ref={trackRef}
        style={{ height: `${COUNT * 100}vh` }}
        aria-hidden="true"
      />

      <div className="journey-progress" aria-hidden="true">
        <span ref={progressRef} />
      </div>

      <div className="hero-name-dim" ref={dimRef} aria-hidden="true" />

      <div className="hero-name" ref={nameRef} aria-hidden="true">
        <img
          className="hero-name__img"
          src="/name.png"
          alt=""
          draggable={false}
        />
      </div>

      <div className="flash" ref={flashRef} aria-hidden="true" />
    </>
  )
}
