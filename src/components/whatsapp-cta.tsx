"use client"

import { useState, useEffect } from "react"
import { MessageCircle, X } from "lucide-react"

export default function WhatsAppCTA() {
  const [show, setShow] = useState(false)
  const [tooltip, setTooltip] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (tooltip) {
      const hide = setTimeout(() => setTooltip(false), 8000)
      return () => clearTimeout(hide)
    }
  }, [tooltip])

  if (!show) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
      {tooltip && (
        <div className="relative bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm font-medium px-4 py-3 rounded-2xl rounded-br-none shadow-xl border border-black/5 dark:border-white/10 max-w-[200px] animate-fade-in">
          <button
            onClick={() => setTooltip(false)}
            className="absolute -top-2 -right-2 w-5 h-5 bg-zinc-200 dark:bg-zinc-700 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
            aria-label="Cerrar"
          >
            <X size={10} />
          </button>
          <p>¿Necesitas una cotización? ¡Escríbenos!</p>
        </div>
      )}
      <a
        href="https://wa.me/56992791148?text=Hola%20AV%20GRAFFIX%2C%20me%20gustar%C3%ADa%20cotizar%20un%20proyecto."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="group relative w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-green-500/30 hover:scale-110 transition-all duration-300"
      >
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
        <MessageCircle size={26} className="relative z-10 fill-white" />
      </a>
    </div>
  )
}
