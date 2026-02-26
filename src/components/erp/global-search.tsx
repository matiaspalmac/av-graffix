"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

const quickLinks = [
  { label: "Dashboard", href: "/erp" },
  { label: "CRM & Ventas", href: "/erp/ventas" },
  { label: "Cotizaciones", href: "/erp/cotizaciones" },
  { label: "Clientes", href: "/erp/clientes" },
  { label: "Proyectos", href: "/erp/proyectos" },
  { label: "Producción", href: "/erp/produccion" },
  { label: "Inventario", href: "/erp/inventario" },
  { label: "Compras", href: "/erp/compras" },
  { label: "Proveedores", href: "/erp/proveedores" },
  { label: "Finanzas", href: "/erp/finanzas" },
  { label: "Reportes", href: "/erp/reportes" },
  { label: "Configuración", href: "/erp/admin" },
];

type GlobalSearchProps = {
  role?: string | null;
};

export function GlobalSearch({ role }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allowedLinks = quickLinks.filter((link) => (link.href === "/erp/admin" ? role === "admin" : true));

  const filtered = allowedLinks.filter((link) =>
    link.label.toLowerCase().includes(query.toLowerCase())
  );

  // Cerrar después de 1 minuto de inactividad
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (isOpen) {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 60000); // 1 minuto
    }
  };

  // Detectar clicks fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      resetTimeout();
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen]);

  // Resetear timeout cuando se escribe
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    resetTimeout();
  };

  return (
    <div ref={containerRef} className="relative flex-1 w-full">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Buscar módulos..."
          value={query}
          onChange={handleInput}
          onFocus={() => {
            setIsOpen(true);
            resetTimeout();
          }}
          className="w-full pl-[52px] pr-12 py-3 rounded-full border-none bg-zinc-100 dark:bg-zinc-800/50 text-base placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && (filtered.length > 0 || query) && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl z-50 overflow-hidden">
          {filtered.length > 0 ? (
            <div className="p-2 space-y-1">
              {filtered.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-sm text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-lg transition"
                  onClick={() => {
                    setQuery("");
                    setIsOpen(false);
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          ) : (
            <div className="p-4 text-sm text-zinc-500 dark:text-zinc-400 text-center">
              No se encontraron módulos
            </div>
          )}
        </div>
      )}
    </div>
  );
}
