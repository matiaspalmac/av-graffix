"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Building2, Images } from "lucide-react"

const portfolioItems = [
  {
    images: ["/trabajos/aguasaraucania_1.jpeg", "/trabajos/aguasaraucania_2.jpeg"],
    company: "Aguas Araucania",
    category: "Soportes Graficos",
    logo: "/logos/aguasaraucania.svg",
    description: "Fabricacion de senaletica industrial de seguridad y paneles de advertencia para plantas de tratamiento.",
  },
  {
    images: ["/trabajos/cifuentes_1.jpeg", "/trabajos/cifuentes_2.jpeg"],
    company: "Comercializadora Cifuentes",
    category: "Soportes Graficos",
    logo: "/logos/cifuentes.png",
    description: "Rotulacion industrial de maquinaria agricola y branding vehicular para camionetas de servicio.",
  },
  {
    images: ["/trabajos/bidfood_1.jpg", "/trabajos/bidfood_2.jpg"],
    company: "Bidfood",
    category: "Soportes Graficos",
    logo: "/logos/bidfood.png",
    description: "Branding vehicular a gran escala para flota logistica, con graficas envolventes en camiones de reparto.",
  },
  {
    images: ["/trabajos/sofo_1.jpg", "/trabajos/sofo_2.jpg", "/trabajos/sofo_3.jpg"],
    company: "SOFO",
    category: "Productos Promocionales",
    logo: null,
    description: "Produccion de material promocional, pendones y senaletica de stands para ferias agropecuarias masivas.",
  },
  {
    images: ["/trabajos/prt_1.jpg", "/trabajos/prt_2.jpg"],
    company: "PRT",
    category: "Soportes Graficos",
    logo: null,
    description: "Senaletica vial e informativa corporativa para plantas de revision tecnica vehicular.",
  },
  {
    images: ["/trabajos/farellones_1.jpeg"],
    company: "Farellones Automotriz",
    category: "Soportes Graficos",
    logo: "/logos/farellones_automotriz.svg",
    description: "Totems publicitarios exteriores y senaletica de showroom para concesionaria automotriz.",
  },
  {
    images: ["/trabajos/b2autos_1.jpeg", "/trabajos/b2autos_2.jpeg"],
    company: "B2 Autos",
    category: "Soportes Graficos",
    logo: null,
    description: "Rotulacion completa de vehiculos y senaletica exterior para puntos de venta automotriz.",
  },
  {
    images: ["/trabajos/minimarketisabella_1.jpeg", "/trabajos/minimarketisabella_2.jpeg", "/trabajos/minimarketisabella_3.jpeg"],
    company: "Minimarket Isabella",
    category: "Soportes Graficos",
    logo: null,
    description: "Senaletica integral de fachada, letrero principal.",
  },
]

const categories = ["Todos", ...Array.from(new Set(portfolioItems.map(i => i.category)))]

type LightboxState = {
  itemIndex: number
  photoIndex: number
}

