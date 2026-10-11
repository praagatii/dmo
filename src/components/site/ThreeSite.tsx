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
  onExit: () => void
}

const COUNT = navSections.length

/** Door-frame progress threshold that triggers the white flash. */
const DOOR_AT = 0.99

export function ThreeSite({ quality, reduced }: ThreeSiteProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const curtainRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const flashRef = useRef<HTMLDivElement>(null)
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

  // Cinematic opening
  useEffect(() => {
    if (reduced) {
      scrollState.intro = 1
      if (curtainRef.current) curtainRef.current.style.display = 'none'
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
    const curtain = curtainRef.current
    const curtainTween = curtain
      ? gsap.to(curtain, {
          autoAlpha: 0,
          duration: 1.1,
          delay: 0.9,
          ease: 'power2.inOut',
        })
      : null

    return () => {
      tween.kill()
      curtainTween?.kill()
    }
  }, [reduced])

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
  // When the camera arrives at the door, fire a white flash from the screen
  // center that grows to fill the viewport.
  useEffect(() => {
    const el = flashRef.current
    let last = performance.now()
    let prev = 0
    let flashTween: ReturnType<typeof gsap.timeline> | null = null

    const tick = () => {
      const now = performance.now()
      smoothScrollStep((now - last) / 1000)
      last = now
      if (reduced || !el) return
      const p = scrollState.smooth
      if (prev < DOOR_AT && p >= DOOR_AT) {
        flashTween?.kill()
        flashTween = gsap
          .timeline()
          .fromTo(
            el,
            { scale: 0, opacity: 0, visibility: 'visible' },
            { scale: 1, opacity: 1, duration: 0.55, ease: 'power2.in' },
          )
          .to(el, { opacity: 1, duration: 0.25 })
          .to(el, {
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            delay: 0.15,
          })
          .set(el, { visibility: 'hidden' })
      }
      prev = p
    }
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      flashTween?.kill()
    }
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
        <Scene quality={quality} reduced={reduced} />
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

      <div className="curtain" ref={curtainRef} aria-hidden="true">
        <span className="curtain__mark" lang="kn">
          ಊ
        </span>
        <span className="curtain__text">Entering the dodda mane…</span>
      </div>

      <div className="flash" ref={flashRef} aria-hidden="true" />
    </>
  )
}
