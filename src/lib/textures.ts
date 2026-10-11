import * as THREE from 'three'

/**
 * Procedural, self-contained textures.
 * No external image assets, so the scene stays offline-safe, tiny and
 * consistent across devices. All textures are generated once and cached.
 */

const cache = new Map<string, THREE.Texture>()

function rand(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function makeCanvas(size: number) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  return { canvas, ctx, size }
}

function toTexture(canvas: HTMLCanvasElement, repeat: [number, number], key: string) {
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(repeat[0], repeat[1])
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  tex.needsUpdate = true
  cache.set(key, tex)
  return tex
}

export function woodTexture(size = 512): THREE.Texture {
  const key = `wood-${size}`
  if (cache.has(key)) return cache.get(key)!
  const { canvas, ctx } = makeCanvas(size)
  const r = rand(7)
  const grad = ctx.createLinearGradient(0, 0, size, 0)
  grad.addColorStop(0, '#4a2a17')
  grad.addColorStop(0.5, '#6b3d22')
  grad.addColorStop(1, '#43260f')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)

  // Vertical grain streaks
  for (let i = 0; i < 260; i++) {
    const x = r() * size
    const w = 0.5 + r() * 2.5
    const dark = r() > 0.5
    ctx.strokeStyle = dark
      ? `rgba(30,15,6,${0.05 + r() * 0.16})`
      : `rgba(160,110,60,${0.03 + r() * 0.09})`
    ctx.lineWidth = w
    ctx.beginPath()
    ctx.moveTo(x, 0)
    let cx = x
    for (let y = 0; y <= size; y += size / 12) {
      cx += (r() - 0.5) * 6
      ctx.lineTo(cx, y)
    }
    ctx.stroke()
  }
  // Knots
  for (let i = 0; i < 4; i++) {
    const x = r() * size
    const y = r() * size
    const rad = 6 + r() * 12
    const knot = ctx.createRadialGradient(x, y, 1, x, y, rad)
    knot.addColorStop(0, 'rgba(25,12,4,0.55)')
    knot.addColorStop(0.5, 'rgba(60,33,15,0.35)')
    knot.addColorStop(1, 'rgba(60,33,15,0)')
    ctx.fillStyle = knot
    ctx.beginPath()
    ctx.arc(x, y, rad, 0, Math.PI * 2)
    ctx.fill()
  }
  return toTexture(canvas, [1, 1], key)
}

export function wallTexture(size = 512): THREE.Texture {
  const key = `wall-${size}`
  if (cache.has(key)) return cache.get(key)!
  const { canvas, ctx } = makeCanvas(size)
  const r = rand(21)
  ctx.fillStyle = '#d3bb8f'
  ctx.fillRect(0, 0, size, size)

  // Mottled plaster
  for (let i = 0; i < 900; i++) {
    const x = r() * size
    const y = r() * size
    const rad = 4 + r() * 40
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad)
    const warm = r() > 0.5
    g.addColorStop(0, warm ? 'rgba(150,104,60,0.09)' : 'rgba(244,226,192,0.14)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(x, y, rad, 0, Math.PI * 2)
    ctx.fill()
  }
  // Faint horizontal banding, like stacked stone courses
  for (let y = 0; y < size; y += size / 8) {
    ctx.strokeStyle = 'rgba(96,68,40,0.08)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(size, y)
    ctx.stroke()
  }
  return toTexture(canvas, [1, 1], key)
}

export function carpetTexture(size = 512): THREE.Texture {
  const key = `carpet-${size}`
  if (cache.has(key)) return cache.get(key)!
  const { canvas, ctx } = makeCanvas(size)
  const r = rand(91)
  // Deep red field
  ctx.fillStyle = '#7d1f1c'
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 2600; i++) {
    ctx.fillStyle = `rgba(${40 + r() * 90},${8 + r() * 20},${8 + r() * 18},${r() * 0.25})`
    ctx.fillRect(r() * size, r() * size, 2, 2)
  }
  // Cream/gold runner borders near the long edges (x = 0 and x = 1 in UV)
  const band = size * 0.06
  const inner = size * 0.12
  ctx.fillStyle = '#c9a24b'
  ctx.fillRect(0, 0, band, size)
  ctx.fillRect(size - band, 0, band, size)
  ctx.fillStyle = '#e8dcc0'
  ctx.fillRect(band, 0, size * 0.02, size)
  ctx.fillRect(size - band - size * 0.02, 0, size * 0.02, size)

  // Repeated central motif
  ctx.save()
  ctx.translate(size / 2, size / 2)
  ctx.strokeStyle = 'rgba(226,196,124,0.55)'
  ctx.lineWidth = 3
  for (let i = 0; i < 4; i++) {
    ctx.save()
    ctx.rotate((Math.PI / 2) * i)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(size * 0.16, -size * 0.06, size * 0.3, 0)
    ctx.stroke()
    ctx.restore()
  }
  ctx.beginPath()
  ctx.arc(0, 0, size * 0.07, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()
  void inner
  return toTexture(canvas, [1, 1], key)
}

