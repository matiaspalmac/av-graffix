'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-MLGpz042DLuxay6semGCDZeP8oiiuB.jpg"
            alt="AV GRAFFIX Logo"
            width={100}
            height={50}
            className="h-12 w-auto"
          />
        </Link>
        <nav className="hidden md:flex space-x-8">
          <Link href="/about" className="hover:text-red-600 transition-colors">Nosotros</Link>
          <Link href="/services" className="hover:text-red-600 transition-colors">Servicios</Link>
          <Link href="/portfolio" className="hover:text-red-600 transition-colors">Portafolio</Link>
          <Link href="/contact" className="hover:text-red-600 transition-colors">Contacto</Link>
        </nav>
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <Link href="/about" className="hover:text-red-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Nosotros</Link>
            <Link href="/services" className="hover:text-red-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Servicios</Link>
            <Link href="/portfolio" className="hover:text-red-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Portafolio</Link>
            <Link href="/contact" className="hover:text-red-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Contacto</Link>
          </div>
        </div>
      )}
    </header>
  )
}