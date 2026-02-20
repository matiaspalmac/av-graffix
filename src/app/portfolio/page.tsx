import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const portfolioLogo = "/logo.png?v=2026"

const portfolioItems = [
  { image: portfolioLogo, company: "Empresa 1", description: "Identidad Visual", category: "Branding" },
  { image: portfolioLogo, company: "Empresa 2", description: "Empaque Sustentable", category: "Packaging" },
  { image: portfolioLogo, company: "Empresa 3", description: "Campaña Anual", category: "Publicidad" },
  { image: portfolioLogo, company: "Empresa 4", description: "Diseño Editorial", category: "Impresos" },
  { image: portfolioLogo, company: "Empresa 5", description: "Rotulación Vehicular", category: "Soportes" },
  { image: portfolioLogo, company: "Empresa 6", description: "Stand Corporativo", category: "Producción" },
]

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-500 font-sans">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">

        {/* Header Section */}
        <div className="max-w-4xl mb-24 mt-12">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 text-zinc-900 dark:text-white">
            Nuestros <span className="text-red-600 dark:text-red-500">Trabajos</span>
          </h1>
          <p className="text-2xl font-light text-zinc-600 dark:text-zinc-400 leading-relaxed border-l-4 border-red-600 pl-6">
            Una exhibición de precisión visual. Proyectos que trascienden e impactan el mercado desde el primer vistazo.
          </p>
        </div>

        {/* Minimalist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-[2rem] overflow-hidden mb-32">
          {portfolioItems.map((item, index) => (
            <div key={index} className="group relative bg-white dark:bg-zinc-950 p-12 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-500">

              <div className="flex justify-between items-start mb-12">
                <div>
                  <p className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-2">{item.category}</p>
                  <h2 className="text-3xl font-bold text-zinc-900 dark:text-white group-hover:text-red-600 transition-colors">{item.company}</h2>
                </div>
                <div className="w-12 h-12 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white group-hover:border-transparent transition-all duration-300 -rotate-45 group-hover:rotate-0">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>

              <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center p-8">
                <img
                  src={item.image}
                  alt={item.company}
                  className="w-full h-full object-contain dark:brightness-110 opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                />
              </div>

              <p className="mt-8 text-lg font-light text-zinc-600 dark:text-zinc-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-zinc-900 dark:bg-zinc-900 rounded-[2.5rem] p-12 md:p-24 text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-8 text-white">¿Visualizas tu marca aquí?</h2>
          <p className="text-zinc-400 text-xl font-light mb-12 max-w-2xl mx-auto">Nuestro equipo de expertos está listo para transformar tus conceptos en piezas memorables de extrema calidad.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-red-600 text-white px-12 py-5 rounded-full text-lg font-bold tracking-wide hover:bg-white hover:text-black transition-all">
            Empezar Proyecto Ahora
          </Link>
        </div>
      </main>
    </div>
  )
}