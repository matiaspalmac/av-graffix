import Image from 'next/image'
import { User } from 'lucide-react'

export default function AboutPage() {
  const team = [
    { name: 'Patricia Analia Valdebenito Valdebenito', role: 'Gestión', image: 'silhouette', linkedin: 'https://www.linkedin.com/in/patricia-analia-valdebenito-valdebenito-1731661a/' }
  ]

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-500 font-sans selection:bg-red-500/30 selection:text-zinc-900 dark:selection:text-white">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">

        {/* Header Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter mb-6 text-zinc-900 dark:text-white">
            Nuestra <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">Historia</span>
          </h1>
          <div className="h-1 w-24 bg-red-600 mx-auto rounded-full"></div>
        </div>

        {/* History Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32">
          <div className="order-2 lg:order-1 relative p-2 bg-white dark:bg-zinc-900 rounded-3xl border border-black/5 dark:border-white/5 shadow-sm">
            <div className="relative rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center p-12 h-full min-h-[400px]">
              <img
                src="/logo.png?v=2026"
                alt="Agencia AV GRAFFIX"
                className="w-full h-full object-contain filter dark:brightness-110 p-4 transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">Evolución e Innovación</h2>
            <div className="space-y-6 text-lg lg:text-xl font-light leading-relaxed text-zinc-600 dark:text-zinc-400">
              <p>
                Desde su fundación en nov. 2006, AV GRAFFIX se ha posicionado como líder indiscutido en diseño gráfico, producción y publicidad en la vibrante región de la Araucanía. Nuestra filosofía radica en entender que cada marca tiene su propio universo.
              </p>
              <p>
                A lo largo de los años, hemos acompañado el crecimiento de emprendimientos locales y grandes corporaciones, entregando soluciones de diseño atemporales, funcionales de <strong>extrema calidad y precisión</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Banner */}
        <div className="relative bg-white dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 p-12 md:p-16 rounded-3xl shadow-lg dark:shadow-none mb-24 overflow-hidden">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-8 text-center">Nuestra Misión</h2>
          <p className="text-2xl lg:text-4xl font-light leading-tight mb-8 text-center">
            "Transformar visión en materia. Ofrecemos soluciones creativas excepcionales que permiten a nuestros clientes destacar y dominar en un mercado competitivo."
          </p>
          <div className="h-0.5 w-16 bg-red-600 mx-auto"></div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">Mentes Creativas</h2>
            <p className="text-zinc-600 dark:text-zinc-400 font-light text-lg">El talento detrás de la excelencia.</p>
          </div>

          <div className="flex justify-center">
            {team.map((member, index) => (
              <div key={index} className="group text-center w-full max-w-sm bg-white dark:bg-zinc-900 p-12 rounded-3xl border border-black/5 dark:border-white/5 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="w-48 h-48 mx-auto rounded-full bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center mb-8 overflow-hidden border-8 border-zinc-100 dark:border-zinc-800 transition-transform duration-500 group-hover:scale-105 text-zinc-300 dark:text-zinc-700">
                  {member.image === 'silhouette' ? (
                    <User fill="currentColor" className="w-40 h-40 mt-10 opacity-60" />
                  ) : (
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white group-hover:text-red-500 transition-colors">
                  {member.linkedin ? (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">{member.name}</a>
                  ) : (
                    member.name
                  )}
                </h3>
                <p className="text-zinc-500 font-medium tracking-widest uppercase text-xs">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}