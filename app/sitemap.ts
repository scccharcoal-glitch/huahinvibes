import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getActiveCuisines, getActiveAreas, HOTEL_TYPES, ATTRACTION_CATEGORIES, AREAS } from "@/lib/places";


const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let activeCuisines: string[] = [];
  let activeAreas: string[] = [];
  let places: { slug: string; type: string; updatedAt: Date }[] = [];

  try {
    [activeCuisines, activeAreas, places] = await Promise.all([
      getActiveCuisines(),
      getActiveAreas(),
      prisma.place.findMany({
        where: { status: "published" },
        select: { slug: true, type: true, updatedAt: true },
      }),
    ]);
  } catch {
    // DB not ready — return static pages only
  }

  const allAreas = AREAS.map((a) => a.value);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl,                   lastModified: new Date(), changeFrequency: "daily",  priority: 1.0 },
    { url: `${baseUrl}/restaurants`,  lastModified: new Date(), changeFrequency: "daily",  priority: 0.9 },
    { url: `${baseUrl}/hotels`,       lastModified: new Date(), changeFrequency: "daily",  priority: 0.9 },
    { url: `${baseUrl}/attractions`,  lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog`,         lastModified: new Date(), changeFrequency: "daily",  priority: 0.8 },
  ];

  // Restaurant pSEO: cuisine × area (only combinations that actually exist in DB)
  const restaurantPages: MetadataRoute.Sitemap = activeCuisines.flatMap((cuisine) =>
    activeAreas.map((area) => ({
      url: `${baseUrl}/restaurants/${cuisine}/${area}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }))
  );

  // Hotel pSEO: type × area (all combos — pages gracefully handle empty)
  const hotelPages: MetadataRoute.Sitemap = HOTEL_TYPES.flatMap((t) =>
    allAreas.map((area) => ({
      url: `${baseUrl}/hotels/${t.value}/${area}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );

  // Attraction pSEO: category × area (all combos)
  const attractionPages: MetadataRoute.Sitemap = ATTRACTION_CATEGORIES.flatMap((c) =>
    allAreas.map((area) => ({
      url: `${baseUrl}/attractions/${c.value}/${area}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );

  // Individual place pages (restaurants, hotels, attractions)
  const placePages: MetadataRoute.Sitemap = places
    .filter((p) => p.type !== "BLOG")
    .map((place) => ({
      url: `${baseUrl}/place/${place.slug}`,
      lastModified: place.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  // Blog posts
  const blogPages: MetadataRoute.Sitemap = places
    .filter((p) => p.type === "BLOG")
    .map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    }));

  return [...staticPages, ...restaurantPages, ...hotelPages, ...attractionPages, ...placePages, ...blogPages];
}
