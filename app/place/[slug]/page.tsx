import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPlaceBySlug, getPriceSymbol } from "@/lib/places";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Star, MapPin, Phone, Clock, Globe, ExternalLink } from "lucide-react";

export async function generateStaticParams() {
  try {
    const places = await prisma.place.findMany({
      where: { status: "published" },
      select: { slug: true },
    });
    return places.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);
  if (!place) return {};
  return {
    title: place.seoTitle ?? place.name,
    description: place.seoDesc ?? place.description ?? undefined,
  };
}

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);
  if (!place) notFound();

  const tags = place.tags?.split(",").filter(Boolean) ?? [];
  const typeLabel = place.type === "RESTAURANT" ? "Restaurant" : place.type === "HOTEL" ? "Hotel" : "Attraction";
  const listingHref = `/${place.type.toLowerCase()}s`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": place.type === "RESTAURANT" ? "Restaurant" : place.type === "HOTEL" ? "Hotel" : "TouristAttraction",
    name: place.name,
    description: place.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: place.address,
      addressLocality: "Hua Hin",
      addressCountry: "TH",
    },
    telephone: place.phone,
    url: place.website,
    aggregateRating: place.rating && place.rating > 0
      ? { "@type": "AggregateRating", ratingValue: place.rating, reviewCount: place.reviewCount }
      : undefined,
    image: place.coverImage,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 md:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href={listingHref} className="hover:text-primary capitalize">{typeLabel}s</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{place.name}</span>
        </nav>

        {/* Cover image */}
        {place.coverImage && (
          <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-8">
            <Image src={place.coverImage} alt={place.name} fill className="object-cover" sizes="100vw" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">{typeLabel}</span>
              {place.featured && (
                <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">⭐ Featured</span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3">{place.name}</h1>

            {place.rating && place.rating > 0 && (
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${s <= Math.round(place.rating!) ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                  ))}
                </div>
                <span className="font-bold text-sm">{place.rating.toFixed(1)}</span>
                <span className="text-muted-foreground text-sm">({place.reviewCount?.toLocaleString()} reviews)</span>
              </div>
            )}

            {place.description && (
              <p className="text-muted-foreground leading-relaxed text-base mb-6">{place.description}</p>
            )}

            {place.content && (
              <div className="text-foreground leading-relaxed space-y-4">
                {place.content.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {tags.map((tag) => (
                  <span key={tag} className="bg-accent text-muted-foreground text-xs font-medium px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Info sidebar */}
          <aside>
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4 sticky top-24">
              {place.priceRange && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Price</p>
                  <p className="text-2xl font-bold text-primary">{getPriceSymbol(place.priceRange)}<span className="text-sm font-normal text-muted-foreground"> / person</span></p>
                </div>
              )}

              {place.address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{place.address}</span>
                </div>
              )}

              {place.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <a href={`tel:${place.phone}`} className="text-muted-foreground hover:text-primary">{place.phone}</a>
                </div>
              )}

              {place.openingHours && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{place.openingHours}</span>
                </div>
              )}

              {place.website && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-primary flex-shrink-0" />
                  <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                    Website <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Map */}
              {place.lat && place.lng && (
                <a
                  href={`https://www.google.com/maps?q=${place.lat},${place.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gradient-btn text-white w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mt-2"
                >
                  <MapPin className="w-4 h-4" /> View on Google Maps
                </a>
              )}

              {place.bookingUrl && (
                <a
                  href={place.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center border-2 border-primary text-primary w-full py-3 rounded-xl text-sm font-bold hover:bg-primary hover:text-white transition-all"
                >
                  {place.type === "HOTEL" ? "Book Now" : "Reserve a Table"}
                </a>
              )}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
