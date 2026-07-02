import { Metadata } from "next";
import { getPlaces, CUISINES, AREAS } from "@/lib/places";
import PlaceCard from "@/components/places/PlaceCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { type Place } from "@prisma/client";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

type RestaurantSearchParams = Promise<{ cuisine?: string; area?: string; q?: string }>;

function areaLabel(area?: string) {
  if (!area) return "หัวหิน";
  return AREAS.find((a) => a.value === area)?.labelTh ?? AREAS.find((a) => a.value === area)?.label ?? area;
}

function areaLabelEn(area?: string) {
  if (!area) return "Hua Hin";
  return AREAS.find((a) => a.value === area)?.label ?? area;
}

function cuisineDisplay(cuisine: { label: string; labelEn: string }) {
  return `${cuisine.labelEn} food`;
}

function buildSearchRecommendation({
  q,
  area,
  places,
}: {
  q: string;
  area?: string;
  places: Place[];
}) {
  const location = areaLabel(area);
  const locationEn = areaLabelEn(area);
  const countText = places.length.toLocaleString("th-TH");
  const countTextEn = places.length.toLocaleString("en-US");
  const countTextZh = places.length.toLocaleString("zh-CN");
  const topPlaces = places.slice(0, 2);
  const names = topPlaces.map((place) => place.name);
  const listTextTh =
    names.length === 1
      ? names[0]
      : `${names.slice(0, -1).join(", ")} และ ${names[names.length - 1]}`;
  const listTextEn =
    names.length === 1
      ? names[0]
      : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
  const listTextZh = names.join("、");
  const bestRating = Math.max(...places.map((place) => place.rating ?? 0));
  const totalReviews = places.reduce((sum, place) => sum + (place.reviewCount ?? 0), 0);
  const totalReviewsTh = totalReviews.toLocaleString("th-TH");
  const totalReviewsEn = totalReviews.toLocaleString("en-US");
  const totalReviewsZh = totalReviews.toLocaleString("zh-CN");

  return {
    th: {
      label: "ภาษาไทย",
      title: `แนะนำ ${countText} ร้าน${q}ใน${location}`,
      intro: `ถ้ากำลังมองหา${q}ใน${location} ระบบพบ ${countText} ร้านที่น่าสนใจ ได้แก่ ${listTextTh} โดยเรียงจากร้านที่มีข้อมูลรีวิว คะแนน และรายละเอียดครบถ้วน เหมาะสำหรับใช้เลือกก่อนออกไปกินจริงในหัวหิน`,
      proof:
        bestRating > 0 || totalReviews > 0
          ? `กลุ่มร้านนี้มีคะแนนสูงสุด ${bestRating.toFixed(1)} และมีรีวิวรวม ${totalReviewsTh} รีวิว`
          : "ข้อมูลนี้อัปเดตจากร้านที่เผยแพร่ใน Hua Hin Vibes",
    },
    en: {
      label: "English",
      title: `${countTextEn} recommended ${q} restaurants in ${locationEn}`,
      intro: `Looking for ${q} in ${locationEn}? Hua Hin Vibes found ${countTextEn} useful restaurant picks, including ${listTextEn}. The list is sorted from real place data such as ratings, reviews, location details, and descriptions so you can choose more confidently before visiting.`,
      proof:
        bestRating > 0 || totalReviews > 0
          ? `The highest rating in this group is ${bestRating.toFixed(1)}, with ${totalReviewsEn} total reviews.`
          : "This recommendation is generated from published Hua Hin Vibes place data.",
    },
    zh: {
      label: "中文",
      title: `${locationEn} 推荐 ${countTextZh} 家 ${q} 餐厅`,
      intro: `如果你正在${locationEn}寻找${q}，Hua Hin Vibes 找到 ${countTextZh} 个值得参考的选择，包括 ${listTextZh}。列表会根据评分、评论、位置和店铺介绍等真实资料自动整理，方便你出发前快速比较。`,
      proof:
        bestRating > 0 || totalReviews > 0
          ? `本组店铺最高评分为 ${bestRating.toFixed(1)}，累计评论 ${totalReviewsZh} 条。`
          : "此推荐内容根据 Hua Hin Vibes 已发布的地点资料自动生成。",
    },
    topPlaces,
  };
}

function filterRestaurants(places: Place[], q?: string) {
  if (!q) return places;
  const normalizedQuery = q.toLowerCase();

  return places.filter(
    (place) =>
      place.name.toLowerCase().includes(normalizedQuery) ||
      place.description?.toLowerCase().includes(normalizedQuery) ||
      place.cuisine?.toLowerCase().includes(normalizedQuery) ||
      place.tags?.toLowerCase().includes(normalizedQuery) ||
      place.area?.toLowerCase().includes(normalizedQuery)
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: RestaurantSearchParams;
}): Promise<Metadata> {
  const { cuisine, area, q } = await searchParams;
  const areaName = area ? areaLabelEn(area) : "Hua Hin";
  const cuisineName = cuisine
    ? CUISINES.find((item) => item.value === cuisine)?.labelEn ?? CUISINES.find((item) => item.value === cuisine)?.label ?? cuisine
    : "Restaurants";
  const places = await getPlaces({
    type: "RESTAURANT",
    ...(cuisine && { cuisine }),
    ...(area && { area }),
  });
  const filtered = filterRestaurants(places, q);
  const year = new Date().getFullYear();
  const title = q
    ? `Top ${filtered.length} ${q} Restaurants in ${areaName} - Updated ${year}`
    : `${cuisineName} in ${areaName} - Best Dining Guide ${year}`;
  const description = q
    ? `Find ${filtered.length} ${q} restaurants in ${areaName}. Compare ratings, reviews, locations, and local Hua Hin Vibes recommendations. Updated ${year}.`
    : `Discover the best ${cuisineName.toLowerCase()} in ${areaName}. Browse ratings, reviews, locations, and dining recommendations from Hua Hin Vibes.`;
  const queryParams = new URLSearchParams();
  if (cuisine) queryParams.set("cuisine", cuisine);
  if (area) queryParams.set("area", area);
  if (q) queryParams.set("q", q);
  const queryString = queryParams.toString();

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    alternates: {
      canonical: queryString ? `/restaurants?${queryString}` : "/restaurants",
    },
  };
}

