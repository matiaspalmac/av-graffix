"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Building2, Images } from "lucide-react"

const portfolioItems = [
  {
    images: ["/trabajos/aguasaraucania_1.jpeg", "/trabajos/aguasaraucania_2.jpeg"],
    company: "Aguas Araucanía",
    category: "Señalética Industrial y de Seguridad",
    logo: "/logos/aguasaraucania.svg",
    description: "Fabricación de señalética industrial de seguridad y paneles de advertencia para plantas de tratamiento.",
  },
  {
    images: ["/trabajos/cifuentes_1.jpeg", "/trabajos/cifuentes_2.jpeg"],
    company: "Comercializadora Cifuentes",
    category: "Rotulación y Branding Vehicular",
    logo: "/logos/cifuentes.png",
    description: "Rotulación industrial de maquinaria agrícola y branding vehicular para camionetas de servicio.",
  },
  {
    images: ["/trabajos/bidfood_1.jpg", "/trabajos/bidfood_2.jpg"],
    company: "Bidfood",
    category: "Rotulación y Branding Vehicular",
    logo: "/logos/bidfood.png",
    description: "Branding vehicular a gran escala para flota logística, con gráficas envolventes en camiones de reparto.",
  },
  {
    images: ["/trabajos/sofo_1.jpg", "/trabajos/sofo_2.jpg", "/trabajos/sofo_3.jpg"],
    company: "SOFO & Super Cerdo",
    category: "Material Promocional y Eventos",
    logo: null,
    description: "Producción de material promocional, pendones y señalética de stands para ferias agropecuarias masivas.",
  },
  {
    images: ["/trabajos/prt_1.jpg", "/trabajos/prt_2.jpg", "/trabajos/prt_3.jpeg"],
    company: "PRT",
    category: "Señalética Industrial y de Seguridad",
    logo: null,
    description: "Señalética vial e informativa corporativa para plantas de revisión técnica vehicular.",
  },
  {
    images: ["/trabajos/farellones_1.jpeg"],
    company: "Farellones Automotriz",
    category: "Señalética Comercial y Fachadas",
    logo: "/logos/farellones_automotriz.svg",
    description: "Tótems publicitarios exteriores y señalética de showroom para concesionaria automotriz.",
  },
  {
    images: ["/trabajos/b2autos_1.jpeg", "/trabajos/b2autos_2.jpeg"],
    company: "B2 Autos",
    category: "Rotulación y Branding Vehicular",
    logo: null,
    description: "Rotulación completa de vehículos y señalética exterior para puntos de venta automotriz.",
  },
  {
    images: ["/trabajos/minimarketisabella_1.jpeg", "/trabajos/minimarketisabella_2.jpeg", "/trabajos/minimarketisabella_3.jpeg"],
    company: "Minimarket Isabella",
    category: "Señalética Comercial y Fachadas",
    logo: null,
    description: "Señalética integral de fachada y letrero principal.",
  },
];

const categories = ["Todos", ...Array.from(new Set(portfolioItems.map(i => i.category)))]

type LightboxState = {
  itemIndex: number
  photoIndex: number
}

type SlideDirection = "left" | "right" | "up" | "down"


