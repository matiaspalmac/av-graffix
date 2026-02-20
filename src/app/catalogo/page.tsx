import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const productCategories = [
    {
        name: "Branding",
        subcategories: [
            "Diseño de imágenes corporativas (logotipos)",
            "Aplicación de norma gráfica"
        ]
    },
    {
        name: "Papelería Corporativa",
        subcategories: [
            "Tarjetas de presentación",
            "Sobres",
            "Hojas",
            "Tarjetones de invitación"
        ]
    },
    {
        name: "Folletería Promocional",
        subcategories: [
            "Dípticos",
            "Trípticos",
            "Folletos",
            "Volantes"
        ]
    },
    {
        name: "Productos Promocionales",
        subcategories: [
            "Pendones Roller",
            "Lienzos",
            "Banderas",
            "Toldos",
            "Chapitas",
            "Adhesivos"
        ]
    },
    {
        name: "Soportes Gráficos",
        subcategories: [
            "Telones",
            "Window Vision",
            "Señaléticas",
            "Paneles",
            "Panaflex",
            "Letreros metálicos",
            "Acrílicos",
            "Maderas",
            "Trovisel",
            "Vidrios"
        ]
    }
]

export default function CatalogoPage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-500 font-sans">
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">

                <div className="text-center mb-24 relative">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-4 text-zinc-900 dark:text-white relative z-10">Catálogo de <span className="text-red-600 dark:text-red-500">Productos</span></h1>
                    <div className="h-1 w-20 bg-red-600 dark:bg-red-500 mx-auto rounded-full shadow-sm dark:shadow-[0_0_10px_rgba(239,68,68,0.4)]"></div>
                    <p className="mt-8 text-xl font-light text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                        Explora nuestro abanico completo de soluciones en impresión y soportes. Desde papelería hasta gigantografías, todo con extrema precisión y calidad premium.
                    </p>
                </div>

                <div className="space-y-16">
                    {productCategories.map((category, index) => (
                        <div key={index} className="bg-white dark:bg-zinc-900/40 p-10 md:p-14 rounded-3xl border border-black/5 dark:border-white/5 shadow-xl dark:shadow-none hover:border-red-500/20 transition-all duration-500">
                            <h2 className="text-3xl font-bold mb-8 text-zinc-900 dark:text-white capitalize border-b border-zinc-200 dark:border-zinc-800 pb-4">{category.name}</h2>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.subcategories.map((item, idx) => (
                                    <li key={idx} className="flex items-center group">
                                        <span className="w-2 h-2 rounded-full bg-red-600 mr-4 group-hover:scale-150 transition-transform"></span>
                                        <span className="text-lg text-zinc-700 dark:text-zinc-300 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors cursor-pointer">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-24 text-center">
                    <h2 className="text-3xl font-bold tracking-tight mb-8 text-zinc-900 dark:text-white">¿No encuentras lo que buscas?</h2>
                    <Link href="/contact" className="inline-flex items-center gap-3 bg-red-600 text-white px-10 py-5 rounded-full text-lg font-bold tracking-wide hover:bg-red-700 hover:scale-105 transition-all shadow-lg hover:shadow-red-500/25">
                        Solicita una Cotización Especial <ArrowRight size={20} />
                    </Link>
                </div>
            </main>
        </div>
    )
}
