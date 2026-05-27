/**
 * Bulk import script — อ่านข้อมูลจาก JSON แล้ว upsert เข้า DB
 *
 * วิธีใช้:
 *   1. แก้ DATA_FILE ให้ชี้ไปยังไฟล์ที่ต้องการ
 *   2. npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/import.ts
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// ---- ชี้ไฟล์ข้อมูลที่นี่ ----
const DATA_FILE = path.join(__dirname, "places-data.json");
// ----------------------------

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function makeSlug(name: string, existingSlugs: Set<string>): string {
  let base = slugify(name);
  let slug = base;
  let i = 2;
  while (existingSlugs.has(slug)) {
    slug = `${base}-${i++}`;
  }
  existingSlugs.add(slug);
  return slug;
}

// ค่า valid สำหรับแต่ละ field
const VALID = {
  type:     ["RESTAURANT", "HOTEL", "ATTRACTION", "BLOG"],
  status:   ["published", "draft"],
  area:     ["hua-hin", "khao-takiab", "cha-am", "pranburi", "khao-sam-roi-yot"],
  cuisine:  ["somtam", "thai-seafood", "thai", "indian", "italian", "japanese", "international", "bbq", "vegetarian", "cafe"],
  hotelType:["resort", "boutique", "villa", "budget"],
  category: ["beach", "temple", "market", "activity", "spa", "nature", "food-guide", "travel-tips", "hidden-gems", "lifestyle", "events", "hotel-review"],
  priceRange:["cheap", "moderate", "expensive", "luxury"],
};

async function main() {
  if (!fs.existsSync(DATA_FILE)) {
    console.error(`❌  ไม่พบไฟล์: ${DATA_FILE}`);
    console.error(`   สร้างไฟล์ places-data.json ใน /prisma/ แล้วลองใหม่`);
    process.exit(1);
  }

  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  const items: Record<string, unknown>[] = JSON.parse(raw);

  // โหลด slug ที่มีอยู่แล้วในDB เพื่อป้องกัน duplicate
  const dbSlugs = await prisma.place.findMany({ select: { slug: true } });
  const usedSlugs = new Set(dbSlugs.map((r) => r.slug));

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (let i = 0; i < items.length; i++) {
    const raw = items[i];

    // ข้าม comment rows
    if (raw["_comment"]) continue;

    const name = (raw["name"] as string)?.trim();
    if (!name) { console.warn(`  ⚠  row ${i + 1}: ไม่มี name — ข้าม`); skipped++; continue; }

    const type = raw["type"] as string;
    if (!VALID.type.includes(type)) {
      console.warn(`  ⚠  "${name}": type "${type}" ไม่ถูกต้อง — ต้องเป็น ${VALID.type.join(" | ")}`);
      skipped++; continue;
    }

    // ใช้ slug ที่กำหนดไว้ หรือ auto-generate จากชื่อ
    const slug = (raw["slug"] as string)?.trim() || makeSlug(name, usedSlugs);

    const data = {
      name,
      slug,
      type,
      status:       (raw["status"] as string)       || "draft",
      featured:     Boolean(raw["featured"])         || false,
      description:  (raw["description"] as string)  || null,
      content:      (raw["content"] as string)       || null,
      excerpt:      (raw["excerpt"] as string)       || null,
      address:      (raw["address"] as string)       || null,
      area:         (raw["area"] as string)          || null,
      lat:          raw["lat"]  != null ? Number(raw["lat"])  : null,
      lng:          raw["lng"]  != null ? Number(raw["lng"])  : null,
      googlePlaceId:(raw["googlePlaceId"] as string) || null,
      cuisine:      (raw["cuisine"] as string)       || null,
      priceRange:   (raw["priceRange"] as string)    || null,
      openingHours: (raw["openingHours"] as string)  || null,
      hotelType:    (raw["hotelType"] as string)     || null,
      starRating:   raw["starRating"] != null ? Number(raw["starRating"]) : null,
      category:     (raw["category"] as string)      || null,
      phone:        (raw["phone"] as string)         || null,
      website:      (raw["website"] as string)       || null,
      email:        (raw["email"] as string)         || null,
      bookingUrl:   (raw["bookingUrl"] as string)    || null,
      coverImage:   (raw["coverImage"] as string)    || null,
      images:       (raw["images"] as string)        || null,
      seoTitle:     (raw["seoTitle"] as string)      || null,
      seoDesc:      (raw["seoDesc"] as string)       || null,
      tags:         (raw["tags"] as string)          || null,
      rating:       raw["rating"]      != null ? Number(raw["rating"])      : 0,
      reviewCount:  raw["reviewCount"] != null ? Number(raw["reviewCount"]) : 0,
    };

    try {
      const existing = await prisma.place.findUnique({ where: { slug } });
      if (existing) {
        await prisma.place.update({ where: { slug }, data });
        console.log(`  ↺  updated: ${name}`);
        updated++;
      } else {
        await prisma.place.create({ data });
        console.log(`  ✓  created: ${name}`);
        created++;
      }
    } catch (err) {
      console.error(`  ✗  error  : ${name} —`, (err as Error).message);
      skipped++;
    }
  }

  console.log(`\n🎉  เสร็จ — created: ${created}  updated: ${updated}  skipped: ${skipped}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
