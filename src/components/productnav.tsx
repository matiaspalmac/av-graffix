'use client'
import { useState, useEffect, useRef } from 'react'
import { ChevronDown, ArrowRight, Palette, FileText, Megaphone, Gift, Layers, X } from 'lucide-react'
import Link from 'next/link'
import { productCategories } from '@/lib/data'

const categoryIcons: Record<string, React.ReactNode> = {
  'Branding': <Palette className="w-4 h-4" />,
  'Papelería Corporativa': <FileText className="w-4 h-4" />,
  'Folletería Promocional': <Megaphone className="w-4 h-4" />,
  'Productos Promocionales': <Gift className="w-4 h-4" />,
  'Soportes Gráficos': <Layers className="w-4 h-4" />,
}

export default function ProductNav() {
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenCategory(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [navRef])

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const toggleCategory = (categoryName: string) => {
    setOpenCategory(prev => prev === categoryName ? null : categoryName)
  }

  return (
    <>
      {/* Desktop Nav */}
      <nav ref={navRef} aria-label="Categorías de productos" className="hidden md:block bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border-b border-black/5 dark:border-white/5 relative transition-colors duration-500">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-1 py-2" role="menubar">
            {productCategories.map((category) => {
              const isOpen = openCategory === category.name
              const icon = categoryIcons[category.name]

              return (
                <div key={category.name} className="relative" role="none">
                  <button
                    className={`flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] font-bold px-4 py-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                      isOpen
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                    onClick={() => toggleCategory(category.name)}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    role="menuitem"
                  >
                    {icon}
                    <span>{category.name}</span>
                    <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  <div className={`absolute z-50 left-1/2 -translate-x-1/2 pt-3 transition-all duration-200 ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`} role="menu">
                    <div className="w-72 bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-2xl dark:shadow-black/40 rounded-2xl overflow-hidden">
                      {/* Category header */}
                      <div className="px-5 pt-4 pb-3 border-b border-black/5 dark:border-white/5">
                        <div className="flex items-center gap-2.5">
                          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-500">
                            {icon}
                          </span>
                          <span className="text-sm font-bold text-zinc-900 dark:text-white">{category.name}</span>
                        </div>
                      </div>

                      {/* Subcategories */}
                      <ul className="py-1.5 max-h-64 overflow-y-auto custom-scrollbar">
                        {category.subcategories.map((sub) => (
                          <li key={sub} role="none">
                            <Link
                              href="/catalogo"
                              role="menuitem"
                              className="flex items-center gap-3 px-5 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-brand-600 dark:hover:text-brand-500 hover:bg-brand-50/50 dark:hover:bg-brand-950/20 transition-all duration-200 group/item focus-visible:outline-none focus-visible:bg-brand-50/50"
                              onClick={() => setOpenCategory(null)}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 group-hover/item:bg-brand-500 group-hover/item:scale-125 transition-all duration-200 shrink-0" />
                              {sub}
                            </Link>
                          </li>
                        ))}
                      </ul>

                      {/* Footer */}
                      <div className="border-t border-black/5 dark:border-white/5">
                        <Link
                          href="/catalogo"
                          className="flex items-center justify-center gap-2 py-3 text-xs font-bold tracking-widest uppercase text-brand-600 dark:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950/20 transition-colors group/link focus-visible:outline-none focus-visible:bg-brand-50"
                          onClick={() => setOpenCategory(null)}
                        >
                          Ver catálogo completo
                          <ArrowRight size={13} className="group-hover/link:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Divider + Catalog link */}
            <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-700 mx-2" />
            <Link
              href="/catalogo"
              className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] font-bold px-4 py-2.5 rounded-full text-brand-600 dark:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950/20 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              Catálogo <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile: Compact bar + Drawer */}
      <div className="md:hidden bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border-b border-black/5 dark:border-white/5 transition-colors duration-500">
        <div className="container mx-auto px-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex items-center justify-between w-full py-3 text-xs uppercase tracking-[0.15em] font-bold text-zinc-600 dark:text-zinc-300 focus-visible:outline-none"
            aria-label="Abrir categorías de productos"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600 dark:text-brand-500" />
              Explorar Productos
            </span>
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Categorías de productos">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />

          {/* Drawer panel */}
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-white dark:bg-zinc-900 rounded-t-3xl shadow-2xl overflow-hidden animate-slide-up">
            {/* Handle */}
            <div className="flex items-center justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 dark:border-white/5">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Nuestros Productos</h3>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                aria-label="Cerrar"
              >
                <X size={16} />
              </button>
            </div>

            {/* Categories */}
            <div className="overflow-y-auto max-h-[calc(85vh-140px)] px-4 py-4 space-y-2 custom-scrollbar">
              {productCategories.map((category) => {
                const isOpen = openCategory === category.name
                const icon = categoryIcons[category.name]

                return (
                  <div key={category.name} className="rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 bg-zinc-50 dark:bg-zinc-800/30">
                    <button
                      onClick={() => toggleCategory(category.name)}
                      className={`flex items-center justify-between w-full px-5 py-4 transition-colors duration-200 ${
                        isOpen ? 'bg-brand-50 dark:bg-brand-950/30' : ''
                      }`}
                      aria-expanded={isOpen}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 ${
                          isOpen
                            ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                            : 'bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                        }`}>
                          {icon}
                        </span>
                        <span className={`text-sm font-bold transition-colors ${isOpen ? 'text-brand-600 dark:text-brand-500' : 'text-zinc-700 dark:text-zinc-200'}`}>
                          {category.name}
                        </span>
                      </span>
                      <ChevronDown size={16} className={`text-zinc-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-500' : ''}`} />
                    </button>

                    <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                      <div className="px-5 pb-4 pt-1 space-y-0.5">
                        {category.subcategories.map((sub) => (
                          <Link
                            key={sub}
                            href="/catalogo"
                            className="flex items-center gap-2.5 py-2.5 px-3 text-sm text-zinc-600 dark:text-zinc-400 hover:text-brand-600 dark:hover:text-brand-500 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-all"
                            onClick={() => setMobileOpen(false)}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-400/60 shrink-0" />
                            {sub}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer CTA */}
            <div className="px-4 py-4 border-t border-black/5 dark:border-white/5 bg-zinc-50 dark:bg-zinc-800/30">
              <Link
                href="/catalogo"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-brand-600 text-white rounded-2xl text-sm font-bold tracking-wide hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20"
              >
                Ver Catálogo Completo <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}