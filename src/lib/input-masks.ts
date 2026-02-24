// Formateadores para input masks

/**
 * Formatea un RUT chileno al formato 12.345.678-9
 */
export function formatRUT(rut: string): string {
  const clean = rut.replace(/[^\dKk]/g, "");
  if (clean.length === 0) return "";

  const body = clean.slice(0, -1);
  const verification = clean.slice(-1);

  const formatted = body.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");

  return `${formatted}-${verification}`;
}

/**
 * Extrae solo los caracteres del RUT (sin puntos ni guiones)
 */
export function extractRUT(rut: string): string {
  return rut.replace(/[.-]/g, "");
}

/**
 * Formatea un teléfono chileno al formato +56 9 1234 5678
 */
export function formatPhone(phone: string): string {
  const clean = phone.replace(/[^\d+]/g, "");
  
  // Si comienza con +56
  if (clean.startsWith("+56")) {
    const number = clean.slice(3); // Remueve +56
    if (number.length === 9) {
      return `+56 ${number[0]} ${number.slice(1, 5)} ${number.slice(5)}`;
    }
  }

  // Si comienza con 9 (formato local)
  if (clean.startsWith("9")) {
    if (clean.length === 9) {
      return `${clean[0]} ${clean.slice(1, 5)} ${clean.slice(5)}`;
    }
  }

  return clean;
}

/**
 * Extrae solo los dígitos del teléfono
 */
export function extractPhone(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

/**
 * Formatea una fecha al formato 01/01/2024
 */
export function formatDate(date: string): string {
  const clean = date.replace(/[^\d]/g, "");
  
  if (clean.length === 0) return "";
  if (clean.length <= 2) return clean;
  if (clean.length <= 4) return `${clean.slice(0, 2)}/${clean.slice(2)}`;
  
  return `${clean.slice(0, 2)}/${clean.slice(2, 4)}/${clean.slice(4, 8)}`;
}

/**
 * Extrae solo los dígitos de una fecha
 */
export function extractDate(date: string): string {
  return date.replace(/[^\d]/g, "");
}

/**
 * Valida que una fecha sea válida
 */
export function isValidDate(dateString: string): boolean {
  const clean = dateString.replace(/[^\d]/g, "");
  
  if (clean.length !== 8) return false;

  const day = parseInt(clean.slice(0, 2), 10);
  const month = parseInt(clean.slice(2, 4), 10);
  const year = parseInt(clean.slice(4, 8), 10);

  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

/**
 * Formatea un número con separadores de miles
 */
export function formatNumber(num: string | number): string {
  const clean = String(num).replace(/[^\d]/g, "");
  return clean.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
}

/**
 * Extrae solo números
 */
export function extractNumber(value: string): string {
  return value.replace(/[^\d]/g, "");
}

/**
 * Mascara genérica que acepta solo ciertos caracteres
 */
export function applyMask(value: string, pattern: string): string {
  let result = "";
  let valueIndex = 0;

  for (let i = 0; i < pattern.length && valueIndex < value.length; i++) {
    const patternChar = pattern[i];

    if (patternChar === "#") {
      // # representa un dígito
      if (/[\d]/.test(value[valueIndex])) {
        result += value[valueIndex];
        valueIndex++;
      } else {
        valueIndex++;
      }
    } else if (patternChar === "X") {
      // X representa una letra
      if (/[a-zA-Z]/.test(value[valueIndex])) {
        result += value[valueIndex];
        valueIndex++;
      } else {
        valueIndex++;
      }
    } else {
      // Caracteres literales (guiones, puntos, etc)
      result += patternChar;
    }
  }

  return result;
}
