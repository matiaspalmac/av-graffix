"use client"

import Link from "next/link"
import { AlertTriangle } from "lucide-react"

export default function Error({
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	return (
		<div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center transition-colors duration-500 px-4">
			<div className="text-center max-w-lg">
				<div className="w-20 h-20 bg-brand-600/10 dark:bg-brand-500/10 text-brand-600 dark:text-brand-500 rounded-full flex items-center justify-center mx-auto mb-8">
					<AlertTriangle size={40} />
				</div>
				<h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-zinc-900 dark:text-white">
					Algo salió <span className="text-brand-600">mal</span>
				</h1>
				<p className="text-lg text-zinc-600 dark:text-zinc-400 font-light mb-10">
					Lo sentimos, ocurrió un error inesperado. Intenta nuevamente o vuelve
					al inicio.
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<button
						onClick={reset}
						className="bg-brand-600 text-white px-8 py-4 rounded-full font-bold tracking-wide hover:bg-brand-700 transition-all"
					>
						Intentar de nuevo
					</button>
					<Link
						href="/"
						className="border border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-300 px-8 py-4 rounded-full font-bold tracking-wide hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
					>
						Volver al inicio
					</Link>
				</div>
			</div>
		</div>
	)
}
