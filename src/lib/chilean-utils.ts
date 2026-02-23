/**
 * Utilidades para validación y formato de datos chilenos
 */

/**
 * Valida un RUT chileno según dígito verificador
 * Formato esperado: 12.345.678-9 o 123456789
 */
export function validateRUT(rut: string): boolean {
  if (!rut) return false;

  // Remover puntos y guión
  const cleanRut = rut.replace(/[\.\-]/g, "").toUpperCase();

  // Debe tener 9 caracteres (8 números + 1 dígito verificador)
  if (cleanRut.length !== 9) return false;

  // Últimos 8 caracteres deben ser números
  const rutNumbers = cleanRut.slice(0, 8);
  if (!/^\d+$/.test(rutNumbers)) return false;

  // Último carácter es el dígito verificador (número o K)
  const dv = cleanRut.charAt(8);
  if (!/^[\dK]$/.test(dv)) return false;

  // Calcular dígito verificador
  let sum = 0;
  let multiplier = 2;

  for (let i = rutNumbers.length - 1; i >= 0; i--) {
    sum += parseInt(rutNumbers.charAt(i)) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = 11 - (sum % 11);
  let expectedDv: string;

  if (remainder === 11) {
    expectedDv = "0";
  } else if (remainder === 10) {
    expectedDv = "K";
  } else {
    expectedDv = remainder.toString();
  }

  return dv === expectedDv;
}

/**
 * Formatea RUT a formato estándar: XX.XXX.XXX-X
 */
export function formatRUT(rut: string): string {
  const clean = rut.replace(/[\.\-]/g, "").toUpperCase();
  if (clean.length !== 9) return rut;

  const part1 = clean.slice(0, 2);
  const part2 = clean.slice(2, 5);
  const part3 = clean.slice(5, 8);
  const dv = clean.slice(8);

  return `${part1}.${part2}.${part3}-${dv}`;
}

/**
 * Formatea número a moneda CLP: $1.234.567
 */
export function formatCLP(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "$0";

  const formatter = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(amount);
}

/**
 * Parsea string con formato CLP a número
 * "$1.234.567" → 1234567
 */
export function parseCLP(clpString: string): number {
  return parseInt(clpString.replace(/[\$\.\s]/g, ""), 10) || 0;
}

/**
 * Calcula IVA (19% en Chile)
 */
export function calculateIVA(amount: number): number {
  return Math.round(amount * 0.19);
}

/**
 * Calcula subtotal sin IVA dada una cantidad con IVA incluido
 */
export function removeIVA(amountWithIVA: number): number {
  return Math.round(amountWithIVA / 1.19);
}

/**
 * Calcula monto total con IVA incluido
 */
export function addIVA(subtotal: number): number {
  return Math.round(subtotal * 1.19);
}

/**
 * Retorna objeto con subtotal, IVA y total
 */
export function calculateMoneyWithIVA(subtotal: number) {
  const iva = calculateIVA(subtotal);
  const total = subtotal + iva;

  return {
    subtotal,
    iva,
    total,
  };
}

/**
 * Formatea teléfono chileno: +56 9 1234 5678
 */
export function formatPhoneNumber(phone: string): string {
  const clean = phone.replace(/\D/g, "");

  // Si comienza con 56, es número internacional
  if (clean.startsWith("56")) {
    const rest = clean.slice(2);
    if (rest.length === 9) {
      return `+56 ${rest.slice(0, 1)} ${rest.slice(1, 5)} ${rest.slice(5)}`;
    }
  }

  // Si comienza con 9, es celular nacional (agregar 56)
  if (clean.startsWith("9")) {
    if (clean.length === 9) {
      return `+56 ${clean.slice(0, 1)} ${clean.slice(1, 5)} ${clean.slice(5)}`;
    }
  }

  // Si comienza con 2 o 4, es fono fijo
  if (clean.match(/^[24]/)) {
    if (clean.length === 8) {
      return `+56 ${clean.slice(0, 1)} ${clean.slice(1, 5)} ${clean.slice(5)}`;
    }
  }

  return phone;
}

/**
 * Valida email básico
 */
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Obtiene nombre de región chilena basado en área de teléfono (opcional)
 */
export function getRegionByAreaCode(areaCode: string): string {
  const regions: Record<string, string> = {
    "2": "Región Metropolitana",
    "32": "Región de Valparaíso",
    "41": "Región del Bío-Bío",
    "45": "Región de La Araucanía",
    "51": "Región de Magallanes",
    "58": "Región de Atacama",
    "71": "Región del Maule",
    "75": "Región de Los Lagos",
  };

  return regions[areaCode] || "Sin determinar";
}
