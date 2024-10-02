"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    { image: "https://i.imgur.com/AzGFOLC.jpeg", title: "Diseño Gráfico Integral" },
    { image: "https://i.imgur.com/MB14mFE.jpeg", title: "Impresión de Alta Calidad" },
    { image: "https://i.imgur.com/GWaSeBh.jpeg", title: "Publicidad Impactante" },
  ]

  const companies = [
    { name: "Aguas Araucanía", image: "https://i.imgur.com/Xt5wLsB.jpeg" },
    { name: "Automoviles DECAR", image: "https://i.imgur.com/ivqY3Ot.png" }
  ];

  const products = [
    { name: "Etiquetas Adhesivas", image: "https://i.imgur.com/g1iUY9k.png" },
    { name: "Folletería", image: "https://i.imgur.com/g1iUY9k.png" },
    { name: "Papelería Corporativa", image: "https://i.imgur.com/g1iUY9k.png" },
    { name: "Productos Promocionales", image: "https://i.imgur.com/g1iUY9k.png" },
    { name: "Branding", image: "https://i.imgur.com/g1iUY9k.png" },
    { name: "Soportes Gráficos", image: "https://i.imgur.com/g1iUY9k.png" }
];


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <div className="min-h-screen bg-white text-black">      
      {/* Hero Section */}
      <section className="relative h-screen">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Image
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            fill
            style={{ objectFit: "cover" }}
            quality={100}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </motion.div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">AV GRAFFIX</h1>
          <p className="text-xl md:text-2xl mb-8 text-center">Diseño Gráfico Integral • Impresión • Publicidad</p>
          <Link href="/contact">
            <span className="bg-red-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-red-700 transition-colors">
              Contáctanos
            </span>
          </Link>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <ChevronDown size={32} className="text-white animate-bounce" />
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Nuestros Productos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-4">{product.name}</h3>
                <Link href={`/products/${product.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <span className="text-red-600 hover:text-red-700 transition-colors">
                    Ver más
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
        
        {/* Companies Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Empresas que confían en nosotros</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {companies.map((company, index) => (
                <div key={index} className="text-center">
                  <Image
                    src={company.image}
                    alt={company.name}
                    width={200}
                    height={200}
                    className="rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">{company.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
    </div>
  )
}