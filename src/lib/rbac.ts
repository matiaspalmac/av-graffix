export const roleLabels: Record<string, string> = {
  admin: "Administrador",
  produccion: "Producción",
};

export function isAdmin(role?: string | null): boolean {
  return role === "admin";
}

export function canAccessFinance(role?: string | null): boolean {
  return role === "admin" || role === "produccion";
}

export function canAccessProduction(role?: string | null): boolean {
  return role === "admin" || role === "produccion";
}

export function canAccessErp(role?: string | null): boolean {
  return role === "admin" || role === "produccion";
}
