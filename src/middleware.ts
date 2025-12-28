// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = process.env.JWT_SECRET || "super-secret-key";
const encoder = new TextEncoder();
const secretUint8 = encoder.encode(SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (adjust as needed)
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      // verify signature + expiry
      await jwtVerify(token, secretUint8);
      return NextResponse.next();
    } catch (err) {
      // invalid/expired -> go login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
