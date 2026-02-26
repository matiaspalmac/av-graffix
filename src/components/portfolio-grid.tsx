"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, X, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Building2, Images } from "lucide-react"

const portfolioItems = [
  {
    images: ["/trabajos/aguasaraucania_1.jpeg", "/trabajos/aguasaraucania_2.jpeg"],
    company: "Aguas Araucanía",
    category: "Soportes Gráficos",
    logo: "/logos/aguasaraucania.svg",
    description: "Fabricación de señalética industrial de seguridad y paneles de advertencia para plantas de tratamiento.",
  },
  {
    images: ["/trabajos/cifuentes_1.jpeg", "/trabajos/cifuentes_2.jpeg"],
    company: "Comercializadora Cifuentes",
    category: "Soportes Gráficos",
    logo: "/logos/cifuentes.png",
    description: "Rotulación industrial de maquinaria agrícola y branding vehicular para camionetas de servicio.",
  },
  {
    images: ["/trabajos/bidfood_1.jpg", "/trabajos/bidfood_2.jpg"],
    company: "Bidfood",
    category: "Soportes Gráficos",
    logo: "/logos/bidfood.png",
    description: "Branding vehicular a gran escala para flota logística, con gráficas envolventes en camiones de reparto.",
  },
  {
    images: ["/trabajos/sofo_1.jpg", "/trabajos/sofo_2.jpg", "/trabajos/sofo_3.jpg"],
    company: "SOFO",
    category: "Productos Promocionales",
    logo: null,
    description: "Producción de material promocional, pendones y señalética de stands para ferias agropecuarias masivas.",
  },
  {
    images: ["/trabajos/prt_1.jpg", "/trabajos/prt_2.jpg"],
    company: "PRT",
    category: "Soportes Gráficos",
    logo: null,
    description: "Señalética vial e informativa corporativa para plantas de revisión técnica vehicular.",
  },
  {
    images: ["/trabajos/farellones_1.jpeg"],
    company: "Farellones Automotriz",
    category: "Soportes Gráficos",
    logo: "/logos/farellones_automotriz.svg",
    description: "Tótems publicitarios exteriores y señalética de showroom para concesionaria automotriz.",
  },
  {
    images: ["/trabajos/b2autos_1.jpeg", "/trabajos/b2autos_2.jpeg"],
    company: "B2 Autos",
    category: "Soportes Gráficos",
    logo: null,
    description: "Rotulación completa de vehículos y señalética exterior para puntos de venta automotriz.",
  },
  {
    images: ["/trabajos/minimarketisabella_1.jpeg", "/trabajos/minimarketisabella_2.jpeg", "/trabajos/minimarketisabella_3.jpeg"],
    company: "Minimarket Isabella",
    category: "Soportes Gráficos",
    logo: null,
    description: "Señalética integral de fachada, letrero principal y pintura de señalización en suelos.",
  },
]

const categories = ["Todos", ...Array.from(new Set(portfolioItems.map(i => i.category)))]

// ─── Types ───────────────────────────────────────────
type LightboxState = {
  companyIndex: number
  photoIndex: number
}

