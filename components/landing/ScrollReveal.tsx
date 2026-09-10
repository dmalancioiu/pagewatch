'use client'
import { useEffect } from 'react'

/**
 * Mount once on the landing page. Elements marked `data-animate` get
 * `data-visible` added the first time they cross into view — paired with the
 * `data-[visible]:opacity-100 data-[visible]:translate-y-0` utility classes
 * on those elements. Kept deliberately subtle (160ms, one property) per
 * docs/DESIGN_SYSTEM.md §5 — this is not the float/pulse-glow animation it
 * replaces.
 */
export function ScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-animate]'))
    if (!els.length) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.setAttribute('data-visible', ''))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute('data-visible', '')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -36px 0px' }
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return null
}
