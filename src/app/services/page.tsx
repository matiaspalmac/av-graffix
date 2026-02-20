import { Palette, FileText, Image as ImageIcon, Gift, Layers, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const services = [
  { icon: Palette, title: "Branding", description: "Diseño de imágenes corporativas (logotipos) y aplicación de norma gráfica en diferentes soportes.", badges: ["Identidad Visual", "Norma Gráfica"], price: "Cotización en 24h" },
  { icon: FileText, title: "Papelería Corporativa", description: "Tarjetas presentación, sobres, hojas, tarjetones de invitación y elementos institucionales de primer nivel.", badges: ["Impresión Premium", "Acabados Finos"], price: "Desde $25.000" },
  { icon: ImageIcon, title: "Folletería Promocional", description: "Dípticos, trípticos, folletos y volantes publicitarios en alta resolución para potenciar tus campañas.", badges: ["Offset y Digital", "Alto Impacto"], price: "Desde $35.000" },
  { icon: Gift, title: "Productos Promocionales", description: "Pendones Roller, lienzos, banderas, toldos, chapitas y adhesivos para activaciones de marca y eventos.", badges: ["Stock Constante", "Merchandising"], price: "Cotización en 24h" },
  { icon: Layers, title: "Soportes Gráficos", description: "Telones, Window vision, señaléticas, paneles, panaflex, letreros metálicos y trabajos en acrílicos y madera.", badges: ["Gran Formato", "Materiales Rígidos"], price: "Cotización en 24h" },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-500 font-sans">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">

        <div className="text-center mb-24 relative">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-4 text-zinc-900 dark:text-white relative z-10">Nuestros <span className="text-red-600 dark:text-red-500">Servicios</span></h1>
          <div className="h-1 w-20 bg-red-600 dark:bg-red-500 mx-auto rounded-full shadow-sm dark:shadow-[0_0_10px_rgba(239,68,68,0.4)]"></div>
          <p className="mt-8 text-xl font-light text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Soluciones integrales de diseño e impresión diseñadas para impulsar el crecimiento de tu marca al siguiente nivel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {services.map((service, index) => (
            <div key={index} className="group relative bg-white dark:bg-zinc-900/40 p-10 rounded-3xl border border-black/5 dark:border-white/5 shadow-sm hover:shadow-xl dark:shadow-none hover:border-black/10 dark:hover:border-white/10 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-950 border border-black/5 dark:border-white/10 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:border-red-500/30 transition-all duration-500">
                    <service.icon className="w-8 h-8 text-zinc-700 dark:text-zinc-300 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors" strokeWidth={1.5} />
                  </div>
                  {/* Etiqueta de precio */}
                  <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-bold px-3 py-1.5 rounded-full group-hover:bg-red-600 group-hover:text-white transition-colors">{service.price}</span>
                </div>

                <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{service.title}</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-light mb-8 flex-grow">{service.description}</p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {service.badges.map((badge, idx) => (
                    <span key={idx} className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border border-red-100 dark:border-red-900/30">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-white">Nuestro Proceso de Trabajo</h2>
            <p className="text-zinc-600 dark:text-zinc-400 font-light">Una metodología en bloque concebida para la precisión gráfica industrial.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-8 max-w-6xl mx-auto relative z-10">
            {/* Camino visual de fondo (Conexiones) */}
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-red-600/20 dark:via-red-500/20 to-transparent -translate-y-1/2 z-0"></div>

            {[
              { title: 'Consulta Inicial', desc: 'Análisis de requerimientos y cotización' },
              { title: 'Diseño y Propuesta', desc: 'Desarrollo visual y validación de matriz' },
              { title: 'Aprobación', desc: 'Ajustes finales y pase a prensa' },
              { title: 'Producción', desc: 'Impresión, corte y terminaciones' },
              { title: 'Entrega Final', desc: 'Despacho o instalación en terreno' }
            ].map((step, index) => (
              <div key={index} className="group relative z-10">
                <div className="flex flex-col items-center bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 p-8 rounded-3xl shadow-sm hover:shadow-xl dark:shadow-none hover:border-red-500/30 transition-all duration-500 group-hover:-translate-y-3 cursor-default h-full">
                  <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-950 text-zinc-400 dark:text-zinc-600 rounded-full flex items-center justify-center text-xl font-black mb-6 border-4 border-zinc-100 dark:border-zinc-800 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-200 dark:group-hover:border-red-900 transition-colors duration-500 shadow-inner">
                    0{index + 1}
                  </div>
                  <h3 className="text-center font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors mb-3 leading-tight">{step.title}</h3>
                  <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-8 text-zinc-900 dark:text-white">¿Listo para comenzar tu proyecto?</h2>
          <Link href="/contact" className="inline-flex items-center gap-3 bg-red-600 text-white px-10 py-5 rounded-full text-lg font-bold tracking-wide hover:bg-red-700 hover:scale-105 transition-all shadow-lg hover:shadow-red-500/25">
            Contáctanos Ahora <ArrowRight size={20} />
          </Link>
        </div>
      </main>
    </div>
  )
}