/**
 * Mode-aware section navigation.
 * In the 3D journey the sections are fixed overlays, so we scroll the tall
 * track to the matching station. In the static fallback we can just use
 * native scrollIntoView.
 */
type Handler = (id: string) => void

let handler: Handler | null = null

export function setSectionHandler(next: Handler | null) {
  handler = next
}

export function goToSection(id: string) {
  if (handler) {
    handler(id)
    return
  }
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
