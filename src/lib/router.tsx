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

export function Link({
  to,
  className,
  children,
  onClick,
  'aria-label': ariaLabel,
}: {
  to: string
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
        // If already on the target, re-scroll to top.
        if (getPath() === to) {
          e.preventDefault()
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }}
    >
      {children}
    </a>
  )
}
