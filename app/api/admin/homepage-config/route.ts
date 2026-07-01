import { NextRequest, NextResponse } from "next/server";
import { getHomepageConfig, saveHomepageConfig } from "@/lib/site-config";
import { cookies } from "next/headers";

async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === "true";
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const config = await getHomepageConfig();
  return NextResponse.json(config);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  await saveHomepageConfig(body);
  return NextResponse.json({ ok: true });
}
