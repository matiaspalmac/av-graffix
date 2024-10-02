import Image from 'next/image'

const portfolioItems = [
  { image: "/placeholder.svg?height=300&width=400", company: "Empresa A", description: "Pendón Roller" },
  { image: "/placeholder.svg?height=300&width=400", company: "Empresa B", description: "Diseño de Logotipo" },
  { image: "/placeholder.svg?height=300&width=400", company: "Empresa C", description: "Folleto Promocional" },
  { image: "/placeholder.svg?height=300&width=400", company: "Empresa D", description: "Tarjetas de Presentación" },
  { image: "/placeholder.svg?height=300&width=400", company: "Empresa E", description: "Etiquetas Adhesivas" },
  { image: "/placeholder.svg?height=300&width=400", company: "Empresa F", description: "Diseño de Empaque" },
]

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-12 text-center text-red-600">Nuestro Portafolio</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <Image
                src={item.image}
                alt={`Trabajo para ${item.company}`}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{item.company}</h2>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">¿Listo para crear tu próximo proyecto?</h2>
          <a href="/contact" className="bg-red-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-red-700 transition-colors inline-block">
            Contáctanos Ahora
          </a>
        </div>
      </main>
    </div>
  )
}