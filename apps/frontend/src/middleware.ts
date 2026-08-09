import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_ROUTES = new Set([
  "/login",
  "/auth/register/org-admin",
  "/register/org-user",
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAccessToken = Boolean(request.cookies.get("access_token")?.value);
  const isAuthRoute = AUTH_ROUTES.has(pathname);

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(hasAccessToken ? "/dashboard" : "/login", request.url),
    );
  }

  if (hasAccessToken && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/auth/register/org-admin", "/register/org-user"],
};
