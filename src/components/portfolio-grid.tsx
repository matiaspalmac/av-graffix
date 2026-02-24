"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

const portfolioItems = [
  {
    images: ["/trabajos/aguasaraucania_1.jpeg", "/trabajos/aguasaraucania_2.jpeg"],
    company: "Aguas Araucania",
    category: "",
    description: ""
  },
  {
    images: ["/trabajos/cifuentes_1.jpeg", "/trabajos/cifuentes_2.jpeg"],
    company: "Comercializadora Cifuentes",
    category: "",
    description: ""
  },
  {
    images: ["/trabajos/bidfood_1.jpg", "/trabajos/bidfood_2.jpg"],
    company: "Bidfood",
    category: "",
    description: ""
  },
  {
    images: ["/trabajos/sofo_1.jpg", "/trabajos/sofo_2.jpg", "/trabajos/supercerdo_1.jpg"],
    company: "SOFO & Super Cerdo",
    category: "",
    description: ""
  },
  {
    images: ["/trabajos/prt_1.jpg", "/trabajos/prt_2.jpg"],
    company: "PRT",
    category: "",
    description: ""
  },
  {
    images: ["/trabajos/farellones_1.jpeg"],
    company: "Farellones Automotriz",
    category: "",
    description: ""
  },
]

const categories = ["Todos", ...Array.from(new Set(portfolioItems.map(i => i.category)))]

export default function PortfolioGrid() {
  const [active, setActive] = useState("Todos")
  const [currentImageIndexes, setCurrentImageIndexes] = useState<Record<string, number>>({})

  const filtered = active === "Todos" 
    ? portfolioItems 
    : portfolioItems.filter(i => i.category === active)

  const handleNext = (company: string, totalImages: number) => {
    setCurrentImageIndexes(prev => {
      const current = prev[company] ?? 0
      return { ...prev, [company]: (current + 1) % totalImages }
    })
  }

  const handlePrev = (company: string, totalImages: number) => {
    setCurrentImageIndexes(prev => {
      const current = prev[company] ?? 0
      return { ...prev, [company]: (current - 1 + totalImages) % totalImages }
    })
  }

  return (
    <>
      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-16">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${
              active === cat
                ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20"
                : "bg-white dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400 border border-black/5 dark:border-white/5 hover:border-brand-500/30 hover:text-brand-600 dark:hover:text-brand-500"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, index) => {
            const images = item.images
            const hasMultiple = images.length > 1
            const currentIndex = currentImageIndexes[item.company] ?? 0
            const currentImage = images[currentIndex]

            return (
              <motion.div
                key={item.company}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative bg-white dark:bg-zinc-900/40 rounded-3xl border border-black/5 dark:border-white/5 overflow-hidden hover:shadow-xl transition-all duration-500"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800/50">
                  <Image
                    src={currentImage}
                    alt={`${item.company} - ${currentIndex + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain p-8 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                  />

                  {hasMultiple && (
                    <>
                      <button
                        onClick={() => handlePrev(item.company, images.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 duration-300"
                        aria-label="Imagen anterior"
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <button
                        onClick={() => handleNext(item.company, images.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 duration-300"
                        aria-label="Siguiente imagen"
                      >
                        <ChevronRight size={20} />
                      </button>

                      {/* Indicadores de posición (opcional pero útil) */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 transition-opacity">
                        {images.map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i === currentIndex ? "bg-white" : "bg-white/40"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold tracking-[0.15em] uppercase text-brand-600 dark:text-brand-500 mb-1">
                        {item.category}
                      </p>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {item.company}
                      </h3>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </>
  )
}