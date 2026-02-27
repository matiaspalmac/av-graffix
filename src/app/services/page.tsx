import { Palette, FileText, Image as ImageIcon, Gift, Layers, ArrowRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Servicios',
  description: 'Branding, papelería corporativa, folletería promocional, productos promocionales y soportes gráficos. Soluciones integrales de diseño e impresión en Temuco.',
  openGraph: {
    title: 'Servicios | AV GRAFFIX',
    description: 'Soluciones integrales de diseño e impresión para impulsar tu marca.',
  },
}

const services = [
  {
    icon: Palette,
    title: "Branding",
    description: "Diseño de imágenes corporativas (logotipos) y aplicación de norma gráfica en diferentes soportes.",
    badges: ["Identidad Visual", "Norma Gráfica"],
    price: "Cotización en 24h",
    features: ["Logotipo profesional", "Manual de marca", "Papelería base", "Versiones digitales"],
  },
  {
    icon: FileText,
    title: "Papelería Corporativa",
    description: "Tarjetas presentación, sobres, hojas, tarjetones de invitación y elementos institucionales de primer nivel.",
    badges: ["Impresión Premium", "Acabados Finos"],
    price: "Desde $25.000",
    features: ["Tarjetas de presentación", "Sobres corporativos", "Hojas membretadas", "Tarjetones de invitación"],
  },
  {
    icon: ImageIcon,
    title: "Folletería Promocional",
    description: "Dípticos, trípticos, folletos y volantes publicitarios en alta resolución para potenciar tus campañas.",
    badges: ["Offset y Digital", "Alto Impacto"],
    price: "Desde $35.000",
    features: ["Dípticos y trípticos", "Folletos corporativos", "Volantes publicitarios", "Catálogos impresos"],
  },
  {
    icon: Gift,
    title: "Productos Promocionales",
    description: "Pendones Roller, lienzos, banderas, toldos, chapitas y adhesivos para activaciones de marca y eventos.",
    badges: ["Stock Constante", "Merchandising"],
    price: "Cotización en 24h",
    features: ["Pendones Roller", "Banderas y lienzos", "Chapitas personalizadas", "Adhesivos de marca"],
  },
  {
    icon: Layers,
    title: "Soportes Gráficos",
    description: "Telones, Window vision, señaléticas, paneles, panaflex, letreros metálicos y trabajos en acrílicos y madera.",
    badges: ["Gran Formato", "Materiales Rígidos"],
    price: "Cotización en 24h",
    features: ["Señalética profesional", "Letreros metálicos", "Paneles y panaflex", "Corte en acrílico y madera"],
  },
]

const steps = [
  { title: 'Consulta Inicial', desc: 'Análisis de requerimientos y cotización personalizada.' },
  { title: 'Diseño y Propuesta', desc: 'Desarrollo visual y validación de la matriz gráfica.' },
  { title: 'Aprobación', desc: 'Revisión de ajustes finales y pase a producción.' },
  { title: 'Producción', desc: 'Impresión, corte y terminaciones de alta precisión.' },
  { title: 'Entrega Final', desc: 'Despacho o instalación profesional en terreno.' },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-500 font-sans">
      <section className="relative py-32 overflow-hidden bg-zinc-900 dark:bg-zinc-950">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 via-transparent to-brand-600/5" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-600/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <p className="text-brand-500 text-sm font-bold tracking-[0.3em] uppercase mb-4">Lo Que Hacemos</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 text-white">
              Nuestros{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-400">Servicios</span>
            </h1>
            <p className="text-xl md:text-2xl font-light text-zinc-400 leading-relaxed max-w-2xl">
              Soluciones integrales de diseño e impresión diseñadas para impulsar tu marca al siguiente nivel.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-32 space-y-20">
          {services.map((service, index) => {
            const Icon = service.icon
            const isReversed = index % 2 !== 0

            return (
              <div
                key={index}
                className={`group grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${isReversed ? 'lg:direction-rtl' : ''}`}
              >
                <div className={`space-y-6 ${isReversed ? 'lg:order-2' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900/30 rounded-2xl flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 transition-all duration-300">
                      <Icon className="w-7 h-7 text-brand-600 dark:text-brand-500 group-hover:text-white transition-colors" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-zinc-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {service.title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
                    {service.description}
                  </p>

                  <ul className="space-y-3">
                    {service.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                        <CheckCircle2 className="w-5 h-5 text-brand-600 dark:text-brand-500 flex-shrink-0" />
                        <span className="font-medium">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {service.badges.map((badge, idx) => (
                      <span key={idx} className="bg-brand-50 dark:bg-brand-900/10 text-brand-600 dark:text-brand-400 text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg border border-brand-100 dark:border-brand-900/30">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={`${isReversed ? 'lg:order-1' : ''}`}>
                  <div className="bg-white dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 p-10 rounded-3xl shadow-sm group-hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl" />
                    <div className="relative z-10">
                      <div className="text-sm text-zinc-500 dark:text-zinc-400 font-bold tracking-widest uppercase mb-2">Inversión</div>
                      <div className="text-3xl font-black text-zinc-900 dark:text-white mb-4">{service.price}</div>
                      <div className="h-px bg-zinc-100 dark:bg-zinc-800 mb-6" />
                      <p className="text-zinc-600 dark:text-zinc-400 font-light text-sm leading-relaxed mb-6">
                        Incluye diseño, producción e impresión con materiales premium y acabados de alta calidad.
                      </p>
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-brand-700 hover:scale-105 transition-all shadow-md hover:shadow-brand-500/20"
                      >
                        Solicitar Cotización <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </section>
        <section className="pb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-zinc-900 dark:text-white">
              Nuestro <span className="text-brand-600 dark:text-brand-500">Proceso</span>
            </h2>
            <div className="h-1 w-24 bg-brand-600 dark:bg-brand-500 mx-auto rounded-full mb-6" />
            <p className="text-zinc-600 dark:text-zinc-400 font-light text-lg max-w-xl mx-auto">
              Una metodología en bloque concebida para la precisión gráfica industrial.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-600/20 to-transparent -translate-y-1/2" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {steps.map((step, index) => (
                <div key={index} className="group relative">
                  <div className="flex flex-col items-center bg-white dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 p-6 lg:p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2 cursor-default h-full">
                    <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-950 text-zinc-400 dark:text-zinc-600 rounded-2xl flex items-center justify-center text-lg font-black mb-5 border-2 border-zinc-100 dark:border-zinc-800 group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 transition-all duration-500">
                      0{index + 1}
                    </div>
                    <h3 className="text-center font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-2 leading-tight text-sm">
                      {step.title}
                    </h3>
                    <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="pb-32">
          <div className="bg-zinc-900 dark:bg-zinc-900 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 via-transparent to-brand-600/5" />
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6 text-white">¿Listo para comenzar tu proyecto?</h2>
              <p className="text-zinc-400 text-lg font-light mb-10 max-w-xl mx-auto">
                Contáctanos hoy y recibe asesoría personalizada sin compromiso.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-3 bg-brand-600 text-white px-10 py-5 rounded-full text-lg font-bold tracking-wide hover:bg-brand-700 hover:scale-105 transition-all shadow-lg hover:shadow-brand-500/25">
                Contáctanos Ahora <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
