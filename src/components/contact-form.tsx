"use client"

import { useState, useCallback } from "react"
import { siteConfig } from "@/lib/data"
import { CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react"

interface FormErrors {
	name?: string
	email?: string
	message?: string
}

interface FormTouched {
	name: boolean
	email: boolean
	message: boolean
}

const MAX_MESSAGE_LENGTH = 1000
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ContactForm() {
	const [formData, setFormData] = useState({ name: "", email: "", message: "" })
	const [errors, setErrors] = useState<FormErrors>({})
	const [touched, setTouched] = useState<FormTouched>({ name: false, email: false, message: false })
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)

	const validateField = useCallback((field: string, value: string): string | undefined => {
		switch (field) {
			case "name":
				if (!value.trim()) return "El nombre es obligatorio"
				if (value.trim().length < 2) return "Mínimo 2 caracteres"
				return undefined
			case "email":
				if (!value.trim()) return "El email es obligatorio"
				if (!EMAIL_REGEX.test(value)) return "Ingresa un email válido"
				return undefined
			case "message":
				if (!value.trim()) return "El mensaje es obligatorio"
				if (value.trim().length < 10) return "Mínimo 10 caracteres"
				if (value.length > MAX_MESSAGE_LENGTH) return `Máximo ${MAX_MESSAGE_LENGTH} caracteres`
				return undefined
			default:
				return undefined
		}
	}, [])

	const handleChange = (field: string, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }))
		if (touched[field as keyof FormTouched]) {
			setErrors(prev => ({ ...prev, [field]: validateField(field, value) }))
		}
	}

	const handleBlur = (field: string) => {
		setTouched(prev => ({ ...prev, [field]: true }))
		setErrors(prev => ({ ...prev, [field]: validateField(field, formData[field as keyof typeof formData]) }))
	}

	const isFieldValid = (field: string) => {
		return touched[field as keyof FormTouched] && !errors[field as keyof FormErrors] && formData[field as keyof typeof formData].trim().length > 0
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const newErrors: FormErrors = {
			name: validateField("name", formData.name),
			email: validateField("email", formData.email),
			message: validateField("message", formData.message),
		}
		setErrors(newErrors)
		setTouched({ name: true, email: true, message: true })

		if (newErrors.name || newErrors.email || newErrors.message) return

		setIsSubmitting(true)
		await new Promise(resolve => setTimeout(resolve, 600))

		const text = `Hola AV GRAFFIX, mi nombre es ${formData.name} (${formData.email}).%0A%0ATengo el siguiente proyecto en mente:%0A${formData.message}`

		window.open(`https://wa.me/${siteConfig.whatsapp}?text=${text}`, "_blank")

		setIsSubmitting(false)
		setIsSuccess(true)

		setTimeout(() => {
			setIsSuccess(false)
			setFormData({ name: "", email: "", message: "" })
			setTouched({ name: false, email: false, message: false })
			setErrors({})
		}, 4000)
	}

	const inputClasses = (field: string) => {
		const base = "w-full px-4 py-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl outline-none transition-all duration-300 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600"
		const hasError = touched[field as keyof FormTouched] && errors[field as keyof FormErrors]
		const valid = isFieldValid(field)

		if (hasError) return `${base} border-2 border-brand-400 dark:border-brand-500 focus:ring-2 focus:ring-brand-500/30`
		if (valid) return `${base} border-2 border-emerald-400 dark:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30`
		return `${base} border border-black/5 dark:border-white/10 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500`
	}

	if (isSuccess) {
		return (
			<div className="bg-white dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 p-8 md:p-12 rounded-3xl shadow-xl dark:shadow-none relative overflow-hidden">
				<div className="flex flex-col items-center justify-center text-center py-12 animate-fade-in">
					<div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
						<CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
					</div>
					<h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">¡Mensaje Enviado!</h3>
					<p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
						Se abrió WhatsApp con tu mensaje. Te responderemos a la brevedad.
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className="bg-white dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 p-8 md:p-12 rounded-3xl shadow-xl dark:shadow-none relative overflow-hidden">
			<h2 className="text-3xl font-bold tracking-tight mb-8 text-zinc-900 dark:text-white">
				Inicia tu Proyecto
			</h2>

			<form className="space-y-6 relative z-10" onSubmit={handleSubmit} noValidate>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-2">
						<label
							htmlFor="name"
							className="text-sm font-semibold tracking-wide uppercase text-zinc-500 dark:text-zinc-400"
						>
							Nombre Completo
						</label>
						<div className="relative">
							<input
								type="text"
								id="name"
								name="name"
								value={formData.name}
								onChange={(e) => handleChange("name", e.target.value)}
								onBlur={() => handleBlur("name")}
								className={inputClasses("name")}
								placeholder="Tu nombre"
								autoComplete="name"
							/>
							{isFieldValid("name") && (
								<CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
							)}
						</div>
						{touched.name && errors.name && (
							<p className="flex items-center gap-1.5 text-sm text-brand-500 dark:text-brand-400 animate-fade-in">
								<AlertCircle className="w-4 h-4 shrink-0" />
								{errors.name}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<label
							htmlFor="email"
							className="text-sm font-semibold tracking-wide uppercase text-zinc-500 dark:text-zinc-400"
						>
							Email Profesional
						</label>
						<div className="relative">
							<input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								onChange={(e) => handleChange("email", e.target.value)}
								onBlur={() => handleBlur("email")}
								className={inputClasses("email")}
								placeholder="john@empresa.com"
								autoComplete="email"
							/>
							{isFieldValid("email") && (
								<CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
							)}
						</div>
						{touched.email && errors.email && (
							<p className="flex items-center gap-1.5 text-sm text-brand-500 dark:text-brand-400 animate-fade-in">
								<AlertCircle className="w-4 h-4 shrink-0" />
								{errors.email}
							</p>
						)}
					</div>
				</div>

				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<label
							htmlFor="message"
							className="text-sm font-semibold tracking-wide uppercase text-zinc-500 dark:text-zinc-400"
						>
							Detalles del Proyecto
						</label>
						<span className={`text-xs transition-colors ${formData.message.length > MAX_MESSAGE_LENGTH ? 'text-brand-500 font-bold' : 'text-zinc-400 dark:text-zinc-500'}`}>
							{formData.message.length}/{MAX_MESSAGE_LENGTH}
						</span>
					</div>
					<div className="relative">
						<textarea
							id="message"
							name="message"
							rows={6}
							value={formData.message}
							onChange={(e) => handleChange("message", e.target.value)}
							onBlur={() => handleBlur("message")}
							className={`${inputClasses("message")} resize-none`}
							placeholder="Cuéntanos qué tienes en mente..."
						/>
						{isFieldValid("message") && (
							<CheckCircle2 className="absolute right-4 top-4 w-5 h-5 text-emerald-500" />
						)}
					</div>
					{touched.message && errors.message && (
						<p className="flex items-center gap-1.5 text-sm text-brand-500 dark:text-brand-400 animate-fade-in">
							<AlertCircle className="w-4 h-4 shrink-0" />
							{errors.message}
						</p>
					)}
				</div>

				<button
					type="submit"
					disabled={isSubmitting}
					className="w-full sm:w-auto bg-brand-600 text-white px-10 py-4 rounded-full font-bold tracking-wide hover:bg-brand-700 hover:scale-[1.02] transform transition-all shadow-lg hover:shadow-brand-500/25 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
				>
					{isSubmitting ? (
						<>
							<Loader2 className="w-5 h-5 animate-spin" />
							Enviando...
						</>
					) : (
						<>
							<Send className="w-5 h-5" />
							Enviar Mensaje
						</>
					)}
				</button>
			</form>
		</div>
	)
}
