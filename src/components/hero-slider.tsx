"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  { image: "/trabajos/aguasaraucania_1.jpeg" },
  { image: "/trabajos/aguasaraucania_2.jpeg" },
  { image: "/trabajos/cifuentes_1.jpeg" },
  { image: "/trabajos/cifuentes_2.jpeg" },
  { image: "/trabajos/bidfood_1.jpg" },
  { image: "/trabajos/bidfood_2.jpg" },
  { image: "/trabajos/sofo_1.jpg" },
  { image: "/trabajos/sofo_2.jpg" },
  { image: "/trabajos/sofo_3.jpg" },
  { image: "/trabajos/prt_1.jpg" },
  { image: "/trabajos/prt_2.jpg" },
  { image: "/trabajos/prt_3.jpeg" },
  { image: "/trabajos/farellones_1.jpeg" },
  { image: "/trabajos/b2autos_1.jpeg" },
  { image: "/trabajos/b2autos_2.jpeg" },
  { image: "/trabajos/minimarketisabella_1.jpeg" },
  { image: "/trabajos/minimarketisabella_2.jpeg" },
  { image: "/trabajos/minimarketisabella_3.jpeg" }
];

const phrases = [
  "Proyectando tus ideas",
  "Impresión Digital Corporativa",
  "Corte Preciso y Gran Formato",
  "Diseño y Publicidad"
]

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [text, setText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [loopNum, setLoopNum] = useState(0)
  const [typingSpeed, setTypingSpeed] = useState(100)

  // Para evitar hydration mismatch, inicia el auto-slide solo después de montar
  useEffect(() => {
    let mounted = true;
    let timer: NodeJS.Timeout | null = null;
    if (mounted) {
      timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      }, 5000)
    }
    return () => {
      mounted = false;
      if (timer) clearInterval(timer)
    }
  }, [])

  // Typewriter
  useEffect(() => {
    const handleType = () => {
      const i = loopNum % phrases.length
      const fullText = phrases[i]

      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1)
      )

      setTypingSpeed(isDeleting ? 40 : 80)

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2500)
      } else if (isDeleting && text === "") {
        setIsDeleting(false)
        setLoopNum(loopNum + 1)
      }
    }

    const timer = setTimeout(handleType, typingSpeed)
    return () => clearTimeout(timer)
  }, [text, isDeleting, loopNum, typingSpeed])

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-zinc-950">
      {/* Floating particles */}
      <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-brand-500/20 animate-float" />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-white/10 animate-float-delayed" />
        <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 rounded-full bg-brand-400/15 animate-float-slow" />
        <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-white/5 animate-float" />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 rounded-full bg-brand-500/10 animate-float-delayed" />
        <div className="absolute top-2/3 right-1/2 w-2.5 h-2.5 rounded-full bg-white/5 animate-float-slow" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slides[currentSlide].image}
            alt="AV Graffix Background"
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            quality={75}
            priority={currentSlide === 0}
            className="opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/30 via-zinc-950/50 to-zinc-950/90" />
          <div className="absolute inset-0 bg-black/20" />
          {/* Flechas de navegación dentro del contenedor animado */}
          <button
            aria-label="Anterior"
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 transition-colors duration-200 focus:outline-none"
            style={{ backdropFilter: 'blur(2px)' }}
          >
            <ChevronLeft size={32} />
          </button>
          <button
            aria-label="Siguiente"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 transition-colors duration-200 focus:outline-none"
            style={{ backdropFilter: 'blur(2px)' }}
          >
            <ChevronRight size={32} />
          </button>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center mt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-4 text-white">
            AV{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-brand-400 to-brand-600 animate-shimmer">
              GRAFFIX
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="h-16 md:h-20 flex items-center justify-center mb-10"
        >
          <p className="text-2xl md:text-4xl lg:text-5xl font-light text-zinc-200">
            {text}
            <span className="animate-pulse font-light text-brand-500 ml-1">
              |
            </span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            href="/contact"
            className="group relative inline-flex items-center gap-2 px-10 py-5 bg-brand-600 text-white rounded-full text-lg font-bold tracking-wide overflow-hidden transition-all hover:bg-brand-700 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:scale-105"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative z-10">Inicia tu Proyecto</span>
            <ArrowRight
              size={22}
              className="relative z-10 group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3"
      >
        {/* Slide indicators */}
        <div className="flex gap-2 mb-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlide
                  ? "w-8 bg-brand-500"
                  : "w-3 bg-white/30 hover:bg-white/50"
                }`}
            />
          ))}
        </div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold">
          Descubre más
        </span>
        <ChevronDown size={28} className="text-zinc-400 animate-bounce" />
      </motion.div>
    </section>
  )
}
