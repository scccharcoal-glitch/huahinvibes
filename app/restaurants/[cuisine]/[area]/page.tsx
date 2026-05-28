import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPlaces, CUISINES, AREAS, buildSocialProofH1, getActiveCuisines, getActiveAreas } from "@/lib/places";
import PlaceCard from "@/components/places/PlaceCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NearMeRedirect from "@/components/places/NearMeRedirect";
import Link from "next/link";
import { MapPin, UtensilsCrossed, Star, MessageCircle } from "lucide-react";

function cuisineDisplay(cuisine: { label: string; labelEn: string }) {
  return `${cuisine.label} / ${cuisine.labelEn} food`;
}

// Build params — falls back to constants if DB unavailable at build time
export async function generateStaticParams() {
  try {
    const [cuisines, areas] = await Promise.all([getActiveCuisines(), getActiveAreas()]);
    const allCuisines = [...new Set([...cuisines, ...CUISINES.map((c) => c.value)])];
    const allAreas    = [...new Set([...areas,    ...AREAS.map((a) => a.value)])];
    return allCuisines.flatMap((cuisine) => allAreas.map((area) => ({ cuisine, area })));
  } catch {
    return CUISINES.flatMap((c) => AREAS.map((a) => ({ cuisine: c.value, area: a.value })));
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cuisine: string; area: string }>;
}): Promise<Metadata> {
  const { cuisine, area } = await params;
  const cuisineInfo = CUISINES.find((c) => c.value === cuisine);
  const areaInfo    = AREAS.find((a) => a.value === area);
  const cuisineLabel = cuisineInfo?.label ?? cuisineInfo?.labelEn ?? cuisine;
  const areaLabel    = areaInfo?.label ?? area;
  const places = await getPlaces({ type: "RESTAURANT", cuisine, area });

  const avgRating    = places.reduce((s, p) => s + (p.rating ?? 0), 0) / (places.length || 1);
  const totalReviews = places.reduce((s, p) => s + (p.reviewCount ?? 0), 0);
  const h1           = buildSocialProofH1(places.length, cuisineLabel, areaLabel, avgRating, totalReviews);

  return {
    title: `${h1} — อัปเดต ${new Date().getFullYear()}`,
    description: `ค้นพบ ${places.length} ${cuisineLabel} ใน${areaLabel} ที่ดีที่สุด เรียงตามรีวิวและคะแนน อัปเดต ${new Date().getFullYear()}`,
    openGraph: {
      title: h1,
      description: `${cuisineLabel} ${areaLabel} รีวิวจากผู้ใช้จริง`,
    },
  };
}

export const revalidate = 86400;

export default async function CuisineAreaPage({
  params,
}: {
  params: Promise<{ cuisine: string; area: string }>;
}) {
  const { cuisine, area } = await params;

  const cuisineInfo = CUISINES.find((c) => c.value === cuisine);
  const areaInfo    = AREAS.find((a) => a.value === area);
  if (!cuisineInfo || !areaInfo) notFound();

  const cuisineLabel = cuisineInfo.label ?? cuisineInfo.labelEn;
  const areaLabel    = areaInfo.label;

  const places = await getPlaces({ type: "RESTAURANT", cuisine, area });

  // Calculate social proof stats
  const avgRating    = places.length
    ? places.reduce((s, p) => s + (p.rating ?? 0), 0) / places.length
    : 0;
  const totalReviews = places.reduce((s, p) => s + (p.reviewCount ?? 0), 0);
  const h1           = buildSocialProofH1(places.length, cuisineLabel, areaLabel, avgRating, totalReviews);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: h1,
    description: `${cuisineLabel} ใน${areaLabel} รีวิวดี คนชมเยอะ`,
    numberOfItems: places.length,
    itemListElement: places.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Restaurant",
        name: p.name,
        address: p.address,
        telephone: p.phone,
        aggregateRating: p.rating
          ? { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviewCount }
          : undefined,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6 flex-wrap">
          <Link href="/" className="hover:text-primary">หน้าแรก</Link>
          <span>/</span>
          <Link href="/restaurants" className="hover:text-primary">ร้านอาหาร</Link>
          <span>/</span>
          <Link href={`/restaurants?cuisine=${cuisine}`} className="hover:text-primary">{cuisineLabel}</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{areaLabel}</span>
        </nav>

        {/* Hero header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">{cuisineLabel}</span>
          </div>

          {/* Social Proof H1 */}
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
            {h1}
          </h1>

          {/* Social proof badges */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold px-3 py-1.5 rounded-full">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              เฉลี่ย {avgRating > 0 ? avgRating.toFixed(1) : "—"} คะแนน
            </div>
            <div className="flex items-center gap-1.5 bg-pink-50 border border-pink-200 text-primary text-sm font-semibold px-3 py-1.5 rounded-full">
              <MessageCircle className="w-4 h-4" />
              {totalReviews.toLocaleString()} รีวิวทั้งหมด
            </div>
            <div className="flex items-center gap-1.5 bg-muted text-muted-foreground text-sm font-medium px-3 py-1.5 rounded-full">
              <MapPin className="w-4 h-4" />
              {areaLabel}, หัวหิน
            </div>
          </div>

          {/* Near Me widget */}
          <NearMeRedirect cuisine={cuisine} currentArea={area} />
        </div>

        {/* Area chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {AREAS.map((a) => (
            <Link
              key={a.value}
              href={`/restaurants/${cuisine}/${a.value}`}
              className={`text-sm font-semibold px-4 py-1.5 rounded-full border transition-all ${
                a.value === area
                  ? "bg-primary text-white border-primary shadow-md"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {a.label}
            </Link>
          ))}
        </div>

        {/* Results */}
        {places.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <div className="text-5xl mb-2">🍽️</div>
            <p className="text-xl font-bold text-foreground">
              ยังไม่มีข้อมูล {cuisineLabel} ใน{areaLabel}
            </p>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              ระบบยังไม่มีข้อมูลในพื้นที่นี้ ลองดูพื้นที่อื่นหรือเพิ่มข้อมูลผ่าน Admin
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <Link href="/restaurants" className="gradient-btn text-white px-6 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-opacity">
                ดูร้านอาหารทั้งหมด
              </Link>
              <Link href="/admin/places/new" className="border-2 border-primary text-primary px-6 py-2.5 rounded-full text-sm font-bold hover:bg-primary hover:text-white transition-all">
                เพิ่มร้าน
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              พบ <span className="font-bold text-foreground">{places.length}</span> ร้านอาหาร · เรียงตามรีวิวและคะแนน
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          </>
        )}

        {/* Cross-link other cuisines */}
        <div className="mt-16 pt-10 border-t border-border">
          <h2 className="text-base font-bold mb-4 text-muted-foreground uppercase tracking-wider text-xs">
            ค้นหาประเภทอาหารอื่นใน {areaLabel}
          </h2>
          <div className="flex flex-wrap gap-2">
            {CUISINES.filter((c) => c.value !== cuisine).map((c) => (
              <Link
                key={c.value}
                href={`/restaurants/${c.value}/${area}`}
                className="text-sm px-4 py-2 rounded-full border border-border hover:border-primary hover:text-primary transition-all"
              >
                {cuisineDisplay(c)}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
