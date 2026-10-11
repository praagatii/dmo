import { useCallback, useEffect, useRef } from 'react'
import gsap from 'gsap'

interface LoaderProps {
  /** True once the 3D hero has finished loading its scene assets. */
  ready: boolean
  reduced: boolean
  /** Called once the loading video has finished (or been skipped). */
  onDone: () => void
}

/** The clip's flat white slate, keyed out so the hero shows through. */
const KEY: [number, number, number] = [253 / 255, 253 / 255, 253 / 255]
const TOL = 0.12
const SOFT = 0.08

const VERT = `
attribute vec2 a_pos;
uniform vec2 u_scale;
varying vec2 v_uv;
void main() {
  // Cover-fit: sample a centred window of the clip matching the viewport.
  v_uv = (a_pos * 0.5 + 0.5 - 0.5) * u_scale + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

const FRAG = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_tex;
uniform vec3 u_key;
uniform float u_tol;
uniform float u_soft;
void main() {
  vec3 c = texture2D(u_tex, v_uv).rgb;
  float a = smoothstep(u_tol, u_tol + u_soft, distance(c, u_key));
  gl_FragColor = vec4(c, a);
}
`

function buildProgram(gl: WebGLRenderingContext) {
  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)
    if (!s) return null
    gl.shaderSource(s, src)
    gl.compileShader(s)
    return s
  }
  const vs = compile(gl.VERTEX_SHADER, VERT)
  const fs = compile(gl.FRAGMENT_SHADER, FRAG)
  if (!vs || !fs) return null
  const p = gl.createProgram()
  if (!p) return null
  gl.attachShader(p, vs)
  gl.attachShader(p, fs)
  gl.linkProgram(p)
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  return p
}

/**
 * Full-screen loading screen. newloading.mp4 is held on its first frame while
 * the hero loads, then played once. The clip's flat white slate is keyed out
 * in a WebGL shader, so the overlay is transparent and the hero is visible
 * from the very first frame.
 */
export function Loader({ ready, reduced, onDone }: LoaderProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
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

  // Chroma-key the clip onto a transparent canvas.
  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return
    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
    })
    if (!gl) return
    const program = buildProgram(gl)
    if (!program) return
    gl.useProgram(program)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    )
    const aPos = gl.getAttribLocation(program, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    const uScale = gl.getUniformLocation(program, 'u_scale')
    gl.uniform3fv(gl.getUniformLocation(program, 'u_key'), KEY)
    gl.uniform1f(gl.getUniformLocation(program, 'u_tol'), TOL)
    gl.uniform1f(gl.getUniformLocation(program, 'u_soft'), SOFT)
    gl.uniform1i(gl.getUniformLocation(program, 'u_tex'), 0)
    gl.clearColor(0, 0, 0, 0)

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      const w = Math.floor(canvas.clientWidth * dpr)
      const h = Math.floor(canvas.clientHeight * dpr)
      if (w && h && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w
        canvas.height = h
      }
    }
    resize()
    window.addEventListener('resize', resize)

    let raf = 0
    const render = () => {
      raf = requestAnimationFrame(render)
      resize()
      if (!canvas.width || video.readyState < 2) return
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video)
      const va = video.videoWidth / video.videoHeight
      const ca = canvas.width / canvas.height
      gl.uniform2f(uScale, ca > va ? 1 : ca / va, ca > va ? va / ca : 1)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
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
      <canvas className="loader__canvas" ref={canvasRef} />
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
