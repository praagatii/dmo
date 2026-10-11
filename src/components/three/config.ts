export const CORRIDOR = {
  halfWidth: 3.4,
  height: 8.3,
  /** z of the near end (behind the camera start). */
  nearZ: 4,
  /** z of the far end / beyond the doorway. */
  farZ: -58,

  archCount: 8,
  archFirstZ: -3,
  archSpacing: 6,

  columnWidth: 0.7,
  columnHeight: 4.7,
  archDepth: 0.7,
  archTube: 0.3,

  carpetHalfWidth: 1.55,

  doorZ: -48,
  doorHeight: 4.7,

  cameraStartZ: 6.5,
  cameraEndZ: -50,
  eyeHeight: 1.65,
} as const

export const PALETTE = {
  fog: '#1c120c',
  background: '#20150e',
  lamp: '#ffb066',
  wood: '#6b3d22',
  gold: '#c8922f',
  leaf: '#4f7a3a',
  terracotta: '#b5502f',
} as const
