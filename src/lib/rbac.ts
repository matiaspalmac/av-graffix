export const roleLabels: Record<string, string> = {
  admin: "Administrador",
  finanzas: "Finanzas",
};

export function isAdmin(role?: string | null): boolean {
  return role === "admin";
}

export function canAccessFinance(role?: string | null): boolean {
  return role === "admin" || role === "finanzas";
}

export function canAccessProduction(role?: string | null): boolean {
  return role === "admin" || role === "finanzas";
}

export function canAccessErp(role?: string | null): boolean {
  return role === "admin" || role === "finanzas";
}
