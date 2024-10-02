import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">AV GRAFFIX</h3>
            <Image src="https://i.imgur.com/g1iUY9k.png" alt="AV GRAFFIX Logo" width={100} height={50} />
            <p className="mt-4">Diseño Gráfico Integral • Impresión • Publicidad</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <p>Email: avgraffix@gmail.com</p>
            <p>Teléfono: (45) 238 0877</p>
            <p>Temuco, Araucanía</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-red-600 transition-colors">Nosotros</Link></li>
              <li><Link href="/services" className="hover:text-red-600 transition-colors">Servicios</Link></li>
              <li><Link href="/portfolio" className="hover:text-red-600 transition-colors">Portafolio</Link></li>
              <li><Link href="/contact" className="hover:text-red-600 transition-colors">Contacto</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p>&copy; 2024 AV GRAFFIX. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}