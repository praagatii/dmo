import { useCallback, useEffect, useRef } from 'react'
import gsap from 'gsap'

interface LoaderProps {
  /** True once the 3D hero has finished loading its scene assets. */
  ready: boolean
  reduced: boolean
  /** Called once the loading video has finished (or been skipped). */
  onDone: () => void
}

/**
 * Full-screen loading screen. newloading.mp4 is held on its first frame while
 * the hero loads, then played once; when it ends the overlay fades away and
 * the hero is revealed.
 */
export function Loader({ ready, reduced, onDone }: LoaderProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const stateRef = useRef({ ready, reduced, onDone })
  const doneRef = useRef(false)

  useEffect(() => {
    stateRef.current = { ready, reduced, onDone }
  }, [ready, reduced, onDone])

  const finish = useCallback(() => {
    const current = stateRef.current
    if (!current.ready || doneRef.current) return
    doneRef.current = true
    const el = wrapRef.current
    if (!el || current.reduced) {
      current.onDone()
      return
    }
    gsap.to(el, {
      autoAlpha: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: current.onDone,
    })
  }, [])

  // Hold on frame 1 until the hero is ready; only then start playing.
  useEffect(() => {
    if (!ready || doneRef.current) return
    if (reduced) {
      finish()
      return
    }
    const v = videoRef.current
    if (!v) {
      finish()
      return
    }
    const played = v.play()
    if (played && typeof played.catch === 'function') played.catch(finish)
  }, [ready, reduced, finish])

  return (
    <div className="loader" ref={wrapRef} aria-hidden="true">
      <video
        ref={videoRef}
        className="loader__video"
        src="/newloading.mp4"
        muted
        playsInline
        preload="auto"
        onLoadedData={(e) => {
          e.currentTarget.currentTime = 0
        }}
        onEnded={finish}
        onError={finish}
      />
    </div>
  )
}
