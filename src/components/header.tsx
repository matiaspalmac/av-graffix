'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, Sun, Moon } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true)
    }
  }, [])

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
      setIsDark(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
      setIsDark(true)
    }
  }

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
    <header className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 text-zinc-900 dark:text-zinc-100 sticky top-0 z-50 transition-colors duration-500">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="relative z-10 group">
          <div className="absolute inset-0 bg-red-500/10 dark:bg-red-500/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-500"></div>
          <img
            src="/logo.png?v=2026"
            alt="AV GRAFFIX Logo"
            className="h-16 w-auto relative z-10 dark:filter dark:brightness-110 drop-shadow-sm dark:drop-shadow-md transition-all duration-300"
          />
        </Link>
        <div className="hidden md:flex items-center space-x-10">
          <nav className="flex space-x-10 text-sm font-semibold tracking-wide uppercase text-zinc-600 dark:text-zinc-300">
            <Link href="/" className="hover:text-red-600 dark:hover:text-red-500 transition-colors">Inicio</Link>
            <Link href="/about" className="hover:text-red-600 dark:hover:text-red-500 transition-colors">Nosotros</Link>
            <Link href="/services" className="hover:text-red-600 dark:hover:text-red-500 transition-colors">Servicios</Link>
            <Link href="/portfolio" className="hover:text-red-600 dark:hover:text-red-500 transition-colors">Portafolio</Link>
            <Link href="/contact" className="hover:text-red-600 dark:hover:text-red-500 transition-colors">Contacto</Link>
          </nav>

          <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800"></div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div ref={menuRef} className="md:hidden bg-white dark:bg-zinc-900 border-b border-black/5 dark:border-white/5 py-6 px-4 absolute w-full left-0 top-full shadow-2xl transition-colors duration-500">
          <div className="container mx-auto flex flex-col space-y-6 text-lg font-medium text-zinc-700 dark:text-zinc-200">
            <Link href="/about" className="hover:text-red-600 dark:hover:text-red-500 transition-colors" onClick={() => setIsMenuOpen(false)}>Nosotros</Link>
            <Link href="/services" className="hover:text-red-600 dark:hover:text-red-500 transition-colors" onClick={() => setIsMenuOpen(false)}>Servicios</Link>
            <Link href="/portfolio" className="hover:text-red-600 dark:hover:text-red-500 transition-colors" onClick={() => setIsMenuOpen(false)}>Portafolio</Link>
            <Link href="/contact" className="hover:text-red-600 dark:hover:text-red-500 transition-colors" onClick={() => setIsMenuOpen(false)}>Contacto</Link>
          </div>
        </div>
      )}
    </header>
  )
}
