import Link from "next/link"
import { ArrowRight, Award, Clock, Target, Sparkles, CheckCircle2 } from "lucide-react"
import HeroSlider from "@/components/hero-slider"
import AnimatedCounter from "@/components/animated-counter"
import { ProductCard } from "@/components/home-sections"
import LogoCarousel from "@/components/logo-carousel"
import { companies, homeProducts } from "@/lib/data"

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 selection:bg-brand-500/30 selection:text-zinc-900 dark:selection:text-white font-sans overflow-x-hidden">
      {/* Hero Section — Client Component */}
      <HeroSlider />

      {/* Quick Stats Section */}
      <section className="py-16 bg-zinc-900 dark:bg-zinc-900 relative z-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-600/10 via-transparent to-brand-600/10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="py-6 md:py-0 group">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600/10 text-brand-500 mb-4">
                <Award className="w-7 h-7" />
              </div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2">
                <AnimatedCounter to={19} suffix="+" />
              </div>
              <div className="text-zinc-400 font-medium tracking-wide">
                Años de Excelencia Visual
              </div>
            </div>
            <div className="py-6 md:py-0 border-y md:border-y-0 md:border-x border-white/10 group">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600/10 text-brand-500 mb-4">
                <Target className="w-7 h-7" />
              </div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2">
                <AnimatedCounter to={1200} suffix="+" />
              </div>
              <div className="text-zinc-400 font-medium tracking-wide">
                Proyectos Entregados
              </div>
            </div>
            <div className="py-6 md:py-0 group">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600/10 text-brand-500 mb-4">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2">
                <AnimatedCounter to={98} suffix="%" />
              </div>
              <div className="text-zinc-400 font-medium tracking-wide">
                Satisfacción Garantizada
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-32 relative bg-zinc-50 dark:bg-zinc-950">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 text-zinc-900 dark:text-zinc-100">
              Nuestra{" "}
              <span className="font-light italic text-brand-600 dark:text-brand-500">
                Especialidad
              </span>
            </h2>
            <div className="h-1 w-24 bg-brand-600 dark:bg-brand-500 mx-auto rounded-full"></div>
            <p className="mt-8 text-xl font-light text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Descubre un abanico completo de soluciones en diseño e impresión de
              la más alta calidad y precisión.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homeProducts.map((product, index) => (
              <ProductCard key={index} product={product} index={index} />
            ))}
          </div>

          <div className="mt-20 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-3 bg-brand-600 text-white px-10 py-5 rounded-full text-lg font-bold tracking-wide hover:bg-brand-700 hover:scale-105 transition-all shadow-lg hover:shadow-brand-500/25"
            >
              Ver Todos los Servicios <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Companies Section — Infinite Carousel */}
      <section className="py-32 bg-white dark:bg-zinc-900/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-16">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-zinc-900 dark:text-white">
              Marcas{" "}
              <span className="text-brand-600 dark:text-brand-500">Aliadas</span>
            </h2>
            <div className="h-1 w-24 bg-brand-600 dark:bg-brand-500 mx-auto rounded-full mb-8"></div>
            <p className="text-zinc-600 dark:text-zinc-500 text-xl font-light max-w-2xl mx-auto">
              Empresas que confían en nuestra extrema precisión y calidad.
            </p>
          </div>
        </div>

        <LogoCarousel companies={companies} />
      </section>

      {/* ¿Por qué elegirnos? */}
      <section className="py-32 bg-zinc-50 dark:bg-zinc-950 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 text-zinc-900 dark:text-zinc-100">
              ¿Por qué{" "}
              <span className="font-light italic text-brand-600 dark:text-brand-500">
                Elegirnos?
              </span>
            </h2>
            <div className="h-1 w-24 bg-brand-600 dark:bg-brand-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Clock className="w-7 h-7" />,
                title: "Entrega Puntual",
                desc: "Cumplimos estrictamente con los plazos establecidos. Tu proyecto listo cuando lo necesitas.",
              },
              {
                icon: <Award className="w-7 h-7" />,
                title: "Calidad Premium",
                desc: "Materiales de primera línea y acabados de alta precisión en cada trabajo que entregamos.",
              },
              {
                icon: <Target className="w-7 h-7" />,
                title: "Asesoría Directa",
                desc: "Acompañamiento personalizado en todo el proceso, desde el diseño hasta la entrega final.",
              },
              {
                icon: <CheckCircle2 className="w-7 h-7" />,
                title: "Garantía Total",
                desc: "Respaldamos cada producto. Si no es perfecto, lo rehacemos sin costo adicional.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group relative bg-white dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 p-8 rounded-3xl hover:shadow-xl transition-all duration-500 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-500 mb-6 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-brand-600 via-brand-600 to-brand-700 dark:from-brand-700 dark:via-brand-600 dark:to-brand-800 py-24">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzAtOS45NC04LjA2LTE4LTE4LTE4UzAgOC4wNiAwIDE4czguMDYgMTggMTggMTggMTgtOC4wNiAxOC0xOHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-6">
              ¿Listo para dar vida a tu proyecto?
            </h2>
            <p className="text-brand-100 text-xl font-light max-w-2xl mx-auto mb-10">
              Cuéntanos tu idea y recibe una cotización personalizada en menos de 24 horas. Sin compromisos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 bg-white text-brand-600 px-10 py-5 rounded-full text-lg font-bold tracking-wide hover:bg-zinc-100 hover:scale-105 transition-all shadow-lg"
              >
                Solicitar Cotización <ArrowRight size={20} />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-3 bg-transparent text-white border-2 border-white/30 px-10 py-5 rounded-full text-lg font-bold tracking-wide hover:bg-white/10 hover:border-white/60 transition-all"
              >
                Ver Portafolio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}