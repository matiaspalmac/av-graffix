import Link from 'next/link'
import { ArrowRight, Palette, FileText, Image as ImageIcon, Gift, Layers } from 'lucide-react'
import { productCategories } from '@/lib/data'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Catálogo de Productos',
  description: 'Explora nuestro catálogo completo de productos: branding, papelería corporativa, folletería, productos promocionales y soportes gráficos en Temuco.',
  openGraph: {
    title: 'Catálogo de Productos | AV GRAFFIX',
    description: 'Catálogo completo de soluciones en impresión y soportes gráficos.',
  },
}

const categoryIcons = [Palette, FileText, ImageIcon, Gift, Layers]

export default function CatalogoPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-500 font-sans">
      <section className="relative py-32 overflow-hidden bg-zinc-900 dark:bg-zinc-950">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 via-transparent to-brand-600/5" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-600/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <p className="text-brand-500 text-sm font-bold tracking-[0.3em] uppercase mb-4">Productos</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 text-white">
              Catálogo de{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-400">Productos</span>
            </h1>
            <p className="text-xl md:text-2xl font-light text-zinc-400 leading-relaxed max-w-2xl">
              Explora nuestro abanico completo de soluciones en impresión y soportes. Todo con extrema precisión y calidad premium.
            </p>
          </div>
        </div>
      </section>
      <section className="relative z-20 -mt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl dark:shadow-none border border-black/5 dark:border-white/5 p-4">
            <div className="flex flex-wrap justify-center gap-2">
              {productCategories.map((cat, i) => {
                const Icon = categoryIcons[i]
                return (
                  <a
                    key={i}
                    href={`#cat-${i}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:bg-brand-50 dark:hover:bg-brand-950/20 hover:text-brand-600 dark:hover:text-brand-500 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                    {cat.name}
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="space-y-12">
          {productCategories.map((category, index) => {
            const Icon = categoryIcons[index]
            return (
              <div
                key={index}
                id={`cat-${index}`}
                className="scroll-mt-32 group bg-white dark:bg-zinc-900/40 rounded-3xl border border-black/5 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
              >
                <div className="flex items-center gap-6 p-8 md:p-10 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="w-14 h-14 bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900/30 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 transition-all duration-300">
                    <Icon className="w-7 h-7 text-brand-600 dark:text-brand-500 group-hover:text-white transition-colors" strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-brand-600 dark:text-brand-500">
                      Categoría 0{index + 1}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white capitalize group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {category.name}
                    </h2>
                  </div>
                  <div className="ml-auto hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-sm font-bold">
                    {category.subcategories.length}
                  </div>
                </div>
                <div className="p-8 md:p-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {category.subcategories.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group/item cursor-default"
                      >
                        <div className="w-2 h-2 rounded-full bg-brand-600 dark:bg-brand-500 group-hover/item:scale-150 transition-transform flex-shrink-0" />
                        <span className="text-zinc-700 dark:text-zinc-300 group-hover/item:text-brand-600 dark:group-hover/item:text-brand-500 transition-colors font-medium">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-24">
          <div className="bg-zinc-900 dark:bg-zinc-900 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 via-transparent to-brand-600/5" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6 text-white">¿No encuentras lo que buscas?</h2>
              <p className="text-zinc-400 text-lg font-light mb-10 max-w-xl mx-auto">
                Fabricamos productos personalizados según tus necesidades específicas. Cuéntanos tu idea.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-3 bg-brand-600 text-white px-10 py-5 rounded-full text-lg font-bold tracking-wide hover:bg-brand-700 hover:scale-105 transition-all shadow-lg hover:shadow-brand-500/25">
                Solicita una Cotización Especial <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