export default function PortfolioGrid() {
  const [active, setActive] = useState("Todos")
  const [lightbox, setLightbox] = useState<LightboxState | null>(null)
  const [direction, setDirection] = useState(0)

  const touchStartX = useRef(0)
  const touchDeltaX = useRef(0)
  const isSwiping = useRef(false)
  const lightboxRef = useRef<HTMLDivElement>(null)

  const filtered = active === "Todos" ? portfolioItems : portfolioItems.filter(i => i.category === active)
  const currentItem = lightbox !== null ? filtered[lightbox.itemIndex] : null

  const openLightbox = (itemIndex: number, photoIndex = 0) => {
    setDirection(0)
    setLightbox({ itemIndex, photoIndex })
  }

  const closeLightbox = () => setLightbox(null)

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightbox) {
      const scrollY = window.scrollY
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = "0"
      document.body.style.right = "0"
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.position = ""
        document.body.style.top = ""
        document.body.style.left = ""
        document.body.style.right = ""
        document.body.style.overflow = ""
        window.scrollTo(0, scrollY)
      }
    }
  }, [lightbox])

  const goNextPhoto = useCallback(() => {
    if (!lightbox || !currentItem) return
    if (currentItem.images.length <= 1) return
    setDirection(1)
    setLightbox(prev => prev ? { ...prev, photoIndex: (prev.photoIndex + 1) % currentItem.images.length } : null)
  }, [lightbox, currentItem])

  const goPrevPhoto = useCallback(() => {
    if (!lightbox || !currentItem) return
    if (currentItem.images.length <= 1) return
    setDirection(-1)
    setLightbox(prev => prev ? { ...prev, photoIndex: (prev.photoIndex - 1 + currentItem.images.length) % currentItem.images.length } : null)
  }, [lightbox, currentItem])

  // Touch handlers - only horizontal swipe for photo navigation
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchDeltaX.current = 0
    isSwiping.current = false
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartX.current
    touchDeltaX.current = dx

    // Once we detect a horizontal swipe, prevent default to stop page scroll
    if (Math.abs(dx) > 10 && !isSwiping.current) {
      isSwiping.current = true
    }

    if (isSwiping.current) {
      e.preventDefault()
      e.stopPropagation()
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    const dx = touchDeltaX.current
    const THRESHOLD = 60

    if (Math.abs(dx) > THRESHOLD) {
      if (dx < 0) goNextPhoto()
      else goPrevPhoto()
    }

    touchStartX.current = 0
    touchDeltaX.current = 0
    isSwiping.current = false
  }, [goNextPhoto, goPrevPhoto])

  // Keyboard navigation
  useEffect(() => {
    if (!lightbox) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNextPhoto()
      if (e.key === "ArrowLeft") goPrevPhoto()
      if (e.key === "Escape") closeLightbox()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [lightbox, goNextPhoto, goPrevPhoto])

  // Slide variants for image transitions
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir >= 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir >= 0 ? -300 : 300,
      opacity: 0,
    }),
  }

  return (
    <div className="max-w-7xl mx-auto">

      {/* ─── LIGHTBOX ──────────────────────────────────── */}
      <AnimatePresence>
        {lightbox !== null && currentItem && (
          <motion.div
            key="lightbox-overlay"
            ref={lightboxRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ touchAction: "none" }}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-950/90 backdrop-blur-sm"
              onClick={closeLightbox}
            />

            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full bg-zinc-800/80 hover:bg-brand-600 text-white flex items-center justify-center backdrop-blur-sm border border-white/10 transition-colors duration-200"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>

            {/* Counter */}
            {currentItem.images.length > 1 && (
              <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20 text-white/70 text-sm font-semibold tabular-nums bg-zinc-800/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                {lightbox.photoIndex + 1} / {currentItem.images.length}
              </div>
            )}

            {/* Navigation arrows - Desktop */}
            {currentItem.images.length > 1 && (
              <>
                <button
                  className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-zinc-800/60 hover:bg-brand-600 text-white items-center justify-center backdrop-blur-sm border border-white/10 transition-colors duration-200"
                  onClick={goPrevPhoto}
                  aria-label="Foto anterior"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-zinc-800/60 hover:bg-brand-600 text-white items-center justify-center backdrop-blur-sm border border-white/10 transition-colors duration-200"
                  onClick={goNextPhoto}
                  aria-label="Foto siguiente"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            {/* Main content area */}
            <div
              className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4 md:px-20 py-16 md:py-20"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image area */}
              <div className="relative flex-1 w-full max-w-5xl flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="popLayout" custom={direction}>
                  <motion.div
                    key={currentItem.company + "-" + lightbox.photoIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Image
                      src={currentItem.images[lightbox.photoIndex]}
                      alt={`${currentItem.company} foto ${lightbox.photoIndex + 1}`}
                      fill
                      className="object-contain select-none pointer-events-none"
                      priority
                      unoptimized
                      draggable={false}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom info bar */}
              <div className="w-full max-w-5xl mt-4 md:mt-6 flex-shrink-0">
                <div className="flex items-center gap-4 bg-zinc-900/80 backdrop-blur-md rounded-2xl px-5 py-4 border border-white/5">
                  {/* Logo */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden">
                    {currentItem.logo ? (
                      <Image
                        src={currentItem.logo}
                        alt={currentItem.company}
                        width={32}
                        height={32}
                        className="object-contain p-1"
                        unoptimized
                      />
                    ) : (
                      <Building2 size={18} className="text-zinc-500" />
                    )}
                  </div>
                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-white font-bold text-sm md:text-base truncate">{currentItem.company}</h2>
                    <p className="text-zinc-400 text-xs md:text-sm truncate">{currentItem.description}</p>
                  </div>
                  {/* Thumbnail dots */}
                  {currentItem.images.length > 1 && (
                    <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
                      {currentItem.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setDirection(idx > lightbox.photoIndex ? 1 : -1)
                            setLightbox(prev => prev ? { ...prev, photoIndex: idx } : null)
                          }}
                          className={`rounded-full transition-all duration-200 ${
                            idx === lightbox.photoIndex
                              ? "w-6 h-2 bg-brand-500"
                              : "w-2 h-2 bg-zinc-600 hover:bg-zinc-400"
                          }`}
                          aria-label={`Ver foto ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Filter Tabs ─────────────────────────────── */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 ${
              active === cat
                ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30"
                : "bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ─── Grid ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-24">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, index) => (
            <motion.article
              key={item.company + "-" + index}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, delay: index * 0.04, ease: "easeOut" }}
              onClick={() => openLightbox(index)}
              className="group relative bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl hover:shadow-zinc-900/5 dark:hover:shadow-black/20 transition-all duration-300 cursor-pointer"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800/50">
                <Image
                  src={item.images[0]}
                  alt={item.company}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority={index < 6}
                  unoptimized
                  onLoad={(e) => {
                    const img = e.target as HTMLImageElement
                    if (img.naturalWidth === 0) img.src = "/avgraffix.png"
                  }}
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-zinc-950/0 group-hover:bg-zinc-950/30 transition-colors duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm font-semibold bg-brand-600 px-4 py-2 rounded-full shadow-lg">
                    Ver proyecto
                  </span>
                </div>

                {/* Multiple photos badge */}
                {item.images.length > 1 && (
                  <div className="absolute top-3 right-3 bg-zinc-900/70 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5">
                    <Images size={12} />
                    {item.images.length}
                  </div>
                )}
              </div>

              {/* Card info */}
              <div className="p-5">
                <p className="text-[11px] font-bold tracking-wider uppercase text-brand-600 dark:text-brand-500 mb-1">{item.category}</p>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1.5 text-balance">{item.company}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed line-clamp-2">{item.description}</p>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
