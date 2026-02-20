import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-500 font-sans">
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 max-w-4xl">
                <div className="text-center mb-16 relative">
                    <div className="w-20 h-20 bg-red-600/10 dark:bg-red-500/10 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck size={40} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-zinc-900 dark:text-white">Política de <span className="text-red-600 dark:text-red-500">Privacidad</span></h1>
                    <div className="h-1 w-20 bg-red-600 dark:bg-red-500 mx-auto rounded-full shadow-sm"></div>
                </div>

                <div className="bg-white dark:bg-zinc-900/40 p-8 md:p-12 rounded-3xl border border-black/5 dark:border-white/5 shadow-xl dark:shadow-none space-y-10">

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white border-b border-black/5 dark:border-white/10 pb-4">Navegación 100% Plana y Anónima</h2>
                        <p className="text-zinc-600 dark:text-zinc-400 font-light leading-relaxed text-lg">
                            En AV GRAFFIX valoramos profundamente la privacidad digital. <strong>No usamos cookies de seguimiento</strong>, ni píxeles invasivos, y mucho menos almacenamos direcciones IPs de nuestros visitantes. Tampoco requerimos ninguna clase de registro para pre-visualizar nuestro catálogo ni nuestro portafolio de trabajos.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white border-b border-black/5 dark:border-white/10 pb-4">Uso de Analytics Básicos</h2>
                        <p className="text-zinc-600 dark:text-zinc-400 font-light leading-relaxed text-lg">
                            Solemos recolectar <strong>exclusivamente datos anónimos de uso general</strong> (tales como "visitas a la página de Servicios" o "clics en el menú"), llevados a cabo mediante herramientas básicas como Vercel Analytics. Este procesamiento <strong>no incluye identificación personal</strong> o información de tracking que cruce bases de datos externas.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white border-b border-black/5 dark:border-white/10 pb-4">Cambios en esta Política</h2>
                        <p className="text-zinc-600 dark:text-zinc-400 font-light leading-relaxed text-lg">
                            Podemos actualizar esta página ocasionalmente para adaptarnos a las normativas de la nube o legislaciones vigentes. Te recomendamos revisarla de vez en cuando. El uso continuado del sitio web implica la absoluta aceptación de estos cambios transparentes.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-black/5 dark:border-white/10">
                        <Link href="/" className="inline-flex items-center text-red-600 dark:text-red-500 font-bold hover:underline">
                            &larr; Volver al inicio
                        </Link>
                    </div>

                </div>
            </main>
        </div>
    )
}
