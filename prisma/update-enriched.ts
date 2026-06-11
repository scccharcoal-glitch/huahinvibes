/**
 * อัปเดต DB จากไฟล์ somtam-enriched.json
 * รันหลังจาก enrich-somtam.py เสร็จแล้ว
 *
 * วิธีใช้:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/update-enriched.ts
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();
const DATA_FILE = path.join(__dirname, "somtam-enriched.json");

interface EnrichedItem {
  place_id?: string | null;
  name: string;
  error?: string;
  coverImage?: string | null;
  description?: string | null;
  reviewsJson?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
}

async function main() {
  if (!fs.existsSync(DATA_FILE)) {
    console.error(`❌  ไม่พบไฟล์ ${DATA_FILE}`);
    console.error("    กรุณารัน: python3 prisma/enrich-somtam.py ก่อน");
    process.exit(1);
  }

  const items: EnrichedItem[] = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  const valid = items.filter((i) => !i.error);
  console.log(`📦  โหลด ${valid.length} รายการจาก ${DATA_FILE}`);

  // โหลด records ทั้งหมดที่ cuisine = somtam หรือ isaan
  const allPlaces = await prisma.place.findMany({
    where: { cuisine: { in: ["somtam", "isaan"] } },
    select: { id: true, name: true, googlePlaceId: true },
  });
  console.log(`🗄️   พบใน DB: ${allPlaces.length} รายการ (cuisine=somtam/isaan)`);

  // สร้าง map ชื่อ → id (lowercase เพื่อ fuzzy match)
  const nameMap = new Map<string, string>();
  for (const p of allPlaces) {
    nameMap.set(p.name.trim().toLowerCase(), p.id);
  }

  let updated = 0;
  let notFound = 0;

  for (const item of valid) {
    // หา record ใน DB — ลองตาม googlePlaceId ก่อน, ถ้าไม่ได้ให้ match ชื่อ
    let dbId: string | undefined;

    if (item.place_id) {
      const byPlaceId = await prisma.place.findFirst({
        where: { googlePlaceId: item.place_id },
        select: { id: true },
      });
      dbId = byPlaceId?.id;
    }

    if (!dbId) {
      dbId = nameMap.get(item.name.trim().toLowerCase());
    }

    if (!dbId) {
      console.log(`  ⚠️  ไม่พบใน DB: "${item.name}"`);
      notFound++;
      continue;
    }

    // สร้าง update payload — อัปเดตเฉพาะ field ที่มีข้อมูลใหม่
    const updateData: Record<string, unknown> = {};
    if (item.place_id) updateData.googlePlaceId = item.place_id;

    if (item.coverImage)           updateData.coverImage  = item.coverImage;
    if (item.description)          updateData.description = item.description;
    if (item.reviewsJson)          updateData.reviewsJson = item.reviewsJson;
    if (item.rating  != null)      updateData.rating      = item.rating;
    if (item.reviewCount != null)  updateData.reviewCount = item.reviewCount;

    await prisma.place.update({ where: { id: dbId }, data: updateData });

    const parts: string[] = [];
    if (updateData.coverImage)   parts.push("📸 รูป");
    if (updateData.description)  parts.push("📝 desc");
    if (updateData.reviewsJson)  parts.push("💬 reviews");
    if (updateData.rating)       parts.push(`⭐ ${item.rating}`);
    console.log(`  ✓  ${item.name}  — ${parts.join(" · ")}`);
    updated++;
  }

  console.log(`\n✅  อัปเดตสำเร็จ ${updated} รายการ`);
  if (notFound > 0) {
    console.log(`⚠️   ไม่พบใน DB ${notFound} รายการ`);
    console.log("    ลองตรวจสอบว่าชื่อใน Excel ตรงกับที่ import ไว้");
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
