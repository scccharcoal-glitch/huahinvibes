import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getActiveCuisines, getActiveAreas } from "@/lib/places";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export const revalidate = 3600; // regenerate sitemap hourly

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
    // DB not ready yet — return static pages only
  }

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl,                   lastModified: new Date(), changeFrequency: "daily",  priority: 1.0 },
    { url: `${baseUrl}/restaurants`,  lastModified: new Date(), changeFrequency: "daily",  priority: 0.9 },
    { url: `${baseUrl}/hotels`,       lastModified: new Date(), changeFrequency: "daily",  priority: 0.9 },
    { url: `${baseUrl}/attractions`,  lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  // pSEO pages — only cuisine × area combinations that ACTUALLY exist in DB
  const pSEOPages: MetadataRoute.Sitemap = activeCuisines.flatMap((cuisine) =>
    activeAreas.map((area) => ({
      url: `${baseUrl}/restaurants/${cuisine}/${area}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }))
  );

  // Individual place pages
  const placePages: MetadataRoute.Sitemap = places.map((place) => ({
    url: `${baseUrl}/place/${place.slug}`,
    lastModified: place.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...pSEOPages, ...placePages];
}
