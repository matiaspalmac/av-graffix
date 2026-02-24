"use client";

import { useEffect } from "react";

interface ErpPreferencesLoaderProps {
  themeDarkMode: boolean;
  themeHighContrast: boolean;
}

export function ErpPreferencesLoader({ themeDarkMode, themeHighContrast }: ErpPreferencesLoaderProps) {
  useEffect(() => {
    // Aplicar preferencias de BD al DOM
    const html = document.documentElement;

    // Aplicar tema oscuro
    if (themeDarkMode) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    // Aplicar contraste alto
    if (themeHighContrast) {
      html.classList.add("high-contrast");
      localStorage.setItem("highContrast", "true");
    } else {
      html.classList.remove("high-contrast");
      localStorage.setItem("highContrast", "false");
    }
  }, [themeDarkMode, themeHighContrast]);

  return null;
}
