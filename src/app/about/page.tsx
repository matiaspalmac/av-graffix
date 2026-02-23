import Image from 'next/image'
import { User, Eye, Heart, Zap, Gem, Calendar, Users, Trophy } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'Conoce la historia de AV GRAFFIX, agencia líder en diseño gráfico y producción en la Araucanía desde 2006. Nuestra misión y equipo creativo.',
  openGraph: {
    title: 'Nosotros | AV GRAFFIX',
    description: 'Desde 2006 liderando el diseño gráfico y la producción en la Araucanía.',
  },
}

const timeline = [
  { year: '2006', title: 'Fundación', desc: 'AV GRAFFIX nace en Temuco con la visión de entregar diseño gráfico de excelencia en la Araucanía.' },
  { year: '2010', title: 'Expansión Digital', desc: 'Incorporamos impresión digital de última generación y gran formato a nuestros servicios.' },
  { year: '2015', title: 'Consolidación', desc: 'Nos posicionamos como referentes regionales, trabajando con marcas líderes del sur de Chile.' },
  { year: '2020', title: 'Innovación Constante', desc: 'Adoptamos nuevas tecnologías de corte y acabados premium para superar las expectativas del mercado.' },
  { year: '2025', title: '+19 Años', desc: 'Seguimos evolucionando con más de 1.200 proyectos entregados y un compromiso inquebrantable con la calidad.' },
]

const values = [
  { icon: <Eye className="w-6 h-6" />, title: 'Visión', desc: 'Anticipamos tendencias y creamos diseños que trascienden el tiempo.' },
  { icon: <Heart className="w-6 h-6" />, title: 'Pasión', desc: 'Cada proyecto recibe dedicación total, desde el concepto hasta la entrega.' },
  { icon: <Zap className="w-6 h-6" />, title: 'Precisión', desc: 'Estándares industriales de calidad en cada corte, impresión y acabado.' },
  { icon: <Gem className="w-6 h-6" />, title: 'Excelencia', desc: 'Nos conformamos solo con lo extraordinario. Sin excepciones.' },
]

