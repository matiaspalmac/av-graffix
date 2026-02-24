// Validación de patrones comunes

export const ValidationPatterns = {
  // RUT chileno: 12.345.678-9
  rut: /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9Kk]$/,
  // Email standard
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  // Teléfono: +56 9 1234 5678 o 9 1234 5678
  phone: /^(\+56\s)?9\s?\d{4}\s?\d{4}$/,
  // URL básica
  url: /^(https?:\/\/)?([\da-z.-]+)\.[a-z.]{2,6}([/\w .-]*)*\/?$/,
  // Solo números
  numeric: /^\d+$/,
  // Solo letras
  alpha: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  // Alfanumérico
  alphanumeric: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/,
};

export type ValidationRule = {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  required?: boolean;
  custom?: (value: string) => boolean | string;
  message?: string;
};

export function validateEmail(email: string): string | null {
  if (!email) return "Email requerido";
  if (!ValidationPatterns.email.test(email)) {
    return "Email inválido";
  }
  return null;
}

export function validateRUT(rut: string): string | null {
  if (!rut) return "RUT requerido";
  
  // Remover puntos y guiones para verificar
  const clean = rut.replace(/[.-]/g, "");
  if (!/^\d{7,9}[0-9Kk]$/.test(clean)) {
    return "RUT inválido (formato: 12.345.678-9)";
  }
  
  // Verificar dígito verificador (algoritmo chileno)
  const digits = clean.slice(0, -1);
  const verification = clean.slice(-1).toUpperCase();
  
  let sum = 0;
  let multiplier = 2;
  
  for (let i = digits.length - 1; i >= 0; i--) {
    sum += parseInt(digits[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const remainder = 11 - (sum % 11);
  const expected = remainder === 11 ? "0" : remainder === 10 ? "K" : String(remainder);
  
  if (verification !== expected) {
    return "RUT inválido (dígito verificador incorrecto)";
  }
  
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone) return "Teléfono requerido";
  if (!ValidationPatterns.phone.test(phone)) {
    return "Teléfono inválido (formato: +56 9 1234 5678)";
  }
  return null;
}

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value || !value.trim()) {
    return `${fieldName} es requerido`;
  }
  return null;
}

export function validateMinLength(
  value: string,
  minLength: number,
  fieldName: string
): string | null {
  if (value && value.length < minLength) {
    return `${fieldName} debe tener al menos ${minLength} caracteres`;
  }
  return null;
}

export function validateMaxLength(
  value: string,
  maxLength: number,
  fieldName: string
): string | null {
  if (value && value.length > maxLength) {
    return `${fieldName} no puede exceder ${maxLength} caracteres`;
  }
  return null;
}

export function validatePattern(
  value: string,
  pattern: RegExp,
  fieldName: string
): string | null {
  if (value && !pattern.test(value)) {
    return `${fieldName} tiene un formato inválido`;
  }
  return null;
}

export function validateRule(
  value: string,
  rule: ValidationRule,
  fieldName: string
): string | null {
  if (rule.required && !value) {
    return rule.message || `${fieldName} es requerido`;
  }

  if (rule.minLength && value && value.length < rule.minLength) {
    return rule.message || `${fieldName} debe tener al menos ${rule.minLength} caracteres`;
  }

  if (rule.maxLength && value && value.length > rule.maxLength) {
    return rule.message || `${fieldName} no puede exceder ${rule.maxLength} caracteres`;
  }

  if (rule.pattern && value && !rule.pattern.test(value)) {
    return rule.message || `${fieldName} tiene un formato inválido`;
  }

  if (rule.custom) {
    const result = rule.custom(value);
    if (typeof result === "string") return result;
    if (result === false) return rule.message || `${fieldName} es inválido`;
  }

  return null;
}
