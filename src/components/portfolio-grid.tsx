"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

const portfolioLogo = "/logo.png"

const portfolioItems = [
  { image: portfolioLogo, company: "Empresa 1", description: "Identidad Visual Completa", category: "Branding" },
  { image: portfolioLogo, company: "Empresa 2", description: "Empaque Sustentable", category: "Packaging" },
  { image: portfolioLogo, company: "Empresa 3", description: "Campaña Publicitaria Anual", category: "Publicidad" },
  { image: portfolioLogo, company: "Empresa 4", description: "Diseño Editorial Premium", category: "Impresos" },
  { image: portfolioLogo, company: "Empresa 5", description: "Rotulación Vehicular Integral", category: "Soportes" },
  { image: portfolioLogo, company: "Empresa 6", description: "Stand Corporativo Modular", category: "Producción" },
]

const categories = ["Todos", ...Array.from(new Set(portfolioItems.map(i => i.category)))]

export default function PortfolioGrid() {
  const [active, setActive] = useState("Todos")

  const filtered = active === "Todos" ? portfolioItems : portfolioItems.filter(i => i.category === active)

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
          {filtered.map((item, index) => (
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
                  src={item.image}
                  alt={item.company}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain p-8 opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-zinc-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-between p-6">
                  <div>
                    <p className="text-white font-bold text-lg">{item.company}</p>
                    <p className="text-zinc-300 text-sm font-light">{item.description}</p>
                  </div>
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white group-hover:bg-brand-600 transition-colors">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold tracking-[0.15em] uppercase text-brand-600 dark:text-brand-500 mb-1">{item.category}</p>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{item.company}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white group-hover:border-transparent transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}