export default function AboutPage() {
  const team = [
    { name: 'Patricia Analia Valdebenito Valdebenito', role: 'Gestión', image: 'silhouette', linkedin: 'https://www.linkedin.com/in/patricia-analia-valdebenito-valdebenito-1731661a/' }
  ]

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-500 font-sans selection:bg-brand-500/30 selection:text-zinc-900 dark:selection:text-white">

      {/* Hero Header */}
      <section className="relative py-32 overflow-hidden bg-zinc-900 dark:bg-zinc-950">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 via-transparent to-brand-600/5" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-600/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <p className="text-brand-500 text-sm font-bold tracking-[0.3em] uppercase mb-4">Sobre Nosotros</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 text-white">
              Nuestra{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-400">
                Historia
              </span>
            </h1>
            <p className="text-xl md:text-2xl font-light text-zinc-400 leading-relaxed max-w-2xl">
              Desde 2006 transformando visiones en piezas gráficas memorables en la región de la Araucanía.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="relative z-20 -mt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl dark:shadow-none border border-black/5 dark:border-white/5 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-zinc-100 dark:divide-zinc-800">
            {[
              { icon: <Calendar className="w-5 h-5" />, value: '2006', label: 'Fundación' },
              { icon: <Trophy className="w-5 h-5" />, value: '1.200+', label: 'Proyectos' },
              { icon: <Users className="w-5 h-5" />, value: '98%', label: 'Satisfacción' },
              { icon: <Gem className="w-5 h-5" />, value: '19+', label: 'Años' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center py-8 px-4">
                <div className="text-brand-600 dark:text-brand-500 mb-2">{s.icon}</div>
                <div className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white">{s.value}</div>
                <div className="text-sm text-zinc-500 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* History + Image */}
        <section className="py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="order-2 lg:order-1 relative group">
              <div className="absolute -inset-4 bg-gradient-to-br from-brand-600/20 to-transparent rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative p-2 bg-white dark:bg-zinc-900 rounded-3xl border border-black/5 dark:border-white/5 shadow-sm">
                <div className="relative rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center p-12 h-full min-h-[400px]">
                  <Image
                    src="/logo.png"
                    alt="Agencia AV GRAFFIX"
                    width={400}
                    height={400}
                    className="w-full h-full object-contain filter dark:brightness-110 p-4 transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <div className="inline-flex items-center gap-2 bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-500 px-4 py-2 rounded-full text-sm font-bold">
                <Gem className="w-4 h-4" /> Evolución e Innovación
              </div>
              <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-white">
                Líderes en Diseño Gráfico desde 2006
              </h2>
              <div className="space-y-6 text-lg lg:text-xl font-light leading-relaxed text-zinc-600 dark:text-zinc-400">
                <p>
                  Desde su fundación en noviembre de 2006, AV GRAFFIX se ha posicionado como líder indiscutido en diseño gráfico, producción y publicidad en la vibrante región de la Araucanía. Nuestra filosofía radica en entender que cada marca tiene su propio universo.
                </p>
                <p>
                  A lo largo de los años, hemos acompañado el crecimiento de emprendimientos locales y grandes corporaciones, entregando soluciones de diseño atemporales, funcionales de <strong className="text-zinc-900 dark:text-white">extrema calidad y precisión</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="pb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-zinc-900 dark:text-white">
              Nuestro <span className="text-brand-600 dark:text-brand-500">Recorrido</span>
            </h2>
            <div className="h-1 w-24 bg-brand-600 dark:bg-brand-500 mx-auto rounded-full" />
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-600/30 to-transparent md:-translate-x-px" />

            {timeline.map((item, i) => (
              <div key={i} className={`relative flex items-start mb-12 last:mb-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-brand-600 rounded-full border-4 border-zinc-50 dark:border-zinc-950 -translate-x-1.5 md:-translate-x-1.5 mt-2 z-10 shadow-lg shadow-brand-600/20" />

                {/* Content */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <div className="bg-white dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group">
                    <span className="text-brand-600 dark:text-brand-500 font-black text-sm tracking-widest">{item.year}</span>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-1 mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{item.title}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="pb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-zinc-900 dark:text-white">
              Nuestros <span className="font-light italic text-brand-600 dark:text-brand-500">Valores</span>
            </h2>
            <div className="h-1 w-24 bg-brand-600 dark:bg-brand-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div
                key={i}
                className="group bg-white dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 p-8 rounded-3xl hover:shadow-xl transition-all duration-500 text-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-500 mb-5 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                    {v.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-zinc-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{v.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 font-light text-sm leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mission Banner */}
        <section className="pb-32">
          <div className="relative bg-zinc-900 dark:bg-zinc-900 p-12 md:p-20 rounded-[2.5rem] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 via-transparent to-brand-600/5" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-8">Nuestra Misión</h2>
              <p className="text-2xl lg:text-4xl font-light leading-tight text-zinc-300 mb-8">
                &ldquo;Transformar visión en materia. Ofrecemos soluciones creativas excepcionales que permiten a nuestros clientes destacar y dominar en un mercado competitivo.&rdquo;
              </p>
              <div className="h-0.5 w-16 bg-brand-600 mx-auto" />
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="pb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-zinc-900 dark:text-white">
              Mentes <span className="text-brand-600 dark:text-brand-500">Creativas</span>
            </h2>
            <div className="h-1 w-24 bg-brand-600 dark:bg-brand-500 mx-auto rounded-full mb-6" />
            <p className="text-zinc-600 dark:text-zinc-400 font-light text-lg">El talento detrás de la excelencia.</p>
          </div>

          <div className="flex justify-center">
            {team.map((member, index) => (
              <div key={index} className="group text-center w-full max-w-sm bg-white dark:bg-zinc-900/40 p-12 rounded-3xl border border-black/5 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-40 h-40 mx-auto rounded-full bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center mb-8 overflow-hidden border-4 border-zinc-100 dark:border-zinc-800 transition-all duration-500 group-hover:scale-105 group-hover:border-brand-500/30 text-zinc-300 dark:text-zinc-700">
                    {member.image === 'silhouette' ? (
                      <User fill="currentColor" className="w-32 h-32 mt-8 opacity-60" />
                    ) : (
                      <Image src={member.image} alt={member.name} width={160} height={160} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-zinc-900 dark:text-white group-hover:text-brand-500 transition-colors">
                    {member.linkedin ? (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">{member.name}</a>
                    ) : (
                      member.name
                    )}
                  </h3>
                  <p className="text-zinc-500 font-medium tracking-widest uppercase text-xs">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
