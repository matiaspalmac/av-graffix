"use client"

import { useState, useEffect, useRef, type ReactNode } from "react"
import { usePathname } from "next/navigation"

export default function StickyNav({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false)
  const [navHeight, setNavHeight] = useState(0)
  const hasVisitedRef = useRef(false)
  const navRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const isHome = pathname === "/"

  useEffect(() => {
    if (!isHome) {
      setVisible(true)
      return
    }

    if (!hasVisitedRef.current) {
      hasVisitedRef.current = true
      const onScroll = () => setVisible(window.scrollY > 80)
      onScroll()
      window.addEventListener("scroll", onScroll, { passive: true })
      return () => window.removeEventListener("scroll", onScroll)
    }

    setVisible(true)
  }, [isHome])

  useEffect(() => {
    if (!navRef.current) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setNavHeight(entry.contentRect.height)
      }
    })
    observer.observe(navRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${visible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
          }`}
      >
        {children}
      </div>
      {visible && !isHome && <div style={{ height: navHeight }} aria-hidden="true" />}
    </>
  )
}