export default function PortfolioGrid() {
  const imageAreaRef = useRef<HTMLDivElement>(null)

  const [active, setActive] = useState("Todos")
  const [lightbox, setLightbox] = useState<LightboxState | null>(null)
  const [slideDir, setSlideDir] = useState<SlideDirection>("right")

  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const touchDeltaX = useRef(0)
  const touchDeltaY = useRef(0)
  const swipeAxis = useRef<"none" | "horizontal" | "vertical">("none")

  const filtered = active === "Todos" ? portfolioItems : portfolioItems.filter(i => i.category === active)
  const currentItem = lightbox !== null ? filtered[lightbox.itemIndex] : null

  const openLightbox = (itemIndex: number, photoIndex = 0) => {
    setSlideDir("right")
    setLightbox({ itemIndex, photoIndex })
  }

  const closeLightbox = () => setLightbox(null)

  // Lock body scroll
  useEffect(() => {
    if (lightbox) {
      document.documentElement.style.overflow = "hidden"
      document.body.style.overflow = "hidden"
      return () => {
        document.documentElement.style.overflow = ""
        document.body.style.overflow = ""
      }
    }
  }, [lightbox])
  
  const goNextPhoto = useCallback(() => {
    if (!lightbox || !currentItem || currentItem.images.length <= 1) return
    setSlideDir("right")
    setLightbox(prev => prev ? { ...prev, photoIndex: (prev.photoIndex + 1) % currentItem.images.length } : null)
  }, [lightbox, currentItem])

  const goPrevPhoto = useCallback(() => {
    if (!lightbox || !currentItem || currentItem.images.length <= 1) return
    setSlideDir("left")
    setLightbox(prev => prev ? { ...prev, photoIndex: (prev.photoIndex - 1 + currentItem.images.length) % currentItem.images.length } : null)
  }, [lightbox, currentItem])

  const goNextCompany = useCallback(() => {
    if (!lightbox) return
    setSlideDir("down")
    const next = (lightbox.itemIndex + 1) % filtered.length
    setLightbox({ itemIndex: next, photoIndex: 0 })
  }, [lightbox, filtered.length])

  const goPrevCompany = useCallback(() => {
    if (!lightbox) return
    setSlideDir("up")
    const prev = (lightbox.itemIndex - 1 + filtered.length) % filtered.length
    setLightbox({ itemIndex: prev, photoIndex: 0 })
  }, [lightbox, filtered.length])
  
  useEffect(() => {
    if (!lightbox) return
    let lastScroll = 0
    const THROTTLE_MS = 400
    const handler = (e: WheelEvent) => {
      const now = Date.now()
      if (now - lastScroll < THROTTLE_MS) return
      lastScroll = now
      e.preventDefault()
      // Only vertical scroll
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        if (e.deltaY > 0) {
          goNextCompany()
        } else if (e.deltaY < 0) {
          goPrevCompany()
        }
      }
    }
    document.addEventListener("wheel", handler, { passive: false })
    return () => document.removeEventListener("wheel", handler)
  }, [lightbox, goNextCompany, goPrevCompany])

  // Touch handlers — FIXED: swipe right = go to previous (image follows finger)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    touchDeltaX.current = 0
    touchDeltaY.current = 0
    swipeAxis.current = "none"
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartX.current
    const dy = e.touches[0].clientY - touchStartY.current
    touchDeltaX.current = dx
    touchDeltaY.current = dy

    if (swipeAxis.current === "none" && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
      swipeAxis.current = Math.abs(dx) >= Math.abs(dy) ? "horizontal" : "vertical"
    }

    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleTouchEnd = useCallback(() => {
    const dx = touchDeltaX.current
    const dy = touchDeltaY.current
    const THRESHOLD = 50

    if (swipeAxis.current === "horizontal" && Math.abs(dx) > THRESHOLD) {
      // Swipe left (finger goes left, dx < 0) = next photo
      // Swipe right (finger goes right, dx > 0) = previous photo
      if (dx > 0) goPrevPhoto()
      else goNextPhoto()
    } else if (swipeAxis.current === "vertical" && Math.abs(dy) > THRESHOLD) {
      // Swipe up (finger goes up, dy < 0) = next company
      // Swipe down (finger goes down, dy > 0) = previous company
      if (dy > 0) goPrevCompany()
      else goNextCompany()
    }

    touchStartX.current = 0
    touchStartY.current = 0
    touchDeltaX.current = 0
    touchDeltaY.current = 0
    swipeAxis.current = "none"
  }, [goNextPhoto, goPrevPhoto, goNextCompany, goPrevCompany])

  // Keyboard navigation
  useEffect(() => {
    if (!lightbox) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNextPhoto()
      if (e.key === "ArrowLeft") goPrevPhoto()
      if (e.key === "ArrowDown") { e.preventDefault(); goNextCompany() }
      if (e.key === "ArrowUp") { e.preventDefault(); goPrevCompany() }
      if (e.key === "Escape") closeLightbox()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [lightbox, goNextPhoto, goPrevPhoto, goNextCompany, goPrevCompany])

  // Slide variants
  const getVariants = (dir: SlideDirection) => {
    const offset = 220
    const axes: Record<SlideDirection, { x: number; y: number }> = {
      left: { x: -offset, y: 0 },
      right: { x: offset, y: 0 },
      up: { x: 0, y: -offset },
      down: { x: 0, y: offset },
    }
    const enter = axes[dir]
    return {
      enter: { x: enter.x, y: enter.y, opacity: 0 },
      center: { x: 0, y: 0, opacity: 1 },
      exit: { x: -enter.x, y: -enter.y, opacity: 0 },
    }
  }

  return (
    <div className="max-w-7xl mx-auto">

      {/* ─── LIGHTBOX ──────────────────────────────────── */}
      <AnimatePresence>
        {lightbox !== null && currentItem && (
          <motion.div
            key="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ touchAction: "none", transition: "none" }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Backdrop — fully opaque */}
            <div
              className="absolute inset-0 bg-zinc-50 dark:bg-zinc-950"
              style={{ transition: "none" }}
              onClick={closeLightbox}
            />

            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full bg-zinc-200 dark:bg-zinc-800 hover:bg-brand-600 text-zinc-700 dark:text-zinc-200 hover:text-white flex items-center justify-center border border-zinc-300 dark:border-zinc-700"
              style={{ transition: "background-color 0.15s, color 0.15s" }}
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>

            {/* Counter — mobile + desktop */}
            {currentItem.images.length > 1 && (
              <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20 text-zinc-600 dark:text-zinc-400 text-sm font-semibold tabular-nums bg-zinc-200 dark:bg-zinc-800 px-3 py-1.5 rounded-full border border-zinc-300 dark:border-zinc-700" style={{ transition: "none" }}>
                {lightbox.photoIndex + 1} / {currentItem.images.length}
              </div>
            )}

            {/* Desktop: Right-side navigation indicator panel (replaces arrow buttons) */}
            <div className="hidden md:flex absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-6" style={{ transition: "none" }}>
              {/* Vertical company nav */}
              <div className="flex flex-col items-center gap-2 bg-zinc-200/80 dark:bg-zinc-800/80 rounded-2xl px-2.5 py-3 border border-zinc-300 dark:border-zinc-700">
                <button
                  onClick={goPrevCompany}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-zinc-300 dark:hover:bg-zinc-700"
                  style={{ transition: "background-color 0.15s, color 0.15s" }}
                  aria-label="Empresa anterior"
                >
                  <ChevronUp size={16} />
                </button>
                <div className="flex flex-col items-center gap-1 py-1">
                  {filtered.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSlideDir(idx > lightbox.itemIndex ? "up" : "down")
                        setLightbox({ itemIndex: idx, photoIndex: 0 })
                      }}
                      className={`rounded-full transition-all duration-200 ${
                        idx === lightbox.itemIndex
                          ? "w-2 h-5 bg-brand-500"
                          : "w-2 h-2 bg-zinc-400 dark:bg-zinc-600 hover:bg-zinc-500 dark:hover:bg-zinc-500"
                      }`}
                      aria-label={`Empresa ${idx + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={goNextCompany}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-zinc-300 dark:hover:bg-zinc-700"
                  style={{ transition: "background-color 0.15s, color 0.15s" }}
                  aria-label="Empresa siguiente"
                >
                  <ChevronDown size={16} />
                </button>
              </div>

              {/* Horizontal photo nav */}
              {currentItem.images.length > 1 && (
                <div className="flex items-center gap-2 bg-zinc-200/80 dark:bg-zinc-800/80 rounded-2xl px-3 py-2.5 border border-zinc-300 dark:border-zinc-700">
                  <button
                    onClick={goPrevPhoto}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-zinc-300 dark:hover:bg-zinc-700"
                    style={{ transition: "background-color 0.15s, color 0.15s" }}
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <div className="flex items-center gap-1">
                    {currentItem.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSlideDir(idx > lightbox.photoIndex ? "left" : "right")
                          setLightbox(prev => prev ? { ...prev, photoIndex: idx } : null)
                        }}
                        className={`rounded-full transition-all duration-200 ${
                          idx === lightbox.photoIndex
                            ? "w-5 h-2 bg-brand-500"
                            : "w-2 h-2 bg-zinc-400 dark:bg-zinc-600 hover:bg-zinc-500 dark:hover:bg-zinc-500"
                        }`}
                        aria-label={`Foto ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={goNextPhoto}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-zinc-300 dark:hover:bg-zinc-700"
                    style={{ transition: "background-color 0.15s, color 0.15s" }}
                    aria-label="Foto siguiente"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Main content area */}
            <div
              className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4 md:px-16 md:pr-28 lg:pr-36 py-14 md:py-16"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image area */}
                <div className="w-full flex-1 flex items-center justify-center relative">
                  <AnimatePresence mode="popLayout" custom={slideDir}>
                    <motion.div
                      key={currentItem.company + "-" + lightbox.itemIndex + "-" + lightbox.photoIndex}
                      variants={getVariants(slideDir)}
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
                        className={`object-contain select-none pointer-events-none transition-transform duration-300`}
                        priority
                        unoptimized
                        draggable={false}
                      />
                    </motion.div>
                  </AnimatePresence>
                {/* Logo en móvil (debajo de la imagen) */}
                <div className="sm:hidden mt-4 mb-2 flex items-center justify-center">
                  {currentItem.logo ? (
                    <Image
                      src={currentItem.logo}
                      alt={currentItem.company}
                      width={72}
                      height={72}
                      className="object-contain rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-2"
                      unoptimized
                    />
                  ) : (
                    <Building2 size={36} className="text-zinc-400 dark:text-zinc-500" />
                  )}
                </div>
              </div>

              {/* Bottom info bar — themed, full description visible */}
              <div className="w-full max-w-5xl mt-3 md:mt-5 flex-shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-white dark:bg-zinc-900 rounded-2xl px-5 py-4 border border-zinc-200 dark:border-zinc-800 shadow-lg shadow-zinc-950/5 dark:shadow-black/30" style={{ transition: "none" }}>
                  {/* Logo (más grande) */}
                  <div className="hidden sm:flex flex-shrink-0 w-24 h-24 rounded-3xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 items-center justify-center overflow-hidden">
                    {currentItem.logo ? (
                      <Image
                        src={currentItem.logo}
                        alt={currentItem.company}
                        width={96}
                        height={96}
                        className="object-contain p-4"
                        unoptimized
                      />
                    ) : (
                      <Building2 size={48} className="text-zinc-400 dark:text-zinc-500" />
                    )}
                  </div>
                  {/* Text — full description, no truncate */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h2 className="text-zinc-900 dark:text-zinc-100 font-bold text-sm md:text-base">{currentItem.company}</h2>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded-md flex-shrink-0">
                        {currentItem.category}
                      </span>
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed">{currentItem.description}</p>
                  </div>
                  {/* Mobile dot indicators */}
                  {currentItem.images.length > 1 && (
                    <div className="flex sm:hidden items-center justify-center gap-1.5">
                      {currentItem.images.map((_, idx) => (
                        <span
                          key={idx}
                          className={`rounded-full transition-all duration-200 ${
                            idx === lightbox.photoIndex
                              ? "w-5 h-1.5 bg-brand-500"
                              : "w-1.5 h-1.5 bg-zinc-300 dark:bg-zinc-600"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Swipe hint — mobile only */}
                <div className="flex md:hidden justify-center gap-4 mt-2 text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                  <span className="flex items-center gap-1">
                    <ChevronLeft size={10} /><ChevronRight size={10} /> Fotos
                  </span>
                  <span className="flex items-center gap-1">
                    <ChevronUp size={10} /><ChevronDown size={10} /> Empresas
                  </span>
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
