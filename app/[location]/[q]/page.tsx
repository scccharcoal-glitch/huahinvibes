import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Search, Star, MessageCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PlaceCard from "@/components/places/PlaceCard";
import {
  AREAS,
  getCachedData,
  getProgrammaticSeoLocations,
  getProgrammaticSeoQueries,
} from "@/lib/places";
import { getPlaceHref } from "@/lib/slug";

type PageParams = Promise<{ location: string; q: string }>;

const STATIC_PARAMS_LIMIT = 500;

function formatParam(value: string) {
  return decodeURIComponent(value).replace(/-/g, " ").trim();
}

function locationLabel(location: string) {
  const normalized = location.toLowerCase().replace(/\s+/g, "-");
  const area = AREAS.find((item) => item.value === normalized);
  return area?.label ?? formatParam(location);
}

export const revalidate = 86400;

export async function generateStaticParams() {
  const [locations, queries] = await Promise.all([
    getProgrammaticSeoLocations(),
    getProgrammaticSeoQueries(),
  ]);

  const params = locations
    .map((location) => queries.map((q) => ({ location, q })))
    .flat();

  // If this grows to thousands of URLs, keep the build fast by pre-rendering
  // only the strongest pages. The rest will be rendered and cached on first visit.
  return params.slice(0, STATIC_PARAMS_LIMIT);
}

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const { location, q } = await params;
  const qDecoded = formatParam(q);
  const locationDecoded = locationLabel(location);
  const results = await getCachedData(qDecoded, locationDecoded);
  const year = new Date().getFullYear();
  const title = `Top ${results.length} ${qDecoded} near ${locationDecoded} - Updated ${year}`;
  const description = `Find ${results.length} ${qDecoded} near ${locationDecoded}. Browse ratings, reviews, locations, and local picks from Hua Hin Vibes. Updated ${year}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    alternates: {
      canonical: `/${encodeURIComponent(location)}/${encodeURIComponent(q)}`,
    },
  };
}

export default async function ProgrammaticSeoPage({
  params,
}: {
  params: PageParams;
}) {
  const { location, q } = await params;
  const qDecoded = formatParam(q);
  const locationDecoded = locationLabel(location);
  const results = await getCachedData(qDecoded, locationDecoded);
  const avgRating = results.length
    ? results.reduce((sum, place) => sum + (place.rating ?? 0), 0) / results.length
    : 0;
  const totalReviews = results.reduce((sum, place) => sum + (place.reviewCount ?? 0), 0);
  const h1 = `Top ${results.length} ${qDecoded} near ${locationDecoded}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: h1,
    numberOfItems: results.length,
    itemListElement: results.map((place, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": place.type === "HOTEL" ? "Hotel" : place.type === "RESTAURANT" ? "Restaurant" : "LocalBusiness",
        name: place.name,
        address: place.address,
        telephone: place.phone,
        url: getPlaceHref(place.slug),
        aggregateRating: place.rating
          ? {
              "@type": "AggregateRating",
              ratingValue: place.rating,
              reviewCount: place.reviewCount,
            }
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
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6 flex-wrap">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{locationDecoded}</span>
          <span>/</span>
          <span className="text-foreground font-medium">{qDecoded}</span>
        </nav>

        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Hua Hin local search
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
            {h1}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
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
              {locationDecoded}
            </div>
          </div>
        </section>

        {results.length === 0 ? (
          <section className="text-center py-24 space-y-4">
            <p className="text-xl font-bold text-foreground">
              No {qDecoded} found near {locationDecoded} yet
            </p>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Add matching published places in Admin, or use Google Place ID auto-fill to enrich this landing page.
            </p>
            <Link
              href="/admin/places/new"
              className="gradient-btn text-white px-6 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-opacity inline-block"
            >
              Add a place
            </Link>
          </section>
        ) : (
          <section>
            <p className="text-sm text-muted-foreground mb-6">
              Found <span className="font-bold text-foreground">{results.length}</span> local results · sorted by rating and reviews
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
