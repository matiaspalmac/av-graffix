import Image from 'next/image'

export default function AboutPage() {
  const team = [
    { name: 'Patricia Valdebenito', role: 'Diseñadora Grafica', image: 'https://i.imgur.com/g1iUY9k.png' }
  ]

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center text-red-600">Sobre Nosotros</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <Image
              src="https://i.imgur.com/g1iUY9k.png"
              alt="AV GRAFFIX Team"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Nuestra Historia</h2>
            <p className="mb-4">
              Desde 2007, AV GRAFFIX ha sido líder en diseño gráfico, producción y publicidad en Temuco, Araucanía. 
              Nuestra pasión por la creatividad y el compromiso con la excelencia nos han permitido crecer y evolucionar, 
              siempre manteniendo nuestro enfoque en las necesidades de nuestros clientes.
            </p>
            <p>
              A lo largo de los años, hemos trabajado con una amplia gama de clientes, desde pequeñas empresas locales 
              hasta grandes corporaciones, ayudándoles a dar vida a sus ideas y fortalecer sus marcas a través de 
              soluciones gráficas innovadoras y de alta calidad.
            </p>
          </div>
        </div>
        
        <div className="bg-gray-100 p-8 rounded-lg shadow-md mb-16">
          <h2 className="text-2xl font-semibold mb-4 text-center">Nuestra Misión</h2>
          <p className="text-center max-w-2xl mx-auto">
            En AV GRAFFIX, nuestra misión es transformar las ideas de nuestros clientes en realidades visuales impactantes. 
            Nos esforzamos por ofrecer soluciones creativas y de alta calidad que ayuden a nuestros clientes a destacar 
            en un mercado competitivo, siempre con un compromiso inquebrantable con la innovación y la excelencia.
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-center">Nuestro Equipo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={200}
                  height={200}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}