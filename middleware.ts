import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { user, response } = await updateSession(request);

  const { pathname } = request.nextUrl;

  // Allow public routes
  const publicPaths = [
    "/",
    "/login",
    "/register",
    "/pricing",
    "/privacy",
    "/auth/callback",
    "/auth/confirm",
  ];
  if (publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return response;
  }

  // Static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/public") ||
    pathname.match(/\.(ico|png|svg|jpg|jpeg|gif|webp|css|js|woff2?)$/)
  ) {
    return response;
  }

  // Redirect unauthenticated users
  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);
    return Response.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
