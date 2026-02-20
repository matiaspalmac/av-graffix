'use client'
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ContactPage() {
  // Form submission redirect to WhatsApp
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const message = formData.get('message') as string

    // Número de WhatsApp (Formato internacional sin el +)
    const whatsappNumber = '56992791148' // Reemplazar con el móvil real si hay uno diferente
    const text = `Hola AV GRAFFIX, mi nombre es ${name} (${email}).%0A%0ATengo el siguiente proyecto en mente:%0A${message}`

    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-500 font-sans">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">

        <div className="text-center mb-20 relative">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-4 text-zinc-900 dark:text-white relative z-10">Conecta con <span className="text-red-600 dark:text-red-500">Nosotros</span></h1>
          <div className="h-1 w-20 bg-red-600 dark:bg-red-500 mx-auto rounded-full shadow-sm dark:shadow-[0_0_10px_rgba(239,68,68,0.4)]"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">

          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 p-8 md:p-12 rounded-3xl shadow-xl dark:shadow-none relative overflow-hidden">
              <h2 className="text-3xl font-bold tracking-tight mb-8 text-zinc-900 dark:text-white">Inicia tu Proyecto</h2>

              <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-semibold tracking-wide uppercase text-zinc-500 dark:text-zinc-400">Nombre Completo</label>
                    <input type="text" id="name" name="name" className="w-full px-4 py-4 bg-zinc-50 dark:bg-zinc-950 border border-black/5 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 outline-none transition-all duration-300 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold tracking-wide uppercase text-zinc-500 dark:text-zinc-400">Email Profesional</label>
                    <input type="email" id="email" name="email" className="w-full px-4 py-4 bg-zinc-50 dark:bg-zinc-950 border border-black/5 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 outline-none transition-all duration-300 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600" placeholder="john@empresa.com" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-semibold tracking-wide uppercase text-zinc-500 dark:text-zinc-400">Detalles del Proyecto</label>
                  <textarea id="message" name="message" rows={6} className="w-full px-4 py-4 bg-zinc-50 dark:bg-zinc-950 border border-black/5 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 outline-none transition-all duration-300 resize-none text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600" placeholder="Cuéntanos qué tienes en mente..." required></textarea>
                </div>

                <button type="submit" className="w-full sm:w-auto bg-red-600 text-white px-10 py-4 rounded-full font-bold tracking-wide hover:bg-red-700 hover:scale-[1.02] transform transition-all shadow-lg hover:shadow-red-500/25">
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-8 text-zinc-900 dark:text-white">Información de Contacto</h2>
              <div className="space-y-6">
                <div className="flex items-center group">
                  <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 text-red-600 dark:text-red-500 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">avgraffix@gmail.com</span>
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">info.avgraffix@gmail.com</span>
                  </div>
                </div>
                <a href="https://wa.me/56992791148" className="flex items-center group">
                  <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 text-red-600 dark:text-red-500 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-lg text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">+569 9279 1148</span>
                </a>
                <div className="flex items-center group cursor-default">
                  <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 text-red-600 dark:text-red-500 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-lg text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">Temuco, Araucanía</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-100 dark:bg-zinc-900/50 p-8 rounded-3xl border border-black/5 dark:border-white/5">
              <h3 className="text-xl font-bold mb-6 text-zinc-900 dark:text-white">Horario de Atención</h3>
              <ul className="space-y-3 text-zinc-600 dark:text-zinc-400">
                <li className="flex justify-between items-center pb-3 border-b border-black/5 dark:border-white/10">
                  <span>Lunes a Viernes</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-200">9:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between items-center pb-3 border-b border-black/5 dark:border-white/10">
                  <span>Sábado</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-200">10:00 AM - 2:00 PM</span>
                </li>
                <li className="flex justify-between items-center pt-1">
                  <span>Domingo</span>
                  <span className="font-semibold text-red-600 dark:text-red-500">Cerrado</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6 text-zinc-900 dark:text-white">Síguenos</h3>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/publicidad.avgraffix/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:border-transparent transition-all duration-300 transform hover:-translate-y-1">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/publicidad.avgraffix/?hl=es-la" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:border-transparent transition-all duration-300 transform hover:-translate-y-1">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}