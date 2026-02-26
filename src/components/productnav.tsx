'use client'
import { useState, useEffect, useRef } from 'react'
import { ChevronDown, ArrowRight, Palette, FileText, Megaphone, Gift, Layers } from 'lucide-react'
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
                    className={`flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] font-bold px-4 py-2.5 rounded-full transition-all duration-300 ${
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
                              className="flex items-center gap-3 px-5 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-brand-600 dark:hover:text-brand-500 hover:bg-brand-50/50 dark:hover:bg-brand-950/20 transition-all duration-200 group/item"
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
                          className="flex items-center justify-center gap-2 py-3 text-xs font-bold tracking-widest uppercase text-brand-600 dark:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950/20 transition-colors group/link"
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
              className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] font-bold px-4 py-2.5 rounded-full text-brand-600 dark:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950/20 transition-all duration-300"
            >
              Catálogo <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile: Simple "Explorar Catálogo" button — no drawer to avoid freezing */}
      <div className="md:hidden bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border-b border-black/5 dark:border-white/5 transition-colors duration-500">
        <div className="container mx-auto px-4">
          <Link
            href="/catalogo"
            className="flex items-center justify-center gap-2 w-full py-3 text-xs uppercase tracking-[0.15em] font-bold text-brand-600 dark:text-brand-500 hover:text-brand-700 dark:hover:text-brand-400 transition-colors"
          >
            <Layers className="w-4 h-4" />
            Explorar Catalogo
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </>
  )
}
