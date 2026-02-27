import Link from 'next/link'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Conoce nuestra política de privacidad. En AV GRAFFIX no usamos cookies de seguimiento ni almacenamos datos personales.',
  openGraph: {
    title: 'Política de Privacidad | AV GRAFFIX',
    description: 'Navegación 100% plana y anónima. Sin cookies de seguimiento.',
  },
}

const sections = [
  {
    title: 'Navegación 100% Plana y Anónima',
    content:
      'En AV GRAFFIX valoramos profundamente la privacidad digital. <strong>No usamos cookies de seguimiento</strong>, ni píxeles invasivos, y mucho menos almacenamos direcciones IPs de nuestros visitantes. Tampoco requerimos ninguna clase de registro para pre-visualizar nuestro catálogo ni nuestro portafolio de trabajos.',
  },
  {
    title: 'Uso de Analytics Básicos',
    content:
      'Solemos recolectar <strong>exclusivamente datos anónimos de uso general</strong> (tales como "visitas a la página de Servicios" o "clics en el menú"), llevados a cabo mediante herramientas básicas como Vercel Analytics. Este procesamiento <strong>no incluye identificación personal</strong> o información de tracking que cruce bases de datos externas.',
  },
  {
    title: 'Cambios en esta Política',
    content:
      'Podemos actualizar esta página ocasionalmente para adaptarnos a las normativas de la nube o legislaciones vigentes. Te recomendamos revisarla de vez en cuando. El uso continuado del sitio web implica la absoluta aceptación de estos cambios transparentes.',
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-500 font-sans">
      <section className="relative py-24 overflow-hidden bg-zinc-900 dark:bg-zinc-950">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 via-transparent to-brand-600/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 bg-brand-600/10 text-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-4 text-white">
              Política de{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-400">Privacidad</span>
            </h1>
            <p className="text-lg font-light text-zinc-400 max-w-lg mx-auto">
              Tu privacidad es nuestra prioridad. Navegación transparente y sin rastreo.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-4xl">
        <div className="bg-white dark:bg-zinc-900/40 rounded-3xl border border-black/5 dark:border-white/5 shadow-sm overflow-hidden">
          {sections.map((section, i) => (
            <div
              key={i}
              className={`p-8 md:p-12 ${i < sections.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold">
                  {i + 1}
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
                    {section.title}
                  </h2>
                  <p
                    className="text-zinc-600 dark:text-zinc-400 font-light leading-relaxed text-lg [&>strong]:text-zinc-900 dark:[&>strong]:text-white [&>strong]:font-semibold"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-500 font-bold hover:gap-3 transition-all"
          >
            <ArrowLeft size={18} /> Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  )
}