export default async function RestaurantsPage({
  searchParams,
}: {
  searchParams: RestaurantSearchParams;
}) {
  const { cuisine, area, q } = await searchParams;

  const places = await getPlaces({
    type: "RESTAURANT",
    ...(cuisine && { cuisine }),
    ...(area && { area }),
  });

  const filtered = filterRestaurants(places, q);
  const recommendation = q && filtered.length > 0
    ? buildSearchRecommendation({ q, area, places: filtered })
    : null;

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="mb-6">
          <Breadcrumbs crumbs={[
            { label: "Restaurants", href: "/restaurants" },
            ...(cuisine ? [{ label: CUISINES.find((c) => c.value === cuisine)?.labelEn ?? cuisine }] : []),
          ]} />
        </div>
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Dining in Hua Hin</p>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            {cuisine
              ? `${CUISINES.find((c) => c.value === cuisine)?.label ?? cuisine} Restaurants`
              : "All Restaurants"}
            {area ? ` in ${AREAS.find((a) => a.value === area)?.label ?? area}` : " in Hua Hin"}
          </h1>
          <p className="text-muted-foreground">
            Showing <span className="font-bold text-foreground">{filtered.length}</span> restaurants
            {q && ` for "${q}"`}
          </p>
          {recommendation && (
            <section className="mt-6 max-w-3xl border-l-4 border-primary bg-primary/5 px-5 py-4 rounded-r-2xl">
              {[recommendation.th, recommendation.en, recommendation.zh].map((content) => (
                <div key={content.label} className="mb-5 last:mb-0">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
                    {content.label}
                  </p>
                  <h2 className="text-xl md:text-2xl font-extrabold text-foreground mb-2">
                    {content.title}
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground leading-7 mb-3">
                    {content.intro}
                  </p>
                  <p className="text-sm font-semibold text-primary">
                    {content.proof}
                  </p>
                </div>
              ))}
              <div className="space-y-2">
                {recommendation.topPlaces.map((place, index) => (
                  <p key={place.id} className="text-sm text-muted-foreground leading-6">
                    <span className="font-bold text-foreground">{index + 1}. {place.name}</span>
                    {place.area ? ` อยู่ย่าน ${areaLabel(place.area)}` : ""}
                    {place.rating && place.rating > 0 ? ` คะแนน ${place.rating.toFixed(1)}` : ""}
                    {place.description ? ` - ${place.description}` : ""}
                  </p>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters */}
          <aside className="w-full md:w-60 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Cuisine */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Cuisine</h3>
                <div className="space-y-1.5">
                  <Link
                    href="/restaurants"
                    className={`block text-sm py-1.5 px-3 rounded-lg transition-colors ${!cuisine ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-primary hover:bg-accent"}`}
                  >
                    All Cuisines
                  </Link>
                  {CUISINES.map((c) => (
                    <Link
                      key={c.value}
                      href={`/restaurants?cuisine=${c.value}${area ? `&area=${area}` : ""}`}
                      className={`block text-sm py-1.5 px-3 rounded-lg transition-colors ${cuisine === c.value ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-primary hover:bg-accent"}`}
                    >
                      {cuisineDisplay(c)}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Area */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Area</h3>
                <div className="space-y-1.5">
                  <Link
                    href={`/restaurants${cuisine ? `?cuisine=${cuisine}` : ""}`}
                    className={`block text-sm py-1.5 px-3 rounded-lg transition-colors ${!area ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-primary hover:bg-accent"}`}
                  >
                    All Areas
                  </Link>
                  {AREAS.map((a) => (
                    <Link
                      key={a.value}
                      href={`/restaurants?area=${a.value}${cuisine ? `&cuisine=${cuisine}` : ""}`}
                      className={`block text-sm py-1.5 px-3 rounded-lg transition-colors ${area === a.value ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-primary hover:bg-accent"}`}
                    >
                      {a.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* pSEO links */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Popular Searches</h3>
                <div className="space-y-1.5">
                  {[
                    { label: "Indian in Hua Hin", href: "/restaurants/indian/hua-hin" },
                    { label: "Seafood in Khao Takiab", href: "/restaurants/thai-seafood/khao-takiab" },
                    { label: "Japanese in Hua Hin", href: "/restaurants/japanese/hua-hin" },
                    { label: "Italian in Hua Hin", href: "/restaurants/italian/hua-hin" },
                  ].map((link) => (
                    <Link key={link.href} href={link.href} className="block text-sm py-1.5 px-3 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent transition-colors">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-lg font-semibold mb-2">No restaurants found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
