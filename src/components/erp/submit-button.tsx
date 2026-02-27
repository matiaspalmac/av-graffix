"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "destructive";
  className?: string;
}

export function SubmitButton({ children, variant = "primary", className }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  const variantClasses = {
    primary: "bg-brand-600 text-white hover:bg-brand-700",
    secondary: "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900",
    destructive: "rounded-lg border border-red-200 text-red-700 dark:border-red-900/40 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20",
  };

  const classes = cn(
    "rounded-xl px-4 py-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-opacity transition-colors",
    variantClasses[variant],
    className
  );

  return (
    <button type="submit" disabled={pending} className={classes}>
      {pending ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {typeof children === 'string' ? 'Procesando...' : children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
