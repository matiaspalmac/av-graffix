"use client"

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ChevronDown, ArrowRight, Tags, FileText, Briefcase, Gift, Palette, Layers, Megaphone, ImageIcon, Flag, Printer } from 'lucide-react'
import { useRef } from 'react'

// Animated Counter Component
const AnimatedCounter = ({ from = 0, to, duration = 2, suffix = "" }: { from?: number, to: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(from)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  useEffect(() => {
    if (isInView) {
      const stepTime = Math.abs(Math.floor((duration * 1000) / (to - from)))
      let current = from
      const timer = setInterval(() => {
        current += Math.ceil((to - from) / 40)
        if (current >= to) {
          setCount(to)
          clearInterval(timer)
        } else {
          setCount(current)
        }
      }, stepTime)
      return () => clearInterval(timer)
    }
  }, [isInView, from, to, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const [text, setText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [loopNum, setLoopNum] = useState(0)
  const [typingSpeed, setTypingSpeed] = useState(100)

  const slides = useMemo(() => [
    { image: "/hero1.jpeg" },
    { image: "/hero2.jpeg" },
    { image: "/hero3.jpeg" },
  ], [])

  const phrases = useMemo(() => [
    "Excelencia Gráfica en la Araucanía",
    "Impresión Digital Corporativa",
    "Corte Preciso y Gran Formato"
  ], [])

  const companies = [
    { name: "Aguas Araucanía", image: "/logos/aguasaraucania.jpeg" },
    { name: "DECAR", image: "/logos/decar.jpeg" },
    { name: "Super Cerdo", image: "/logos/supercerdo.png" },
    { name: "Super Pollo", image: "/logos/superpollo.png" },
    { name: "La Crianza", image: "/logos/lacrianza.png" }
  ];

  const products = [
    { name: "Etiquetas Adhesivas", icon: <Tags className="w-8 h-8 text-zinc-700 dark:text-zinc-300 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors" />, desc: "Adhesivos de alta durabilidad y precisión." },
    { name: "Folletería", icon: <FileText className="w-8 h-8 text-zinc-700 dark:text-zinc-300 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors" />, desc: "Dípticos, trípticos y flyers promocionales." },
    { name: "Papelería Corporativa", icon: <Briefcase className="w-8 h-8 text-zinc-700 dark:text-zinc-300 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors" />, desc: "Tarjetas, carpetas y hojas membretadas." },
    { name: "Productos Promocionales", icon: <Gift className="w-8 h-8 text-zinc-700 dark:text-zinc-300 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors" />, desc: "Merchandising personalizado para tu marca." },
    { name: "Branding", icon: <Palette className="w-8 h-8 text-zinc-700 dark:text-zinc-300 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors" />, desc: "Diseño de identidad visual y manual de marca." },
    { name: "Soportes Gráficos", icon: <Layers className="w-8 h-8 text-zinc-700 dark:text-zinc-300 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors" />, desc: "Pendones, rollers y gráficas para stands." }
  ];

  // Background slider hook
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  // Typewriter hook
  useEffect(() => {
    const handleType = () => {
      const i = loopNum % phrases.length
      const fullText = phrases[i]

      setText(isDeleting
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1)
      )

      setTypingSpeed(isDeleting ? 40 : 80)

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2500)
      } else if (isDeleting && text === '') {
        setIsDeleting(false)
        setLoopNum(loopNum + 1)
      }
    }

    const timer = setTimeout(handleType, typingSpeed)
    return () => clearTimeout(timer)
  }, [text, isDeleting, loopNum, typingSpeed, phrases])

  // Simple Framer motion variants for better performance
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 selection:bg-red-500/30 selection:text-zinc-900 dark:selection:text-white font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-zinc-950">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <Image
              src={slides[currentSlide].image}
              alt="AV Graffix Background"
              fill
              style={{ objectFit: "cover" }}
              quality={75}
              priority
              className="opacity-60"
            />
            {/* Elegant dark gradient overlay so white text is always visible and images pop */}
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/30 via-zinc-950/50 to-zinc-950/90" />
            <div className="absolute inset-0 bg-black/20" /> {/* Extra contrast layer */}
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center mt-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-4 text-white"
          >
            AV <span className="text-red-500">GRAFFIX</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="h-16 md:h-20 flex items-center justify-center mb-10"
          >
            <p className="text-2xl md:text-4xl lg:text-5xl font-light text-zinc-200">
              {text}<span className="animate-pulse font-light text-red-500 ml-1">|</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/contact" className="group relative inline-flex items-center gap-2 px-10 py-5 bg-red-600 text-white rounded-full text-lg font-bold tracking-wide overflow-hidden transition-all hover:bg-red-700">
              <span className="relative z-10">Inicia tu Proyecto</span>
              <ArrowRight size={22} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold">Descubre más</span>
          <ChevronDown size={28} className="text-zinc-400 animate-bounce" />
        </motion.div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-12 bg-red-600 border-y border-red-700 relative z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
            <div className="py-4 md:py-0">
              <div className="text-4xl md:text-5xl font-black text-white mb-2"><AnimatedCounter to={19} suffix="+" /></div>
              <div className="text-red-100 font-medium tracking-wide">Años de Excelencia Visual</div>
            </div>
            <div className="py-4 md:py-0">
              <div className="text-4xl md:text-5xl font-black text-white mb-2"><AnimatedCounter to={1200} suffix="+" /></div>
              <div className="text-red-100 font-medium tracking-wide">Proyectos Entregados</div>
            </div>
            <div className="py-4 md:py-0">
              <div className="text-4xl md:text-5xl font-black text-white mb-2"><AnimatedCounter to={98} suffix="%" /></div>
              <div className="text-red-100 font-medium tracking-wide">Satisfacción Garantizada</div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-32 relative bg-zinc-50 dark:bg-zinc-950">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 text-zinc-900 dark:text-zinc-100">Nuestra <span className="font-light italic text-red-600 dark:text-red-500">Especialidad</span></h2>
            <div className="h-1 w-24 bg-red-600 dark:bg-red-500 mx-auto rounded-full"></div>
            <p className="mt-8 text-xl font-light text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Descubre un abanico completo de soluciones en diseño e impresión de la más alta calidad y precisión.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4 }}
                variants={fadeUpVariant}
                className="group relative bg-white dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 p-10 rounded-3xl hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors duration-300"
              >
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-20 h-20 rounded-2xl bg-white dark:bg-zinc-950/80 border border-black/5 dark:border-white/10 flex items-center justify-center mb-8 overflow-hidden transition-transform duration-300 group-hover:scale-110 shadow-sm group-hover:border-red-500/30">
                    {product.icon}
                  </div>

                  <h3 className="text-2xl font-bold mb-4 tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{product.name}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-6 flex-grow text-lg leading-relaxed font-light">{product.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <Link href="/services" className="inline-flex items-center gap-3 bg-red-600 text-white px-10 py-5 rounded-full text-lg font-bold tracking-wide hover:bg-red-700 hover:scale-105 transition-all shadow-lg hover:shadow-red-500/25">
              Ver Todos los Servicios <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-32 bg-white dark:bg-zinc-900/20 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 md:gap-0">
            <div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-zinc-900 dark:text-white">Marcas <span className="text-red-600 dark:text-red-500">Aliadas</span></h2>
              <p className="text-zinc-600 dark:text-zinc-500 text-xl font-light">Empresas que confían en nuestra extrema precisión y calidad.</p>
            </div>
            <div className="h-px flex-grow mx-12 bg-black/5 dark:bg-white/5 hidden md:block mb-6"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-10">
            {companies.map((company, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4 }}
                variants={fadeUpVariant}
                className="group flex flex-col items-center justify-center p-10 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-transparent hover:border-black/10 dark:hover:border-white/10 hover:bg-white dark:hover:bg-zinc-800 transition-colors duration-300 cursor-pointer"
              >
                <div className="relative w-28 h-28 mb-8">
                  <Image
                    src={company.image}
                    alt={company.name}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-xs font-bold tracking-[0.2em] text-zinc-500 dark:text-zinc-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors uppercase text-center">{company.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}