import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const publicRoutes = new Set<string>(["/login", "/api/auth"]);

const roleProtectedRoutes: { matcher: RegExp; roles: Array<"ADMIN" | "CLIENT"> }[] = [
  {
    matcher: /^\/admin(\/.*)?$/,
    roles: ["ADMIN"],
  },
  {
    matcher: /^\/client(\/.*)?$/,
    roles: ["CLIENT", "ADMIN"],
  },
];

const isStaticAsset = (pathname: string) =>
  pathname.startsWith("/_next") ||
  pathname.startsWith("/static") ||
  pathname.startsWith("/images") ||
  pathname.includes(".");

const isPublicRoute = (pathname: string) => {
  if (publicRoutes.has(pathname)) {
    return true;
  }

  for (const route of publicRoutes) {
    if (route !== "/" && pathname.startsWith(`${route}/`)) {
      return true;
    }
  }

  return false;
};

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (isPublicRoute(pathname)) {
    if (pathname === "/login" && token) {
      const redirectUrl = request.nextUrl.searchParams.get("callbackUrl") ?? "/";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  const guard = roleProtectedRoutes.find(({ matcher }) => matcher.test(pathname));

  if (guard && !guard.roles.includes((token.role as "ADMIN" | "CLIENT") ?? "CLIENT")) {
    const forbiddenUrl = new URL("/login", request.url);
    forbiddenUrl.searchParams.set("error", "AccessDenied");
    return NextResponse.redirect(forbiddenUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
