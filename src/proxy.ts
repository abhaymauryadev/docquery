import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

const protectedPrefixes = [
  "/app",
  "/workspace",
  "/api/workspaces",
  "/api/documents",
  "/api/conversations",
];

export default auth((request) => {
  const { pathname } = request.nextUrl;

  const isProtected = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (!isProtected) return NextResponse.next();

  if (!request.auth?.user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/app/:path*",
    "/workspace/:path*",
    "/api/workspaces/:path*",
    "/api/documents/:path*",
    "/api/conversations/:path*",
  ],
};
