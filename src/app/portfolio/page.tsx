import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import PortfolioGrid from '@/components/portfolio-grid'

export const metadata: Metadata = {
  title: 'Portafolio',
  description: 'Explora nuestros trabajos de diseño gráfico, branding, packaging, publicidad e impresión. Proyectos que trascienden e impactan el mercado.',
  openGraph: {
    title: 'Portafolio | AV GRAFFIX',
    description: 'Una exhibición de precisión visual. Proyectos que impactan.',
  },
}

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-500 font-sans">
      <section className="relative py-32 overflow-hidden bg-zinc-900 dark:bg-zinc-950">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 via-transparent to-brand-600/5" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-600/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <p className="text-brand-500 text-sm font-bold tracking-[0.3em] uppercase mb-4">Nuestro Trabajo</p>
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter mb-6 text-white">
              Nuestros{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-400">Trabajos</span>
            </h1>
            <p className="text-xl md:text-2xl font-light text-zinc-400 leading-relaxed border-l-4 border-brand-600 pl-6 max-w-2xl">
              Una exhibición de precisión visual. Proyectos que trascienden e impactan el mercado desde el primer vistazo.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <PortfolioGrid />
        <div className="bg-zinc-900 dark:bg-zinc-900 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 via-transparent to-brand-600/5" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6 text-white">¿Visualizas tu marca aquí?</h2>
            <p className="text-zinc-400 text-lg font-light mb-10 max-w-2xl mx-auto">
              Nuestro equipo de expertos está listo para transformar tus conceptos en piezas memorables de extrema calidad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/contact" className="inline-flex items-center gap-2 bg-brand-600 text-white px-10 py-5 rounded-full text-lg font-bold tracking-wide hover:bg-brand-700 hover:scale-105 transition-all shadow-lg hover:shadow-brand-500/25">
                Empezar Proyecto Ahora <ArrowRight size={20} />
              </Link>
              <Link href="/services" className="inline-flex items-center gap-2 bg-transparent text-white border-2 border-white/20 px-10 py-5 rounded-full text-lg font-bold tracking-wide hover:bg-white/10 hover:border-white/40 transition-all">
                Ver Servicios
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
