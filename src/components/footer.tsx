import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, Instagram, Facebook, ArrowRight, Linkedin } from 'lucide-react'

const footerLinks = [
  { href: '/about', label: 'Nosotros' },
  { href: '/services', label: 'Servicios' },
  { href: '/portfolio', label: 'Portafolio' },
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/contact', label: 'Contacto' },
]

export default function Footer() {
  return (
    <footer className="bg-zinc-900 dark:bg-zinc-950 text-zinc-400 relative overflow-hidden transition-colors duration-500">
      {/* Top accent */}
      <div className="h-1 bg-gradient-to-r from-transparent via-brand-600 to-transparent" />

      {/* CTA Strip */}
      <div className="border-b border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                ¿Tienes un proyecto en mente?
              </h3>
              <p className="text-zinc-500 font-light mt-1">Cuéntanos tu idea y recibe asesoría gratuita.</p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-full font-bold tracking-wide hover:bg-brand-700 hover:scale-105 transition-all shadow-lg hover:shadow-brand-600/20 flex-shrink-0"
            >
              Contáctanos <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1 space-y-6">
            <Image
              src="/avgraffix.png"
              alt="AV GRAFFIX Logo"
              width={160}
              height={56}
              className="h-14 w-auto drop-shadow-sm dark:drop-shadow-lg filter brightness-110"
            />
            <p className="text-sm leading-relaxed text-zinc-500 max-w-xs">
              AV GRAFFIX - Proyectando tus ideas. Agencia líder en diseño, producción y publicidad en la Araucanía desde 2006.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/publicidad.avgraffix/?hl=es-la"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/publicidad.avgraffix/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/avgraffix/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-bold tracking-widest uppercase mb-6">Explorar</h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all duration-300 group"
                  >
                    <span className="w-0 group-hover:w-4 h-px bg-brand-600 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-bold tracking-widest uppercase mb-6">Contacto</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 group">
                <Mail className="w-4 h-4 text-brand-600 mt-0.5 flex-shrink-0" />
                <div className="flex flex-col">
                  <a href="mailto:patricia.valdebenito@avgraffix.cl" className="text-zinc-400 hover:text-white transition-colors">patricia.valdebenito@avgraffix.cl</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-600 flex-shrink-0" />
                <a href="https://wa.me/56992791148" className="text-zinc-400 hover:text-white transition-colors">+569 9279 1148</a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-brand-600 flex-shrink-0" />
                <span className="text-zinc-400">Temuco, Araucanía</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-white text-sm font-bold tracking-widest uppercase mb-6">Horario</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span className="text-zinc-500">Lun - Jue</span>
                <span className="text-zinc-300 font-medium">9:00 - 19:00</span>
              </li>
              <li className="flex justify-between">
                <span className="text-zinc-500">Viernes</span>
                <span className="text-zinc-300 font-medium">9:00 - 18:00</span>
              </li>
              <li className="flex justify-between">
                <span className="text-zinc-500">Sáb - Dom</span>
                <span className="text-brand-500 font-medium">Cerrado</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
              <p>&copy; {new Date().getFullYear()} AV GRAFFIX. Todos los derechos reservados.</p>
              <Link href="/privacy" className="hover:text-brand-500 transition-colors">Política de Privacidad</Link>
            </div>
            <p>
              Creado con ❤️ por{' '}
              <a
                href="https://www.linkedin.com/in/matiaspalmac/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-brand-500 transition-colors font-bold"
              >
                Matias Palma
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
