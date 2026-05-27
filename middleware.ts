import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow login page and login API through
  if (pathname === "/admin/login" || pathname.startsWith("/api/admin/")) {
    return NextResponse.next();
  }

  const session = req.cookies.get("admin_session")?.value;
  const validToken = process.env.ADMIN_PASSWORD ?? "changeme";

  if (session !== validToken) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
