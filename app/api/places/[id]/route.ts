import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { submitPlaceToIndexNow } from "@/lib/indexnow";
import { makeSlug } from "@/lib/slug";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const place = await prisma.place.findUnique({ where: { id } });
  if (!place) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(place);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  try {
    const body = await req.json();

    const nextSlug = makeSlug(body.slug || body.name, "place");
    const existing = await prisma.place.findFirst({
      where: { slug: nextSlug, NOT: { id } },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const place = await prisma.place.update({
      where: { id },
      data: {
        name: body.name,
        slug: nextSlug,
        type: body.type,
        status: body.status,
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
        reviewsJson: body.reviewsJson ?? null,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
        linkedPlaces: body.linkedPlaces ?? null,
      },
    });

    await submitPlaceToIndexNow(place);

    return NextResponse.json(place);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  try {
    const place = await prisma.place.findUnique({ where: { id } });
    await prisma.place.delete({ where: { id } });
    if (place) await submitPlaceToIndexNow(place);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
