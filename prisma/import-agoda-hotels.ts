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

import { Prisma, PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import { makeSlug } from "../lib/slug";

const prisma = new PrismaClient();
const DEFAULT_DATA_FILE = path.join(__dirname, "agoda-hotels.json");
const DEFAULT_AREA = "hua-hin";
const HUA_HIN_AGODA_CITY_ID = "17019";

type AgodaRawHotel = Record<string, unknown>;

function getImportFile() {
  const cliFile = process.argv[2];
  return cliFile ? path.resolve(cliFile) : DEFAULT_DATA_FILE;
}

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let quoted = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      i++;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

async function loadCsvRows(filePath: string) {
  const rows: AgodaRawHotel[] = [];
  const stream = fs.createReadStream(filePath, { encoding: "utf-8" });
  const reader = readline.createInterface({ input: stream, crlfDelay: Infinity });
  let headers: string[] | null = null;

  for await (const rawLine of reader) {
    const line = rawLine.replace(/\0/g, "");
    if (!line.trim()) continue;

    if (!headers) {
      headers = parseCsvLine(line).map((header) => header.replace(/^\uFEFF/, "").trim());
      continue;
    }

    const values = parseCsvLine(line);
    const row: AgodaRawHotel = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    if (String(row.city_id) === HUA_HIN_AGODA_CITY_ID && String(row.countryisocode).toUpperCase() === "TH") {
      rows.push(row);
    }
  }

  return rows;
}

async function loadImportRows(filePath: string) {
  if (filePath.toLowerCase().endsWith(".csv")) {
    return loadCsvRows(filePath);
  }

  const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const items: unknown = Array.isArray(raw) ? raw : raw.hotels || raw.data || raw.results || [];

  if (!Array.isArray(items)) {
    throw new Error("Agoda import file must be a CSV, an array, or an object with hotels/data/results array.");
  }

  return items as AgodaRawHotel[];
}

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

function withAgodaCid(url: string | null) {
  if (!url) return null;
  const cid = process.env.AGODA_CID;
  if (!cid || /[?&]cid=/.test(url)) return url;
  return `${url}${url.includes("?") ? "&" : "?"}cid=${encodeURIComponent(cid)}`;
}

async function main() {
  const dataFile = getImportFile();

  if (!fs.existsSync(dataFile)) {
    throw new Error(`Missing ${dataFile}. Pass your Agoda CSV path, or copy prisma/agoda-hotels.example.json to prisma/agoda-hotels.json.`);
  }

  const items = await loadImportRows(dataFile);

  console.log(`Loaded ${items.length} Hua Hin/Cha-am Agoda hotel rows from ${dataFile}`);

  const allSlugs = await prisma.place.findMany({ select: { slug: true } });
  const usedSlugs = new Set(allSlugs.map((item) => item.slug));
  const incomingAgodaIds = items
    .map((item) => text(item, ["agodaHotelId", "hotel_id", "hotelId", "id"]))
    .filter((value): value is string => Boolean(value));
  const existingAgodaRows = await prisma.place.findMany({
    where: { agodaHotelId: { in: incomingAgodaIds } },
    select: { agodaHotelId: true },
  });
  const existingAgodaIds = new Set(existingAgodaRows.map((item) => item.agodaHotelId).filter(Boolean));
  const createRows: Prisma.PlaceCreateManyInput[] = [];

  let existing = 0;
  let skipped = 0;

  for (const item of items) {
    const agodaHotelId = text(item, ["agodaHotelId", "hotel_id", "hotelId", "id"]);
    const name = text(item, ["name", "hotel_name", "hotelName", "property_name", "propertyName"]);

    if (!agodaHotelId || !name) {
      skipped++;
      continue;
    }

    if (existingAgodaIds.has(agodaHotelId)) {
      existing++;
      continue;
    }

    const address = text(item, ["address", "hotel_address", "full_address"]);
    const lat = numberValue(item, ["lat", "latitude"]);
    const lng = numberValue(item, ["lng", "lon", "longitude"]);
    const starRating = clampStarRating(intValue(item, ["starRating", "star_rating", "stars"]));
    const rating = normalizeRating(numberValue(item, ["rating", "review_score", "reviewScore", "score"]));
    const reviewCount = intValue(item, ["reviewCount", "review_count", "reviews"]);
    const coverImage = text(item, ["coverImage", "image_url", "imageUrl", "thumbnail", "photo_url"]);
    const bookingUrl = withAgodaCid(text(item, ["bookingUrl", "url", "affiliate_url", "affiliateUrl", "deeplink"]));
    const hotelType = text(item, ["hotelType", "hotel_type", "accommodation_type"]) || "hotel";
    const sourceDescription = text(item, ["description", "overview", "short_description"]);
    const description = buildDescription(name, address, starRating);
    const slug = uniqueSlug(makeSlug(name), usedSlugs);

    const data = {
      name,
      type: "hotel",
      status: "draft",
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

    createRows.push({
      ...data,
      slug,
      agodaHotelId,
    });
  }

  let created = 0;
  for (let i = 0; i < createRows.length; i += 100) {
    const chunk = createRows.slice(i, i + 100);
    const result = await prisma.place.createMany({
      data: chunk,
      skipDuplicates: true,
    });
    created += result.count;
    console.log(`Imported ${created}/${createRows.length} new hotels`);
  }

  console.log(`Done. Created: ${created}, Already existed: ${existing}, Skipped invalid: ${skipped}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
