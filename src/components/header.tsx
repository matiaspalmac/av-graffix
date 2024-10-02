'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <Image
            src="https://i.imgur.com/g1iUY9k.png"
            alt="AV GRAFFIX Logo"
            width={100}
            height={50}
            className="h-12 w-auto"
          />
        </Link>
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="hover:text-red-600 transition-colors">Inicio</Link>
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
        <div ref={menuRef} className="md:hidden bg-white py-4">
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
