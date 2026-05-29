import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { submitPlaceToIndexNow } from "@/lib/indexnow";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const type = searchParams.get("type") ?? undefined;
  const area = searchParams.get("area") ?? undefined;
  const status = searchParams.get("status") ?? "published";

  const places = await prisma.place.findMany({
    where: {
      ...(type && { type }),
      ...(area && { area }),
      ...(status !== "all" && { status }),
    },
    orderBy: [{ featured: "desc" }, { rating: "desc" }],
  });

  return NextResponse.json(places);
}

export async function POST(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();

    if (!body.name || !body.type) {
      return NextResponse.json({ error: "name and type are required" }, { status: 400 });
    }

    // Ensure unique slug
    const baseSlug = body.slug || body.name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
    let slug = baseSlug;
    let suffix = 0;

    while (true) {
      const existing = await prisma.place.findUnique({ where: { slug } });
      if (!existing) break;
      suffix++;
      slug = `${baseSlug}-${suffix}`;
    }

    const place = await prisma.place.create({
      data: {
        name: body.name,
        slug,
        type: body.type,
        status: body.status ?? "draft",
        featured: body.featured ?? false,
        description: body.description || null,
        content: body.content || null,
        address: body.address || null,
        area: body.area || null,
        lat: body.lat ?? null,
        lng: body.lng ?? null,
        googlePlaceId: body.googlePlaceId || null,
        cuisine: body.cuisine || null,
        priceRange: body.priceRange || null,
        openingHours: body.openingHours || null,
        hotelType: body.hotelType || null,
        starRating: body.starRating ?? null,
        category: body.category || null,
        phone: body.phone || null,
        website: body.website || null,
        email: body.email || null,
        bookingUrl: body.bookingUrl || null,
        coverImage: body.coverImage || null,
        tags: body.tags || null,
        seoTitle: body.seoTitle || null,
        seoDesc: body.seoDesc || null,
        rating: body.rating ?? null,
        reviewCount: body.reviewCount ?? null,
      },
    });

    await submitPlaceToIndexNow(place);

    return NextResponse.json(place, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create place" }, { status: 500 });
  }
}
