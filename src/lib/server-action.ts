import { auth } from "@/auth";

export type ActionResult<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
};

export function ok<T = unknown>(data?: T, message?: string): ActionResult<T> {
  return { success: true, data, message };
}

export function fail(error: string, message?: string): ActionResult<never> {
  return { success: false, error, message };
}

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("No autenticado");
  }
  return session;
}

export async function requireRole(allowedRoles: string[]) {
  const session = await requireUser();
  const role = session.user.role ?? "";

  if (!allowedRoles.includes(role)) {
    throw new Error("No autorizado");
  }

  return session;
}

export function toErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return "Error interno de servidor";
}