export default function PortfolioGrid() {
  const [active, setActive] = useState("Todos")
  const [lightbox, setLightbox] = useState<LightboxState | null>(null)

  // Touch refs
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const touchStartTime = useRef<number | null>(null)

  const filtered = active === "Todos" ? portfolioItems : portfolioItems.filter(i => i.category === active)

  const currentItem = lightbox !== null ? filtered[lightbox.companyIndex] : null

  const openLightbox = (companyIndex: number, photoIndex = 0) => {
    setLightbox({ companyIndex, photoIndex })
  }

  const closeLightbox = () => setLightbox(null)

  // ─── Navigation helpers ───────────────────────────
  const goNextPhoto = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!lightbox || !currentItem) return
    const total = currentItem.images.length
    setLightbox(prev => prev ? { ...prev, photoIndex: (prev.photoIndex + 1) % total } : null)
  }, [lightbox, currentItem])

  const goPrevPhoto = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!lightbox || !currentItem) return
    const total = currentItem.images.length
    setLightbox(prev => prev ? { ...prev, photoIndex: (prev.photoIndex - 1 + total) % total } : null)
  }, [lightbox, currentItem])

  const goNextCompany = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!lightbox) return
    const next = (lightbox.companyIndex + 1) % filtered.length
    setLightbox({ companyIndex: next, photoIndex: 0 })
  }, [lightbox, filtered.length])

  const goPrevCompany = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!lightbox) return
    const prev = (lightbox.companyIndex - 1 + filtered.length) % filtered.length
    setLightbox({ companyIndex: prev, photoIndex: 0 })
  }, [lightbox, filtered.length])

  // ─── Touch handlers ───────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    touchStartTime.current = Date.now()
  }

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = touchStartX.current - e.changedTouches[0].clientX
    const dy = touchStartY.current - e.changedTouches[0].clientY
    const elapsed = Date.now() - (touchStartTime.current ?? 0)

    // Only consider fast swipes (< 400ms)
    if (elapsed > 400) { touchStartX.current = null; touchStartY.current = null; return }

    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)
    const THRESHOLD = 50

    if (absDy > absDx && absDy > THRESHOLD) {
      // Vertical swipe → change company
      dy > 0 ? goNextCompany() : goPrevCompany()
    } else if (absDx > absDy && absDx > THRESHOLD) {
      // Horizontal swipe → change photo
      dx > 0 ? goNextPhoto() : goPrevPhoto()
    }

    touchStartX.current = null
    touchStartY.current = null
  }, [goNextCompany, goPrevCompany, goNextPhoto, goPrevPhoto])

  // ─── Keyboard navigation ──────────────────────────
  useEffect(() => {
    if (!lightbox) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNextPhoto()
      if (e.key === "ArrowLeft") goPrevPhoto()
      if (e.key === "ArrowDown") goNextCompany()
      if (e.key === "ArrowUp") goPrevCompany()
      if (e.key === "Escape") closeLightbox()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [lightbox, goNextPhoto, goPrevPhoto, goNextCompany, goPrevCompany])

  return (
    <div className="max-w-7xl mx-auto px-4">

      {/* ─── LIGHTBOX ──────────────────────────────────── */}
      {/* ─── LIGHTBOX V2 ────────────────────────────────── */}
      <AnimatePresence>
        {lightbox !== null && currentItem && (
          <motion.div
            key="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          >
            {/* Backdrop with Deep Blur */}
            <div
              className="absolute inset-0 bg-white/40 dark:bg-zinc-950/60 backdrop-blur-2xl transition-colors duration-500"
              onClick={closeLightbox}
            />

            {/* Floating Modal */}
            <motion.div
              key={currentItem.company + lightbox.photoIndex}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                const threshold = 50
                if (Math.abs(info.offset.x) > Math.abs(info.offset.y)) {
                  if (info.offset.x < -threshold) goNextPhoto()
                  if (info.offset.x > threshold) goPrevPhoto()
                } else {
                  if (info.offset.y < -threshold) goNextCompany()
                  if (info.offset.y > threshold) goPrevCompany()
                }
              }}
              className="relative w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-[0_32px_128px_-32px_rgba(0,0,0,0.3)] dark:shadow-[0_32px_128px_-32px_rgba(0,0,0,0.5)] border border-black/5 dark:border-white/5 overflow-hidden flex flex-col cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header: Company Info */}
              <div className="p-6 md:p-8 border-b border-black/5 dark:border-white/5 flex items-start justify-between gap-6 bg-zinc-50/50 dark:bg-zinc-800/30">
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 flex items-center justify-center overflow-hidden shadow-inner">
                    {currentItem.logo ? (
                      <Image
                        src={currentItem.logo}
                        alt={currentItem.company}
                        width={48}
                        height={48}
                        className="object-contain p-2"
                        unoptimized
                      />
                    ) : (
                      <Building2 size={24} className="text-zinc-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="inline-block text-brand-600 dark:text-brand-500 text-[10px] font-black uppercase tracking-[0.25em] mb-1">
                      {currentItem.category}
                    </span>
                    <h2 className="text-zinc-900 dark:text-white text-xl md:text-3xl font-black leading-tight truncate">
                      {currentItem.company}
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mt-1 md:mt-2 max-w-2xl line-clamp-2 md:line-clamp-none">
                      {currentItem.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-block text-zinc-400 text-[10px] font-bold uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full">
                    {lightbox.companyIndex + 1} / {filtered.length}
                  </span>
                  <button
                    onClick={closeLightbox}
                    className="group flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 hover:bg-brand-600 dark:hover:bg-brand-600 text-zinc-700 dark:text-white rounded-full p-3 transition-all duration-300 border border-black/5 dark:border-white/5 shadow-sm"
                    aria-label="Cerrar"
                  >
                    <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>
              </div>

              {/* Body: Main image */}
              <div className="relative flex-1 min-h-[40vh] md:min-h-[50vh] bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
                <Image
                  src={currentItem.images[lightbox.photoIndex]}
                  alt={`${currentItem.company} foto ${lightbox.photoIndex + 1}`}
                  fill
                  className="object-contain pointer-events-none p-4 md:p-8"
                  priority
                  unoptimized
                />

                {/* Left/Right controls (Desktop) */}
                {currentItem.images.length > 1 && (
                  <div className="hidden lg:contents">
                    <button
                      className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/80 dark:bg-zinc-900/80 hover:bg-brand-600 dark:hover:bg-brand-600 text-zinc-900 dark:text-white rounded-full flex items-center justify-center border border-black/5 dark:border-white/10 backdrop-blur-md shadow-lg transition-all duration-300 group/nav"
                      onClick={goPrevPhoto}
                    >
                      <ChevronLeft size={24} className="group-hover/nav:-translate-x-0.5 transition-transform" />
                    </button>
                    <button
                      className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/80 dark:bg-zinc-900/80 hover:bg-brand-600 dark:hover:bg-brand-600 text-zinc-900 dark:text-white rounded-full flex items-center justify-center border border-black/5 dark:border-white/10 backdrop-blur-md shadow-lg transition-all duration-300 group/nav"
                      onClick={goNextPhoto}
                    >
                      <ChevronRight size={24} className="group-hover/nav:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                )}
              </div>

              {/* Footer: Multi-Axis Navigation Info + Thumbnails */}
              <div className="p-6 md:p-8 space-y-6">
                {/* Thumbnails */}
                {currentItem.images.length > 1 && (
                  <div className="flex justify-center flex-wrap gap-3">
                    {currentItem.images.map((img, idx) => (
                      <button
                        key={img + idx}
                        onClick={() => setLightbox(prev => prev ? { ...prev, photoIndex: idx } : null)}
                        className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-500 ${idx === lightbox.photoIndex
                          ? "w-20 h-14 border-brand-500 shadow-xl shadow-brand-500/20 scale-105"
                          : "w-14 h-10 border-transparent opacity-30 hover:opacity-60"
                          }`}
                      >
                        <Image src={img} alt="" fill className="object-cover" unoptimized />
                      </button>
                    ))}
                  </div>
                )}

                {/* Gesture Hints */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-[10px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em] border-t border-black/5 dark:border-white/5 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center gap-0.5">
                      <ChevronUp size={12} className="text-brand-500" />
                      <ChevronDown size={12} className="text-brand-500" />
                    </div>
                    <span>Cambiar Empresa</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-800 hidden md:block" />
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5">
                      <ChevronLeft size={12} className="text-brand-500" />
                      <ChevronRight size={12} className="text-brand-500" />
                    </div>
                    <span>Cambiar Foto / Deslizar</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-800 hidden md:block" />
                  <div className="flex items-center gap-3">
                    <kbd className="bg-zinc-100 dark:bg-zinc-800 border border-black/5 dark:border-white/10 rounded px-2 py-1 text-[9px] font-mono">ESC</kbd>
                    <span>Cerrar</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Filter Tabs ─────────────────────────────── */}
      <div className="flex flex-wrap justify-center gap-3 mb-16">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-6 py-3 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${active === cat
              ? "bg-brand-600 text-white shadow-xl shadow-brand-600/40 scale-105"
              : "bg-white dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400 border border-black/5 dark:border-white/5 hover:border-brand-500/30 hover:text-brand-600 dark:hover:text-brand-500"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ─── Grid ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, index) => (
            <motion.div
              key={item.company + "-" + index}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
              onClick={() => openLightbox(index)}
              className="group relative bg-white dark:bg-zinc-900/40 rounded-[2rem] border border-black/5 dark:border-white/5 overflow-hidden hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-500 cursor-pointer"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800/50">
                <Image
                  src={item.images[0]}
                  alt={item.company}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-all duration-700 group-hover:scale-110"
                  priority={index < 6}
                  unoptimized
                  onLoad={(e) => {
                    const img = e.target as HTMLImageElement
                    if (img.naturalWidth === 0) img.src = "/avgraffix.png"
                  }}
                />

                {/* Subtle hover dim */}
                <div className="absolute inset-0 bg-zinc-950/0 group-hover:bg-zinc-950/20 transition-all duration-500" />

                {/* Multiple photos badge */}
                {item.images.length > 1 && (
                  <div className="absolute top-4 right-4 bg-zinc-950/70 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full border border-white/10 uppercase tracking-widest flex items-center gap-1.5">
                    <Images size={11} />
                    {item.images.length} fotos
                  </div>
                )}
              </div>

              {/* Card info */}
              <div className="p-7">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black tracking-[0.2em] uppercase text-brand-600 dark:text-brand-500 mb-1.5">{item.category}</p>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{item.company}</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed line-clamp-2">{item.description}</p>
                  </div>
                  <div className="flex-shrink-0 w-11 h-11 rounded-full border border-black/8 dark:border-white/8 flex items-center justify-center group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-zinc-950 transition-all duration-300 mt-0.5">
                    <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}