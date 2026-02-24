"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LogOut, Settings, User } from "lucide-react";
import { handleSignOut } from "./topbar-actions";

type UserAvatarMenuProps = {
  userName?: string | null;
  role?: string | null;
};

export function UserAvatarMenu({ userName, role }: UserAvatarMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const initials = (userName || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    // Disparar evento de logout para que PWA limpie cache
    window.dispatchEvent(new CustomEvent('logout'));
    // Pequeña pausa para que el PWA limpie cache
    await new Promise(resolve => setTimeout(resolve, 100));
    // Luego ejecutar el logout
    handleSignOut();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition"
        aria-label="Menú de usuario"
      >
        {initials}
      </button>

      {isOpen && (
        <div className="erp-dropdown-surface absolute right-0 mt-2 w-52 rounded-xl border backdrop-blur-sm z-50 overflow-hidden">
          <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {userName || "Usuario"}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{role || "Equipo"}</p>
          </div>
          <div className="p-2 space-y-1">
            <Link
              href="/erp/perfil"
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-lg transition"
              onClick={() => setIsOpen(false)}
            >
              <User size={16} />
              Mi Perfil
            </Link>
            <Link
              href="/erp/config"
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-lg transition"
              onClick={() => setIsOpen(false)}
            >
              <Settings size={16} />
              Configuración
            </Link>
          </div>
          <div className="p-2 border-t border-zinc-200 dark:border-zinc-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
            >
              <LogOut size={16} />
              Salir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