export function stoneTexture(size = 512): THREE.Texture {
  const key = `stone-${size}`
  if (cache.has(key)) return cache.get(key)!
  const { canvas, ctx } = makeCanvas(size)
  const r = rand(133)
  ctx.fillStyle = '#6d5b47'
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 1400; i++) {
    ctx.fillStyle = `rgba(${60 + r() * 70},${50 + r() * 55},${40 + r() * 45},${r() * 0.35})`
    ctx.fillRect(r() * size, r() * size, 3 + r() * 5, 3 + r() * 5)
  }
  const tiles = 2
  const step = size / tiles
  ctx.strokeStyle = 'rgba(28,20,12,0.55)'
  ctx.lineWidth = 3
  for (let i = 0; i <= tiles; i++) {
    ctx.beginPath()
    ctx.moveTo(i * step, 0)
    ctx.lineTo(i * step, size)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, i * step)
    ctx.lineTo(size, i * step)
    ctx.stroke()
  }
  return toTexture(canvas, [1, 1], key)
}

export function doorTexture(size = 512): THREE.Texture {
  const key = `door-${size}`
  if (cache.has(key)) return cache.get(key)!
  const { canvas, ctx } = makeCanvas(size)
  const r = rand(55)
  const grad = ctx.createLinearGradient(0, 0, 0, size)
  grad.addColorStop(0, '#5a3218')
  grad.addColorStop(0.5, '#7a4522')
  grad.addColorStop(1, '#4d2a12')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 200; i++) {
    ctx.strokeStyle = `rgba(35,18,7,${0.04 + r() * 0.12})`
    ctx.lineWidth = 0.5 + r() * 1.6
    const x = r() * size
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x + (r() - 0.5) * 20, size)
    ctx.stroke()
  }
  // Carved panel borders
  const panels = [
    [0.14, 0.08, 0.32, 0.36],
    [0.54, 0.08, 0.32, 0.36],
    [0.14, 0.56, 0.32, 0.36],
    [0.54, 0.56, 0.32, 0.36],
  ]
  ctx.strokeStyle = 'rgba(28,14,5,0.8)'
  ctx.lineWidth = 4
  ctx.strokeRect(size * 0.05, size * 0.03, size * 0.9, size * 0.94)
  for (const [x, y, w, h] of panels) {
    ctx.strokeRect(size * x, size * y, size * w, size * h)
    ctx.strokeStyle = 'rgba(190,140,80,0.18)'
    ctx.lineWidth = 2
    ctx.strokeRect(
      size * x + 6,
      size * y + 6,
      size * w - 12,
      size * h - 12,
    )
    ctx.strokeStyle = 'rgba(28,14,5,0.8)'
    ctx.lineWidth = 4
    // Simple carved rosette in each panel
    ctx.beginPath()
    ctx.arc(size * (x + w / 2), size * (y + h / 2), size * 0.05, 0, Math.PI * 2)
    ctx.stroke()
  }
  return toTexture(canvas, [1, 1], key)
}

/** Warm radial glow used beyond the doorway and for the intro light. */
export function glowTexture(size = 256): THREE.Texture {
  const key = `glow-${size}`
  if (cache.has(key)) return cache.get(key)!
  const { canvas, ctx } = makeCanvas(size)
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  )
  g.addColorStop(0, 'rgba(255,236,196,1)')
  g.addColorStop(0.35, 'rgba(255,190,110,0.75)')
  g.addColorStop(0.7, 'rgba(190,90,40,0.25)')
  g.addColorStop(1, 'rgba(120,40,20,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  cache.set(key, tex)
  return tex
}

export function disposeTextures() {
  cache.forEach((t) => t.dispose())
  cache.clear()
}
