import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPlaces, HOTEL_TYPES, AREAS } from "@/lib/places";
import PlaceCard from "@/components/places/PlaceCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Hotel, Star, MapPin, MessageCircle } from "lucide-react";

export async function generateStaticParams() {
  return HOTEL_TYPES.flatMap((t) => AREAS.map((a) => ({ type: t.value, area: a.value })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; area: string }>;
}): Promise<Metadata> {
  const { type, area } = await params;
  const typeInfo = HOTEL_TYPES.find((t) => t.value === type);
  const areaInfo = AREAS.find((a) => a.value === area);
  if (!typeInfo || !areaInfo) return {};

  const places = await getPlaces({ type: "HOTEL", hotelType: type, area });
  const count = places.length;
  const title = `${count > 0 ? `${count} ` : ""}${typeInfo.label} in ${areaInfo.label} — Best Hotels ${new Date().getFullYear()}`;
  const description = `Find the best ${typeInfo.label.toLowerCase()} in ${areaInfo.label}, Hua Hin. Rated & reviewed by real travelers. Updated ${new Date().getFullYear()}.`;

  return {
    title,
    description,
    openGraph: { title, description },
    alternates: { canonical: `/hotels/${type}/${area}` },
  };
}

export const revalidate = 86400;

export default async function HotelTypePage({
  params,
}: {
  params: Promise<{ type: string; area: string }>;
}) {
  const { type, area } = await params;

  const typeInfo = HOTEL_TYPES.find((t) => t.value === type);
  const areaInfo = AREAS.find((a) => a.value === area);
  if (!typeInfo || !areaInfo) notFound();

  const places = await getPlaces({ type: "HOTEL", hotelType: type, area });

  const avgRating    = places.length ? places.reduce((s, p) => s + (p.rating ?? 0), 0) / places.length : 0;
  const totalReviews = places.reduce((s, p) => s + (p.reviewCount ?? 0), 0);
  const h1 = `${places.length > 0 ? `${places.length} ` : ""}Best ${typeInfo.label} in ${areaInfo.label}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: h1,
    description: `${typeInfo.label} in ${areaInfo.label}, Hua Hin`,
    numberOfItems: places.length,
    itemListElement: places.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Hotel",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6 flex-wrap">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/hotels" className="hover:text-primary">Hotels</Link>
          <span>/</span>
          <Link href={`/hotels?type=${type}`} className="hover:text-primary">{typeInfo.label}</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{areaInfo.label}</span>
        </nav>

        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Hotel className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">{typeInfo.label}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">{h1}</h1>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            {avgRating > 0 && (
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                avg {avgRating.toFixed(1)} rating
              </div>
            )}
            {totalReviews > 0 && (
              <div className="flex items-center gap-1.5 bg-pink-50 border border-pink-200 text-primary text-sm font-semibold px-3 py-1.5 rounded-full">
                <MessageCircle className="w-4 h-4" />
                {totalReviews.toLocaleString()} reviews
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-muted text-muted-foreground text-sm font-medium px-3 py-1.5 rounded-full">
              <MapPin className="w-4 h-4" />
              {areaInfo.label}, Hua Hin
            </div>
          </div>
        </div>

        {/* Area chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {AREAS.map((a) => (
            <Link
              key={a.value}
              href={`/hotels/${type}/${a.value}`}
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
            <div className="text-5xl mb-2">🏨</div>
            <p className="text-xl font-bold">No {typeInfo.label} listed in {areaInfo.label} yet</p>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Try a different area or hotel type below.
            </p>
            <Link href="/hotels" className="gradient-btn text-white px-6 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-opacity inline-block mt-2">
              Browse all hotels
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              Found <span className="font-bold text-foreground">{places.length}</span> {typeInfo.label.toLowerCase()} · sorted by rating
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          </>
        )}

        {/* Cross-links: other hotel types */}
        <div className="mt-16 pt-10 border-t border-border">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Other hotel types in {areaInfo.label}
          </h2>
          <div className="flex flex-wrap gap-2">
            {HOTEL_TYPES.filter((t) => t.value !== type).map((t) => (
              <Link
                key={t.value}
                href={`/hotels/${t.value}/${area}`}
                className="text-sm px-4 py-2 rounded-full border border-border hover:border-primary hover:text-primary transition-all"
              >
                {t.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
