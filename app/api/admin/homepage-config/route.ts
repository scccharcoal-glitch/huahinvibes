import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getHomepageConfig, saveHomepageConfig } from "@/lib/site-config";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  const config = await getHomepageConfig();
  return NextResponse.json(config);
}

export async function POST(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  const body = await req.json();
  await saveHomepageConfig(body);
  revalidatePath("/");
  revalidatePath("/th");
  return NextResponse.json({ ok: true });
}
