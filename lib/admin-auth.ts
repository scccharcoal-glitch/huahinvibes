import { type NextRequest, NextResponse } from "next/server";

export function isAdminRequest(req: NextRequest) {
  const session = req.cookies.get("admin_session")?.value;
  const validToken = process.env.ADMIN_PASSWORD ?? "changeme";
  return session === validToken;
}

export function requireAdmin(req: NextRequest) {
  if (isAdminRequest(req)) return null;
  return NextResponse.json({ error: "Admin login required" }, { status: 401 });
}
