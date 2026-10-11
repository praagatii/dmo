import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { Scene } from '../three/Scene'
import { CORRIDOR } from '../three/config'
import { Overlay } from './Overlay'
import { Nav } from './Nav'
import { navSections } from '../../data/restaurant'
import { resetScroll, scrollState } from '../../lib/scroll'
import { setSectionHandler } from '../../lib/nav'

gsap.registerPlugin(ScrollTrigger)

interface ThreeSiteProps {
  quality: 'full' | 'lite'
  reduced: boolean
  onExit: () => void
}

const COUNT = navSections.length

export function ThreeSite({ quality, reduced, onExit }: ThreeSiteProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const curtainRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const listenerRef = useRef<((p: number) => void) | null>(null)
  const [active, setActive] = useState(0)
  const baseDpr = quality === 'full' ? 1.8 : 1.25
  const [dpr, setDpr] = useState(baseDpr)

  // Scroll -> journey progress
  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return

    window.scrollTo(0, 0)
    resetScroll()
    listenerRef.current?.(0)

    const st = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        scrollState.progress = self.progress
        listenerRef.current?.(self.progress)
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleY(${self.progress})`
        }
        const idx = Math.round(self.progress * (COUNT - 1))
        setActive((prev) => (prev === idx ? prev : idx))
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

  // Section navigation
  useEffect(() => {
    setSectionHandler((id) => {
      const i = navSections.findIndex((s) => s.id === id)
      if (i < 0) return
      const max = document.documentElement.scrollHeight - window.innerHeight
      window.scrollTo({ top: (i / (COUNT - 1)) * max, behavior: 'smooth' })
    })
    return () => setSectionHandler(null)
  }, [])

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
        <PerformanceMonitor
          onIncline={() => setDpr(baseDpr)}
          onDecline={() => setDpr(1)}
        />
        <Scene quality={quality} reduced={reduced} />
        </Canvas>
      </div>

      <Overlay listenerRef={listenerRef} />

      <Nav
        active={active}
        canRender3D
        show3D
        onToggle={onExit}
      />

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
    </>
  )
}
