import { Palette, Printer, Megaphone, FileText, Image as ImageIcon, Flag } from 'lucide-react'

const services = [
  { icon: Palette, title: "Diseño Gráfico", description: "Creamos imágenes corporativas distintivas y aplicamos normas gráficas en diversos soportes." },
  { icon: Printer, title: "Impresión", description: "Ofrecemos servicios de impresión de alta calidad para todo tipo de materiales promocionales." },
  { icon: Megaphone, title: "Publicidad", description: "Desarrollamos estrategias publicitarias efectivas y producimos materiales impactantes." },
  { icon: FileText, title: "Papelería Corporativa", description: "Diseñamos y producimos tarjetas de presentación, sobres, hojas membretadas y más." },
  { icon: ImageIcon, title: "Folletería", description: "Creamos folletos, catálogos, y otros materiales impresos para promocionar tu negocio." },
  { icon: Flag, title: "Productos Promocionales", description: "Diseñamos y fabricamos una amplia gama de productos promocionales personalizados." },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-12 text-center text-red-600">Nuestros Servicios</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <service.icon className="w-12 h-12 text-red-600 mb-4" />
              <h2 className="text-xl font-semibold mb-2">{service.title}</h2>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-100 p-8 rounded-lg shadow-md mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">Nuestro Proceso</h2>
          <div className="flex flex-col md:flex-row justify-between items-center">
            {['Consulta', 'Diseño', 'Revisión', 'Producción', 'Entrega'].map((step, index) => (
              <div key={index} className="flex flex-col items-center mb-4 md:mb-0">
                <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-2">
                  {index + 1}
                </div>
                <span className="text-center">{step}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6">¿Listo para comenzar tu proyecto?</h2>
          <a href="/contact" className="bg-red-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-red-700 transition-colors inline-block">
            Contáctanos Ahora
          </a>
        </div>
      </main>
    </div>
  )
}