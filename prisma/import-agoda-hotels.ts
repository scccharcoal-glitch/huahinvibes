/**
 * Import Hua Hin hotels from an Agoda partner JSON export.
 *
 * Usage:
 *   npm run import:agoda:hotels
 *
 * Put your Agoda data in:
 *   prisma/agoda-hotels.json
 *
 * The importer is intentionally conservative:
 * - imported hotels are drafts by default
 * - agodaHotelId is used to update existing rows instead of creating duplicates
 * - descriptions are rewritten locally from available facts instead of copying Agoda text verbatim
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { makeSlug } from "../lib/slug";

const prisma = new PrismaClient();
const DATA_FILE = path.join(__dirname, "agoda-hotels.json");
const DEFAULT_AREA = "hua-hin";

type AgodaRawHotel = Record<string, unknown>;

function text(item: AgodaRawHotel, keys: string[]) {
  for (const key of keys) {
    const value = item[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return null;
}

function numberValue(item: AgodaRawHotel, keys: string[]) {
  const raw = text(item, keys);
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function intValue(item: AgodaRawHotel, keys: string[]) {
  const parsed = numberValue(item, keys);
  return parsed === null ? null : Math.round(parsed);
}

function clampStarRating(value: number | null) {
  if (value === null) return null;
  return Math.max(1, Math.min(5, value));
}

function normalizeRating(value: number | null) {
  if (value === null) return null;
  return value > 5 ? Math.round((value / 2) * 10) / 10 : value;
}

function uniqueSlug(base: string, used: Set<string>) {
  let slug = base;
  let i = 2;
  while (used.has(slug)) {
    slug = `${base}-${i++}`;
  }
  used.add(slug);
  return slug;
}

function buildDescription(name: string, address: string | null, starRating: number | null) {
  const parts = [
    `${name} is a hotel in Hua Hin for travelers who want a comfortable base near the coast, restaurants, and local attractions.`,
  ];

  if (address) {
    parts.push(`The property is located around ${address}, making it useful for planning beach days, food stops, and relaxed Hua Hin trips.`);
  }

  if (starRating) {
    parts.push(`It is listed as a ${starRating}-star stay, so it can work well for guests comparing comfort, location, and value before booking.`);
  }

  return parts.join(" ");
}

async function main() {
  if (!fs.existsSync(DATA_FILE)) {
    throw new Error(`Missing ${DATA_FILE}. Copy prisma/agoda-hotels.example.json to prisma/agoda-hotels.json and paste your Agoda export there.`);
  }

  const raw = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  const items: AgodaRawHotel[] = Array.isArray(raw) ? raw : raw.hotels || raw.data || raw.results || [];

  if (!Array.isArray(items)) {
    throw new Error("Agoda import file must be an array, or an object with hotels/data/results array.");
  }

  console.log(`Loaded ${items.length} Agoda hotel rows`);

  const allSlugs = await prisma.place.findMany({ select: { slug: true } });
  const usedSlugs = new Set(allSlugs.map((item) => item.slug));

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const item of items) {
    const agodaHotelId = text(item, ["agodaHotelId", "hotel_id", "hotelId", "id"]);
    const name = text(item, ["name", "hotel_name", "hotelName", "property_name", "propertyName"]);

    if (!agodaHotelId || !name) {
      skipped++;
      continue;
    }

    const address = text(item, ["address", "hotel_address", "full_address"]);
    const lat = numberValue(item, ["lat", "latitude"]);
    const lng = numberValue(item, ["lng", "lon", "longitude"]);
    const starRating = clampStarRating(intValue(item, ["starRating", "star_rating", "stars"]));
    const rating = normalizeRating(numberValue(item, ["rating", "review_score", "reviewScore", "score"]));
    const reviewCount = intValue(item, ["reviewCount", "review_count", "reviews"]);
    const coverImage = text(item, ["coverImage", "image_url", "imageUrl", "thumbnail", "photo_url"]);
    const bookingUrl = text(item, ["bookingUrl", "url", "affiliate_url", "affiliateUrl", "deeplink"]);
    const hotelType = text(item, ["hotelType", "hotel_type", "accommodation_type"]) || "hotel";
    const sourceDescription = text(item, ["description", "overview", "short_description"]);
    const description = buildDescription(name, address, starRating);
    const slug = uniqueSlug(makeSlug(name), usedSlugs);

    const existing = await prisma.place.findUnique({ where: { agodaHotelId } });
    const data = {
      name,
      type: "hotel",
      status: existing?.status || "draft",
      area: DEFAULT_AREA,
      address,
      lat,
      lng,
      hotelType,
      starRating,
      rating,
      reviewCount,
      coverImage,
      bookingUrl,
      website: bookingUrl,
      description,
      excerpt: sourceDescription ? sourceDescription.slice(0, 180) : description.slice(0, 180),
      seoTitle: `${name} - Hotel in Hua Hin`,
      seoDesc: `${name} in Hua Hin. Compare location, highlights, rating, and booking details for your next Hua Hin stay.`,
      tags: "hua hin hotel,hotel,agoda,accommodation",
    };

    if (existing) {
      await prisma.place.update({
        where: { agodaHotelId },
        data,
      });
      updated++;
    } else {
      await prisma.place.create({
        data: {
          ...data,
          slug,
          agodaHotelId,
        },
      });
      created++;
    }
  }

  console.log(`Done. Created: ${created}, Updated: ${updated}, Skipped: ${skipped}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
