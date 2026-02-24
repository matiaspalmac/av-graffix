import { Mail, Phone, MapPin, Instagram, Facebook, Clock, MessageCircle } from 'lucide-react'
import ContactForm from '@/components/contact-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Contáctanos para iniciar tu proyecto de diseño gráfico, impresión o publicidad en Temuco, Araucanía. Respuesta en 24 horas.',
  openGraph: {
    title: 'Contacto | AV GRAFFIX',
    description: 'Contáctanos para iniciar tu proyecto de diseño gráfico, impresión o publicidad en Temuco, Araucanía.',
  },
}

const contactInfo = [
  {
    icon: <Mail className="w-5 h-5" />,
    label: 'Email',
    value: 'patricia.valdebenito@avgraffix.cl',
    href: 'mailto:patricia.valdebenito@avgraffix.cl',
  },
  {
    icon: <Phone className="w-5 h-5" />,
    label: 'WhatsApp',
    value: '+569 9279 1148',
    href: 'https://wa.me/56992791148',
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    label: 'Ubicación',
    value: 'Temuco, Araucanía',
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-500 font-sans">

      {/* Hero Header */}
      <section className="relative py-32 overflow-hidden bg-zinc-900 dark:bg-zinc-950">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 via-transparent to-brand-600/5" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-brand-600/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <p className="text-brand-500 text-sm font-bold tracking-[0.3em] uppercase mb-4">Hablemos</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 text-white">
              Conecta con{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-400">Nosotros</span>
            </h1>
            <p className="text-xl md:text-2xl font-light text-zinc-400 leading-relaxed max-w-2xl">
              Estamos listos para transformar tus ideas en piezas gráficas memorables. Respuesta en menos de 24 horas.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Cards Strip */}
      <section className="relative z-20 -mt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contactInfo.map((info, i) => (
              <div
                key={i}
                className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl dark:shadow-none border border-black/5 dark:border-white/5 p-6 flex items-center gap-4 group hover:border-brand-500/20 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                  {info.icon}
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">{info.label}</p>
                  {info.href ? (
                    <a href={info.href} className="text-zinc-900 dark:text-white font-medium hover:text-brand-600 dark:hover:text-brand-500 transition-colors">
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-zinc-900 dark:text-white font-medium">{info.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">

          {/* Form */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-8">
            {/* Schedule */}
            <div className="bg-white dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 p-8 rounded-3xl shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-500 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Horario de Atención</h3>
              </div>
              <ul className="space-y-3 text-zinc-600 dark:text-zinc-400">
                <li className="flex justify-between items-center pb-3 border-b border-black/5 dark:border-white/10">
                  <span>Lunes a Viernes</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-200">9:00 - 18:00</span>
                </li>
                <li className="flex justify-between items-center pb-3 border-b border-black/5 dark:border-white/10">
                  <span>Sábado</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-200">10:00 - 14:00</span>
                </li>
                <li className="flex justify-between items-center pt-1">
                  <span>Domingo</span>
                  <span className="font-semibold text-brand-600 dark:text-brand-500">Cerrado</span>
                </li>
              </ul>
            </div>

            {/* Quick WhatsApp */}
            <a
              href="https://wa.me/56992791148"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-green-600 text-white p-6 rounded-3xl hover:bg-green-700 transition-all duration-300 group shadow-lg shadow-green-600/20"
            >
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-lg">Chat Directo</p>
                <p className="text-green-100 text-sm font-light">Escríbenos por WhatsApp ahora</p>
              </div>
            </a>

            {/* Social */}
            <div className="bg-white dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 p-8 rounded-3xl shadow-sm">
              <h3 className="text-lg font-bold mb-6 text-zinc-900 dark:text-white">Síguenos</h3>
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/publicidad.avgraffix/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-black/10 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 font-medium text-sm"
                >
                  <Facebook className="w-5 h-5" /> Facebook
                </a>
                <a
                  href="https://www.instagram.com/publicidad.avgraffix/?hl=es-la"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-black/10 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white hover:border-transparent transition-all duration-300 font-medium text-sm"
                >
                  <Instagram className="w-5 h-5" /> Instagram
                </a>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm">
              <div className="aspect-[4/3] bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center relative">
                <div className="text-center">
                  <MapPin className="w-10 h-10 text-brand-600 dark:text-brand-500 mx-auto mb-3" />
                  <p className="text-zinc-600 dark:text-zinc-400 font-medium">Temuco, Araucanía</p>
                  <p className="text-zinc-500 dark:text-zinc-500 text-sm font-light">Región de la Araucanía, Chile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
