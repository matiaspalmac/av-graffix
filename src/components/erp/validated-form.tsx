"use client";

import { FormHTMLAttributes, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface ValidatedFormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  globalError?: string;
}

export function ValidatedForm({
  children,
  globalError,
  ...props
}: ValidatedFormProps) {
  return (
    <form {...props} className={`space-y-3 ${props.className || ""}`}>
      {globalError && (
        <div className="rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 px-4 py-3 flex items-start gap-3">
          <AlertCircle size={18} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700 dark:text-red-300">{globalError}</div>
        </div>
      )}
      {children}
    </form>
  );
}
