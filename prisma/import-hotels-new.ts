/**
 * Import 123 hotels from hotels-new-data.json
 * All English content, imported as drafts
 *
 * Usage:
 *   export $(cat .env | grep -v '^#' | xargs)
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/import-hotels-new.ts
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();
const DATA_FILE = path.join(__dirname, "hotels-new-data.json");

interface HotelItem {
  name: string;
  slug: string;
  coverImage: string | null;
  rating: number | null;
  reviewCount: number;
  address: string | null;
  phone: string | null;
  website: string | null;
  googleMapsUrl: string | null;
  lat: number | null;
  lng: number | null;
  openingHours: string | null;
  hotelType: string;
  starRating: number;
  priceRange: string | null;
  description: string;
  reviewsJson: string[];
}

function uniqueSlug(base: string, used: Set<string>): string {
  let slug = base;
  let i = 2;
  while (used.has(slug)) {
    slug = `${base}-${i++}`;
  }
  used.add(slug);
  return slug;
}

async function main() {
  const items: HotelItem[] = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  console.log(`📦  Loaded ${items.length} hotels from ${DATA_FILE}`);

  // Load existing hotels for name deduplication
  const existing = await prisma.place.findMany({
    where: { type: "hotel" },
    select: { id: true, name: true, slug: true },
  });
  const existingNames = new Set(existing.map((e) => e.name.trim().toLowerCase()));
  console.log(`🗄️   Existing hotels in DB: ${existing.length}`);

  // Load ALL slugs across all types to avoid unique constraint errors
  const allSlugs = await prisma.place.findMany({ select: { slug: true } });
  const existingSlugs = new Set(allSlugs.map((e) => e.slug));

  const usedSlugs = new Set(existingSlugs);
  let created = 0;
  let skipped = 0;

  for (const item of items) {
    const nameLower = item.name.trim().toLowerCase();
    if (existingNames.has(nameLower)) {
      console.log(`  ⏭️  Already exists: "${item.name}"`);
      skipped++;
      continue;
    }

    const slug = uniqueSlug(item.slug, usedSlugs);
    const reviewsJsonStr = JSON.stringify(item.reviewsJson);

    await prisma.place.create({
      data: {
        name:         item.name,
        slug,
        type:         "hotel",
        status:       "draft",
        description:  item.description,
        address:      item.address,
        lat:          item.lat,
        lng:          item.lng,
        phone:        item.phone,
        website:      item.website,
        coverImage:   item.coverImage,
        rating:       item.rating,
        reviewCount:  item.reviewCount,
        openingHours: item.openingHours,
        hotelType:    item.hotelType,
        starRating:   item.starRating,
        priceRange:   item.priceRange,
        reviewsJson:  reviewsJsonStr,
      },
    });

    console.log(`  ✓  [${item.starRating}★ ${item.hotelType}] ${item.name}`);
    created++;
  }

  console.log(`\n✅  Created: ${created}  Skipped (already exists): ${skipped}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
