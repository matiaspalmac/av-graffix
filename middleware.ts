import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export default auth((req: NextRequest & { auth?: any }) => {
  const pathname = req.nextUrl.pathname;

  // Permitir acceso a login sin autenticación
  if (pathname === "/erp/login") {
    // Si ya está autenticado, redirigir al dashboard
    if (req.auth?.user) {
      const dashboardUrl = new URL("/erp", req.nextUrl.origin);
      return NextResponse.redirect(dashboardUrl);
    }
    return NextResponse.next();
  }

  // Todas las demás rutas /erp/* requieren autenticación
  if (!req.auth?.user) {
    const loginUrl = new URL("/erp/login", req.nextUrl.origin);
    loginUrl.searchParams.append("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Agregar headers de seguridad
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
});

export const config = {
  matcher: [
    // Proteger todas las rutas /erp/*
    "/erp/:path*",
  ],
};
