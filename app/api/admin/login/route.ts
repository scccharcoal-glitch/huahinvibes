import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const validUser = process.env.ADMIN_USERNAME ?? "admin";
  const validPass = process.env.ADMIN_PASSWORD ?? "changeme";

  if (username !== validUser || password !== validPass) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", validPass, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  return res;
}
