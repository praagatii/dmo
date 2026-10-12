// Tiny dependency-free hash router. Hash URLs (`#/order`) survive hard
// refreshes on any static host with no server rewrites, which satisfies the
// "direct page URLs and refreshes work" requirement.
import {
  useSyncExternalStore,
  type MouseEvent,
  type ReactNode,
} from 'react'

function getPath(): string {
  if (typeof window === 'undefined') return '/'
  const h = window.location.hash.replace(/^#/, '')
  return h.length > 0 ? h : '/'
}

const listeners = new Set<() => void>()

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => {
    listeners.forEach((l) => l())
  })
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

export function useRoute(): string {
  return useSyncExternalStore(subscribe, getPath, () => '/')
}

export function navigate(to: string) {
  const target = to.startsWith('/') ? to : `/${to}`
  if (getPath() === target) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  window.location.hash = target
}

/** Navigate to a route, then smooth-scroll to a section id on that route. */
export function navigateToSection(to: string, section: string) {
  const target = to.startsWith('/') ? to : `/${to}`
  const scroll = () => {
    document.getElementById(section)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
  if (getPath() === target) {
    scroll()
    return
  }
  window.location.hash = target
  // Wait for the hashchange render before scrolling to the new element.
  window.setTimeout(scroll, 90)
}

export function Link({
  to,
  section,
  className,
  children,
  onClick,
  'aria-label': ariaLabel,
}: {
  to: string
  section?: string
  className?: string
  children: ReactNode
  onClick?: () => void
  'aria-label'?: string
}) {
  return (
    <a
      href={`#${to}`}
      className={className}
      aria-label={ariaLabel}
      onClick={(e: MouseEvent) => {
        onClick?.()
        // If already on the target, re-scroll to top (or to the section).
        if (getPath() === to) {
          e.preventDefault()
          if (section) {
            document
              .getElementById(section)
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }
        } else if (section) {
          e.preventDefault()
          navigateToSection(to, section)
        }
      }}
    >
      {children}
    </a>
  )
}
