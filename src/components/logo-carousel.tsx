"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

interface LogoCarouselProps {
  companies: {
    name: string
    image: string
    imageLight?: string
    imageDark?: string
  }[]
}

export default function LogoCarousel({ companies }: LogoCarouselProps) {
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  useEffect(() => {
    const html = document.documentElement
    const syncTheme = () => {
      setIsDarkTheme(html.classList.contains("dark"))
    }

    syncTheme()

    const observer = new MutationObserver(syncTheme)
    observer.observe(html, { attributes: true, attributeFilter: ["class"] })

    return () => {
      observer.disconnect()
    }
  }, [])

  // Duplicate the list 4x to ensure seamless infinite loop
  const items = [...companies, ...companies, ...companies]

  return (
    <div className="relative w-full overflow-hidden py-8">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 z-10 bg-gradient-to-r from-white dark:from-zinc-900/80 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 z-10 bg-gradient-to-l from-white dark:from-zinc-900/80 to-transparent pointer-events-none" />

      {/* Scrolling track */}
      <div className="flex animate-marquee w-max">
        {items.map((company, i) => (
          (() => {
            const logoSrc = isDarkTheme
              ? company.imageDark ?? company.image
              : company.imageLight ?? company.image

            return (
          <div
            key={`${company.name}-${i}`}
            className="flex flex-col items-center justify-center mx-6 md:mx-10 flex-shrink-0"
          >
            <div className="relative w-24 h-24 md:w-32 md:h-32 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-black/5 dark:border-white/5 flex items-center justify-center">
              <Image
                src={logoSrc}
                alt={company.name}
                fill
                sizes="128px"
                className="object-contain p-3"
              />
            </div>
            <span className="mt-4 text-[10px] md:text-xs font-bold tracking-[0.15em] uppercase text-zinc-400 dark:text-zinc-500 text-center">
              {company.name}
            </span>
          </div>
            )
          })()
        ))}
      </div>
    </div>
  )
}
