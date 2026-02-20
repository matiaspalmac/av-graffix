'use client'
import { useState, useEffect, useRef } from 'react'
import { ChevronDown, ChevronUp, Search, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const productCategories = [
  {
    name: "Branding",
    subcategories: [
      "Diseño de imágenes corporativas (logotipos)",
      "Aplicación de norma gráfica"
    ]
  },
  {
    name: "Papelería Corporativa",
    subcategories: [
      "Tarjetas de presentación",
      "Sobres",
      "Hojas",
      "Tarjetones de invitación"
    ]
  },
  {
    name: "Folletería Promocional",
    subcategories: [
      "Dípticos",
      "Trípticos",
      "Folletos",
      "Volantes"
    ]
  },
  {
    name: "Productos Promocionales",
    subcategories: [
      "Pendones Roller",
      "Lienzos",
      "Banderas",
      "Toldos",
      "Chapitas",
      "Adhesivos"
    ]
  },
  {
    name: "Soportes Gráficos",
    subcategories: [
      "Telones",
      "Window Vision",
      "Señaléticas",
      "Paneles",
      "Panaflex",
      "Letreros metálicos",
      "Acrílicos",
      "Maderas",
      "Trovisel",
      "Vidrios"
    ]
  }
]

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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [navRef])

  const toggleCategory = (categoryName: string) => {
    setOpenCategory(prev => prev === categoryName ? null : categoryName)
  }

  return (
    <nav ref={navRef} className="bg-zinc-50 dark:bg-zinc-900 py-3 border-b border-black/5 dark:border-white/5 text-zinc-600 dark:text-zinc-300 relative z-40 transition-colors duration-500">
      <div className="container mx-auto px-4">
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 relative">
          {productCategories.map((category) => {
            const isHovered = openCategory === category.name;

            return (
              <li
                key={category.name}
                className="relative group block"
              >
                <div
                  className={`flex items-center space-x-1.5 text-[11px] uppercase tracking-widest font-bold transition-colors duration-300 py-2 cursor-pointer ${isHovered ? 'text-red-600 dark:text-red-500' : 'hover:text-zinc-900 dark:hover:text-white'}`}
                  onClick={() => toggleCategory(category.name)}
                >
                  <span>{category.name}</span>
                  {isHovered ? <ChevronUp size={14} className="text-red-600 dark:text-red-500" /> : <ChevronDown size={14} className="opacity-70 group-hover:opacity-100" />}
                </div>

                {isHovered && (
                  <div className="absolute z-50 left-1/2 -translate-x-1/2 mt-2 w-80 bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 shadow-xl dark:shadow-2xl rounded-xl overflow-hidden transition-colors duration-500">

                    <ul className="py-2 max-h-72 overflow-y-auto custom-scrollbar">
                      {category.subcategories.map((subcategory) => (
                        <li key={subcategory}>
                          <Link href="/catalogo" className="block px-6 py-2.5 text-sm text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-colors border-l-2 border-transparent hover:border-red-600 dark:hover:border-red-500 cursor-pointer">
                            {subcategory}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {/* Footer link to catalog */}
                    <div className="bg-zinc-50 dark:bg-zinc-900 border-t border-black/5 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                      <Link href="/catalogo" className="flex items-center justify-center gap-2 py-3 text-xs font-bold tracking-widest uppercase text-red-600 dark:text-red-500 group/link">
                        Ir al Catálogo Completo <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>

                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}