import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// jsonwebtoken relies on Node's crypto module, which the default Edge
// middleware runtime doesn't support — force the Node.js runtime instead.
export const runtime = "nodejs";

const STAFF_ROLES = ["RECEPTIONIST", "MANAGER", "ADMINISTRATOR"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth_token")?.value;
  const session = token ? verifyToken(token) : null;

  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      const url = new URL("/login", req.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!session || !STAFF_ROLES.includes(session.role)) {
      const url = new URL("/login", req.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
