import Link from "next/link"

export default function NotFound() {
	return (
		<div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center transition-colors duration-500 px-4">
			<div className="text-center max-w-lg">
				<h1 className="text-8xl md:text-9xl font-black tracking-tighter text-brand-600 dark:text-brand-500 mb-4">
					404
				</h1>
				<h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-white">
					Página no encontrada
				</h2>
				<p className="text-lg text-zinc-600 dark:text-zinc-400 font-light mb-10">
					La página que buscas no existe o fue movida. Vuelve al inicio para
					seguir explorando nuestros servicios.
				</p>
				<Link
					href="/"
					className="inline-flex items-center gap-2 bg-brand-600 text-white px-10 py-5 rounded-full text-lg font-bold tracking-wide hover:bg-brand-700 transition-all shadow-lg hover:shadow-brand-500/25"
				>
					&larr; Volver al inicio
				</Link>
			</div>
		</div>
	)
}
