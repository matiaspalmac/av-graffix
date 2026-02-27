'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, Sun, Moon } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/about', label: 'Nosotros' },
  { href: '/services', label: 'Servicios' },
  { href: '/portfolio', label: 'Portafolio' },
  { href: '/contact', label: 'Contacto' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [isDark, setIsDark] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true)
    }
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={`relative z-10 transition-all duration-500 ${scrolled
          ? 'bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl shadow-lg shadow-black/[0.03] dark:shadow-black/20 border-b border-black/5 dark:border-white/5'
          : 'bg-white/60 dark:bg-zinc-950/60 backdrop-blur-md border-b border-transparent'
        } text-zinc-900 dark:text-zinc-100`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="relative z-10 group">
          <div className="absolute inset-0 bg-brand-500/10 dark:bg-brand-500/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-500"></div>
          <Image
            src="/avgraffix.png"
            alt="AV GRAFFIX Logo"
            width={180}
            height={64}
            priority
            className={`w-auto relative z-10 dark:filter dark:brightness-110 drop-shadow-sm dark:drop-shadow-md transition-all duration-300 ${scrolled ? 'h-12' : 'h-14'}`}
          />
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex space-x-1 text-sm font-semibold tracking-wide uppercase">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-lg transition-all duration-300 ${isActive
                      ? 'text-brand-600 dark:text-brand-500 bg-brand-50 dark:bg-brand-950/30'
                      : 'text-zinc-600 dark:text-zinc-300 hover:text-brand-600 dark:hover:text-brand-500 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                    }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-brand-600 dark:bg-brand-500 rounded-full" />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800"></div>

          <Link
            href="/erp/login"
            className="px-4 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-semibold tracking-wide uppercase hover:bg-brand-700 transition-all duration-300"
          >
            Iniciar Sesion
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-brand-600 dark:hover:text-brand-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all duration-300"
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div className="md:hidden flex items-center space-x-3">
          <Link
            href="/erp/login"
            className="px-3 py-2 rounded-xl bg-brand-600 text-white text-[11px] font-semibold tracking-wide uppercase"
            aria-label="Ir al login del ERP"
          >
            ERP
          </Link>
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div ref={menuRef} className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-t border-black/5 dark:border-white/5 py-4 px-4 shadow-2xl">
          <div className="container mx-auto flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${isActive
                      ? 'bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-500 font-bold'
                      : 'text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-brand-600 dark:hover:text-brand-500'
                    }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
}
