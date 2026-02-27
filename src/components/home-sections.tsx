"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import {
  Tags,
  FileText,
  Briefcase,
  Gift,
  Palette,
  Layers,
} from "lucide-react"
import type { ReactNode } from "react"

const iconMap: Record<string, ReactNode> = {
  Tags: (
    <Tags className="w-8 h-8 text-zinc-700 dark:text-zinc-300 group-hover:text-brand-600 dark:group-hover:text-brand-500 transition-colors" />
  ),
  FileText: (
    <FileText className="w-8 h-8 text-zinc-700 dark:text-zinc-300 group-hover:text-brand-600 dark:group-hover:text-brand-500 transition-colors" />
  ),
  Briefcase: (
    <Briefcase className="w-8 h-8 text-zinc-700 dark:text-zinc-300 group-hover:text-brand-600 dark:group-hover:text-brand-500 transition-colors" />
  ),
  Gift: (
    <Gift className="w-8 h-8 text-zinc-700 dark:text-zinc-300 group-hover:text-brand-600 dark:group-hover:text-brand-500 transition-colors" />
  ),
  Palette: (
    <Palette className="w-8 h-8 text-zinc-700 dark:text-zinc-300 group-hover:text-brand-600 dark:group-hover:text-brand-500 transition-colors" />
  ),
  Layers: (
    <Layers className="w-8 h-8 text-zinc-700 dark:text-zinc-300 group-hover:text-brand-600 dark:group-hover:text-brand-500 transition-colors" />
  ),
}

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function ProductCard({
  product,
  index = 0,
}: {
  product: { name: string; iconName: string; desc: string }
  index?: number
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      variants={fadeUpVariant}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative bg-white dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 p-10 rounded-3xl hover:shadow-xl dark:hover:shadow-none transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="w-20 h-20 rounded-2xl bg-zinc-50 dark:bg-zinc-950/80 border border-black/5 dark:border-white/10 flex items-center justify-center mb-8 overflow-hidden transition-all duration-300 group-hover:scale-110 shadow-sm group-hover:border-brand-500/30 group-hover:shadow-brand-500/10 group-hover:shadow-lg">
          {iconMap[product.iconName]}
        </div>

        <h3 className="text-2xl font-bold mb-4 tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {product.name}
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6 flex-grow text-lg leading-relaxed font-light">
          {product.desc}
        </p>
        <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-500" />
      </div>
    </motion.div>
  )
}

export function CompanyCard({
  company,
}: {
  company: { name: string; image: string }
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      variants={fadeUpVariant}
      className="group flex flex-col items-center justify-center p-10 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-transparent hover:border-black/10 dark:hover:border-white/10 hover:bg-white dark:hover:bg-zinc-800 transition-colors duration-300 cursor-pointer"
    >
      <div className="relative w-28 h-28 mb-8">
        <Image
          src={company.image}
          alt={company.name}
          fill
          sizes="112px"
          className="object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <h3 className="text-xs font-bold tracking-[0.2em] text-zinc-500 dark:text-zinc-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors uppercase text-center">
        {company.name}
      </h3>
    </motion.div>
  )
}
