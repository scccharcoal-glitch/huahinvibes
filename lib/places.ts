import { cache } from "react";
import { prisma } from "./prisma";

export type PlaceType = "RESTAURANT" | "HOTEL" | "ATTRACTION" | "BLOG";

export const AREAS = [
  { value: "hua-hin",          label: "Hua Hin",           labelTh: "หัวหิน",         lat: 12.5706, lng: 99.9576 },
  { value: "khao-takiab",      label: "Khao Takiab",       labelTh: "เขาตะเกียบ",     lat: 12.5180, lng: 99.9650 },
  { value: "cha-am",           label: "Cha-Am",            labelTh: "ชะอำ",           lat: 12.8015, lng: 99.9650 },
  { value: "pranburi",         label: "Pranburi",          labelTh: "ปราณบุรี",       lat: 12.3944, lng: 99.9132 },
  { value: "khao-sam-roi-yot", label: "Khao Sam Roi Yot",  labelTh: "เขาสามร้อยยอด", lat: 12.1800, lng: 99.9700 },
];

export const CUISINES = [
  { value: "somtam",       label: "ส้มตำ & อาหารอีสาน",   labelEn: "Som Tam & Isaan" },
  { value: "thai-seafood", label: "อาหารทะเลไทย",          labelEn: "Thai Seafood"    },
  { value: "thai",         label: "อาหารไทย",              labelEn: "Thai"            },
  { value: "indian",       label: "อาหารอินเดีย",          labelEn: "Indian"          },
  { value: "italian",      label: "อาหารอิตาเลียน",        labelEn: "Italian"         },
  { value: "japanese",     label: "อาหารญี่ปุ่น",          labelEn: "Japanese"        },
  { value: "international",label: "อาหารนานาชาติ",         labelEn: "International"   },
  { value: "bbq",          label: "บาร์บีคิว & ปิ้งย่าง",  labelEn: "BBQ & Grill"     },
  { value: "vegetarian",   label: "มังสวิรัติ",            labelEn: "Vegetarian"      },
  { value: "cafe",         label: "คาเฟ่ & เบเกอรี่",      labelEn: "Café & Bakery"   },
];

export const HOTEL_TYPES = [
  { value: "resort",   label: "Beach Resort"   },
  { value: "boutique", label: "Boutique Hotel" },
  { value: "villa",    label: "Private Villa"  },
  { value: "budget",   label: "Budget Hotel"   },
];

export const ATTRACTION_CATEGORIES = [
  { value: "beach",    label: "Beach"          },
  { value: "temple",   label: "Temple"         },
  { value: "market",   label: "Night Market"   },
  { value: "activity", label: "Activity & Sport"},
  { value: "spa",      label: "Spa & Wellness" },
  { value: "nature",   label: "Nature & Park"  },
];

export const PRICE_RANGES = [
  { value: "cheap",     label: "฿ Cheap",    symbol: "฿"    },
  { value: "moderate",  label: "฿฿ Moderate", symbol: "฿฿"   },
  { value: "expensive", label: "฿฿฿ Expensive",symbol: "฿฿฿"  },
  { value: "luxury",    label: "฿฿฿฿ Luxury", symbol: "฿฿฿฿" },
];

// --- Social proof headline generator ---
export function buildSocialProofH1(
  count: number,
  cuisineLabel: string,
  areaLabel: string,
  avgRating: number,
  totalReviews: number
): string {
  const parts: string[] = [`${count} ${cuisineLabel}`];
  if (avgRating >= 4.3) parts.push("รีวิวดี");
  if (totalReviews >= 200) parts.push("คนชมเยอะ");
  parts.push(`ใน ${areaLabel}`);
  return parts.join(" · ");
}

// --- Find nearest area by coordinates ---
export function getNearestArea(lat: number, lng: number) {
  let nearest = AREAS[0];
  let minDist = Infinity;
  for (const area of AREAS) {
    const d = Math.sqrt(Math.pow(area.lat - lat, 2) + Math.pow(area.lng - lng, 2));
    if (d < minDist) { minDist = d; nearest = area; }
  }
  return nearest;
}

// --- Dynamic cuisines from DB (for sitemap) ---
export async function getActiveCuisines(): Promise<string[]> {
  try {
    const rows = await prisma.place.findMany({
      where: { type: "RESTAURANT", status: "published", cuisine: { not: null } },
      select: { cuisine: true },
      distinct: ["cuisine"],
    });
    return rows.map((r) => r.cuisine!).filter(Boolean);
  } catch { return []; }
}

export async function getActiveAreas(): Promise<string[]> {
  try {
    const rows = await prisma.place.findMany({
      where: { status: "published", area: { not: null } },
      select: { area: true },
      distinct: ["area"],
    });
    return rows.map((r) => r.area!).filter(Boolean);
  } catch { return []; }
}

// --- Data helpers ---
export const getPlaces = cache(
  async ({
    type, area, cuisine, category, hotelType,
    status = "published", featured, limit, offset = 0,
  }: {
    type?: string; area?: string; cuisine?: string; category?: string; hotelType?: string;
    status?: string; featured?: boolean; limit?: number; offset?: number;
  } = {}) => {
    try {
      return await prisma.place.findMany({
        where: {
          ...(type && { type }),
          ...(area && { area }),
          ...(cuisine && { cuisine }),
          ...(category && { category }),
          ...(hotelType && { hotelType }),
          ...(status !== "all" && { status }),
          ...(featured !== undefined && { featured }),
        },
        orderBy: [{ featured: "desc" }, { rating: "desc" }, { createdAt: "desc" }],
        ...(limit && { take: limit }),
        skip: offset,
      });
    } catch { return []; }
  }
);

export const getPlaceBySlug = cache(async (slug: string) => {
  try { return await prisma.place.findUnique({ where: { slug } }); } catch { return null; }
});

export const getPlaceById = cache(async (id: string) => {
  try { return await prisma.place.findUnique({ where: { id } }); } catch { return null; }
});

export const getPlaceCount = cache(async (type?: string) => {
  try {
    return await prisma.place.count({
      where: { status: "published", ...(type && { type }) },
    });
  } catch { return 0; }
});

export function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function getPriceSymbol(priceRange?: string | null): string {
  return PRICE_RANGES.find((p) => p.value === priceRange)?.symbol ?? "฿฿";
}
