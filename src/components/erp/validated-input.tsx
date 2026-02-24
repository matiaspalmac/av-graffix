"use client";

import { InputHTMLAttributes, useState, useCallback } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { ValidationRule, validateRule } from "@/lib/validators";

interface ValidatedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  validation?: ValidationRule;
  onValidationChange?: (isValid: boolean, error: string | null) => void;
}

export function ValidatedInput({
  label,
  description,
  error: externalError,
  validation,
  onValidationChange,
  onBlur,
  onChange,
  name,
  ...props
}: ValidatedInputProps) {
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const handleValidation = useCallback(
    (value: string) => {
      if (!validation) return;

      const fieldName = label || name || "Campo";
      const validationError = validateRule(value, validation, fieldName);

      setError(validationError);
      setIsValid(!validationError);
      onValidationChange?.(!!validationError === false, validationError);
    },
    [validation, label, name, onValidationChange]
  );

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    handleValidation(e.currentTarget.value);
    onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (touched) {
      handleValidation(e.currentTarget.value);
    }
    onChange?.(e);
  };

  const displayError = externalError || error;
  const showError = touched && displayError;

  return (
    <div className="grid gap-1.5">
      {label && (
        <label className="text-sm">
          <span className="text-zinc-600 dark:text-zinc-300">{label}</span>
          {validation?.required && <span className="text-red-600 dark:text-red-400 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          name={name}
          {...props}
          onBlur={handleBlur}
          onChange={handleChange}
          className={`w-full rounded-xl border bg-transparent px-3 py-2 transition ${
            showError
              ? "border-red-300 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20"
              : touched && isValid
              ? "border-emerald-300 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20"
              : "border-zinc-300 dark:border-zinc-700"
          }`}
        />

        {touched && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {showError ? (
              <AlertCircle size={18} className="text-red-600 dark:text-red-400" />
            ) : isValid ? (
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
          {displayError}
        </p>
      )}
    </div>
  );
}
