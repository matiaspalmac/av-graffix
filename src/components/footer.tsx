import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 py-16 border-t border-black/5 dark:border-white/5 relative overflow-hidden transition-colors duration-500">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-red-600/30 dark:via-red-600/50 to-transparent"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24 mb-16">
          <div className="space-y-6">
            <img src="/logo.png?v=2026" alt="AV GRAFFIX Logo" className="h-16 w-auto drop-shadow-sm dark:drop-shadow-lg dark:filter dark:brightness-110" />
            <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-sm">
              Fundada en nov. 2006, AV GRAFFIX es la agencia líder en diseño gráfico, producción y publicidad en la región de la Araucanía. Acompañamos el crecimiento de tu marca entregando soluciones atemporales, funcionales de extrema calidad y precisión.
            </p>
          </div>

          <div>
            <h3 className="text-zinc-900 dark:text-white text-base font-bold tracking-widest uppercase mb-6">Contacto Directo</h3>
            <ul className="space-y-4 text-base text-zinc-700 dark:text-zinc-300">
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-red-600"></span> Email: <a href="mailto:avgraffix@gmail.com" className="hover:text-red-600 dark:hover:text-red-500 transition-colors font-medium">avgraffix@gmail.com</a> | <a href="mailto:info.avgraffix@gmail.com" className="hover:text-red-600 dark:hover:text-red-500 transition-colors font-medium text-sm">info.avgraffix@gmail.com</a></li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-red-600"></span> WhatsApp: <a href="https://wa.me/56992791148" className="hover:text-red-600 dark:hover:text-red-500 transition-colors font-medium">+569 9279 1148</a></li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-red-600"></span> Temuco, Región de la Araucanía</li>
            </ul>
          </div>

          <div>
            <h3 className="text-zinc-900 dark:text-white text-base font-bold tracking-widest uppercase mb-6">Explora</h3>
            <ul className="space-y-4 text-base font-medium text-zinc-700 dark:text-zinc-300">
              <li><Link href="/about" className="hover:text-red-600 dark:hover:text-red-500 hover:translate-x-1 inline-block transition-all duration-300">Nosotros</Link></li>
              <li><Link href="/services" className="hover:text-red-600 dark:hover:text-red-500 hover:translate-x-1 inline-block transition-all duration-300">Servicios</Link></li>
              <li><Link href="/portfolio" className="hover:text-red-600 dark:hover:text-red-500 hover:translate-x-1 inline-block transition-all duration-300">Portafolio</Link></li>
              <li><Link href="/contact" className="hover:text-red-600 dark:hover:text-red-500 hover:translate-x-1 inline-block transition-all duration-300">Contacto</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-medium tracking-wide">
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-center text-center md:text-left">
            <p>&copy; {new Date().getFullYear()} AV GRAFFIX. Todos los derechos reservados.</p>
            <Link href="/privacy" className="text-zinc-500 hover:text-red-600 dark:hover:text-red-500 transition-colors">Política de Privacidad</Link>
          </div>

          <div className="flex gap-6">
            <a href="https://www.instagram.com/publicidad.avgraffix/?hl=es-la" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 dark:hover:text-red-500 transition-colors">Instagram</a>
            <a href="https://www.facebook.com/publicidad.avgraffix/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 dark:hover:text-red-500 transition-colors">Facebook</a>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-zinc-500 tracking-wide">
          Creado con ❤️ por <a href="https://www.linkedin.com/in/matiaspalmac/" target="_blank" rel="noopener noreferrer" className="text-zinc-800 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-500 transition-colors font-bold">Matias Palma</a>
        </div>
      </div>
    </footer>
  )
}