import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export default auth((req: NextRequest & { auth?: unknown }) => {
  if (req.nextUrl.pathname === "/erp/login") {
    return NextResponse.next();
  }

  if (!req.auth) {
    const loginUrl = new URL("/erp/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/erp/:path*"],
};
