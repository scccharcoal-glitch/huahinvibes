/**
 * Import 265 restaurants from restaurants-new-data.json
 * All English content, imported as drafts
 *
 * Usage:
 *   export $(cat .env | grep -v '^#' | xargs)
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/import-restaurants-new.ts
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();
const DATA_FILE = path.join(__dirname, "restaurants-new-data.json");

interface RestaurantItem {
  name: string;
  slug: string;
  cuisine: string;
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
  priceRange: string | null;
  description: string;
  reviewsJson: string[];
}

function uniqueSlug(base: string, used: Set<string>): string {
  let slug = base;
  let i = 2;
  while (used.has(slug)) slug = `${base}-${i++}`;
  used.add(slug);
  return slug;
}

async function main() {
  const items: RestaurantItem[] = JSON.parse(
    fs.readFileSync(DATA_FILE, "utf-8")
  );
  console.log(`📦  Loaded ${items.length} restaurants from ${DATA_FILE}`);

  // Existing restaurants for name dedup
  const existing = await prisma.place.findMany({
    where: { type: "RESTAURANT" },
    select: { id: true, name: true, slug: true },
  });
  const existingNames = new Set(
    existing.map((e) => e.name.trim().toLowerCase())
  );
  console.log(`🗄️   Existing RESTAURANT records: ${existing.length}`);

  // All slugs across all types
  const allSlugs = await prisma.place.findMany({ select: { slug: true } });
  const usedSlugs = new Set(allSlugs.map((e) => e.slug));

  let created = 0;
  let skipped = 0;

  for (const item of items) {
    if (existingNames.has(item.name.trim().toLowerCase())) {
      console.log(`  ⏭️  Already exists: "${item.name}"`);
      skipped++;
      continue;
    }

    const slug = uniqueSlug(item.slug, usedSlugs);

    await prisma.place.create({
      data: {
        name:         item.name,
        slug,
        type:         "RESTAURANT",
        status:       "draft",
        description:  item.description,
        cuisine:      item.cuisine,
        address:      item.address,
        lat:          item.lat,
        lng:          item.lng,
        phone:        item.phone,
        website:      item.website,
        coverImage:   item.coverImage,
        rating:       item.rating,
        reviewCount:  item.reviewCount,
        openingHours: item.openingHours,
        priceRange:   item.priceRange,
        reviewsJson:  JSON.stringify(item.reviewsJson),
      },
    });

    console.log(`  ✓  [${item.cuisine}] ${item.name}`);
    created++;
  }

  console.log(
    `\n✅  Created: ${created}  |  Skipped (already exists): ${skipped}`
  );
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
