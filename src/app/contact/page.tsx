import { Mail, Phone, MapPin } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-12 text-center text-red-600">Contáctanos</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Envíanos un mensaje</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-1 font-medium">Nombre</label>
                <input type="text" id="name" name="name" className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 font-medium">Email</label>
                <input type="email" id="email" name="email" className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label htmlFor="message" className="block mb-1 font-medium">Mensaje</label>
                <textarea id="message" name="message" rows={5} className="w-full p-2 border rounded" required></textarea>
              </div>
              <button type="submit" className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors">
                Enviar Mensaje
              </button>
            </form>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-6">Información de Contacto</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="w-6 h-6 text-red-600 mr-2" />
                <span>avgraffix@gmail.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-6 h-6 text-red-600 mr-2" />
                <span>(45) 238 0877</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-6 h-6 text-red-600 mr-2" />
                <span>Temuco, Araucanía</span>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Horario de Atención</h3>
              <p>Lunes a Viernes: 9:00 AM - 6:00 PM</p>
              <p>Sábado: 10:00 AM - 2:00 PM</p>
              <p>Domingo: Cerrado</p>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Síguenos en Redes Sociales</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-red-600 hover:text-red-700">Facebook</a>
                <a href="#" className="text-red-600 hover:text-red-700">Instagram</a>
                <a href="#" className="text-red-600 hover:text-red-700">Twitter</a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}