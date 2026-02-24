"use client";

import { useState, useCallback } from "react";
import { ValidationRule, validateRule } from "@/lib/validators";

export type FormErrors = Record<string, string | null>;
export type FormValidations = Record<string, ValidationRule>;

export function useFormValidation(validations: FormValidations) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback(
    (fieldName: string, value: string): string | null => {
      const rule = validations[fieldName];
      if (!rule) return null;

      const error = validateRule(value, rule, fieldName);
      setErrors((prev) => ({ ...prev, [fieldName]: error }));
      return error;
    },
    [validations]
  );

  const validateAll = useCallback(
    (formData: Record<string, string>): boolean => {
      const newErrors: FormErrors = {};
      let isValid = true;

      for (const [fieldName, rule] of Object.entries(validations)) {
        const value = formData[fieldName] || "";
        const error = validateRule(value, rule, fieldName);
        newErrors[fieldName] = error;
        if (error) isValid = false;
      }

      setErrors(newErrors);
      return isValid;
    },
    [validations]
  );

  const handleBlur = useCallback(
    (fieldName: string, value: string) => {
      setTouched((prev) => ({ ...prev, [fieldName]: true }));
      validateField(fieldName, value);
    },
    [validateField]
  );

  const handleChange = useCallback(
    (fieldName: string, value: string) => {
      if (touched[fieldName]) {
        validateField(fieldName, value);
      }
    },
    [touched, validateField]
  );

  const clearError = useCallback((fieldName: string) => {
    setErrors((prev) => ({ ...prev, [fieldName]: null }));
  }, []);

  const reset = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  return {
    errors,
    touched,
    validateField,
    validateAll,
    handleBlur,
    handleChange,
    clearError,
    reset,
    isValid: Object.values(errors).every((err) => !err),
  };
}
