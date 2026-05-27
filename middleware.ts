import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get("authorization");
  const url = req.nextUrl;

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = atob(authValue).split(":");

    const validUser = process.env.ADMIN_USERNAME ?? "admin";
    const validPwd  = process.env.ADMIN_PASSWORD ?? "changeme";

    if (user === validUser && pwd === validPwd) {
      return NextResponse.next();
    }
  }

  url.pathname = "/api/auth-required";
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Hua Hin Vibes Admin", charset="UTF-8"',
    },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
