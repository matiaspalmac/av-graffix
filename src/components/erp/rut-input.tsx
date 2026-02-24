"use client";

import { InputHTMLAttributes, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { formatRUT } from "@/lib/input-masks";

interface RUTInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
  error?: string;
}

export function RUTInput({
  label,
  description,
  error,
  value,
  onChange,
  onBlur,
  name,
  ...props
}: RUTInputProps) {
  const [touched, setTouched] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatRUT(raw);
    
    const event = new Event("change", { bubbles: true });
    Object.defineProperty(event, "target", {
      value: { name, value: formatted },
      enumerable: true,
    });
    onChange?.(event as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    onBlur?.(e);
  };

  const showError = touched && error;

  return (
    <div className="grid gap-1.5">
      {label && (
        <label className="text-sm">
          <span className="text-zinc-600 dark:text-zinc-300">{label}</span>
        </label>
      )}

      <div className="relative">
        <input
          type="text"
          name={name}
          value={value || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="12.345.678-9"
          {...props}
          className={`w-full rounded-xl border bg-transparent px-3 py-2 transition ${
            showError
              ? "border-red-300 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20"
              : touched && value
              ? "border-emerald-300 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20"
              : "border-zinc-300 dark:border-zinc-700"
          }`}
        />

        {touched && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {showError ? (
              <AlertCircle size={18} className="text-red-600 dark:text-red-400" />
            ) : value ? (
              <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
            ) : null}
          </div>
        )}
      </div>

      {description && !showError && (
        <p className="text-xs text-zinc-600 dark:text-zinc-400">{description}</p>
      )}

      {showError && (
        <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  );
}
