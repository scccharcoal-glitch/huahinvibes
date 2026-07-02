import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPlaceBySlug, getPriceNumeric } from "@/lib/places";
import { isPublicImageUrl } from "@/lib/image-url";
import { prisma } from "@/lib/prisma";
import { decodeSlug, getPlaceHref } from "@/lib/slug";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SafeImage from "@/components/SafeImage";
import { Star, MapPin, Phone, Clock, Globe, ExternalLink, MessageSquareQuote } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

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

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeSlug(slug);
  const place = await getPlaceBySlug(decodedSlug);
  if (!place) return {};
  return {
    title: place.seoTitle ?? place.name,
    description: place.seoDesc ?? place.description ?? undefined,
    alternates: { canonical: getPlaceHref(place.slug) },
  };
}

type Review = { author?: string; text: string; rating?: number };

function getTypeLabel(type: string) {
  if (type === "RESTAURANT") return "Restaurant";
  if (type === "HOTEL") return "Hotel";
  if (type === "ATTRACTION") return "Attraction";
  if (type === "REAL_ESTATE") return "Real Estate";
  return type.replace(/_/g, " ").toLowerCase();
}

function getListingHref(type: string) {
  if (type === "RESTAURANT") return "/restaurants";
  if (type === "HOTEL") return "/hotels";
  if (type === "ATTRACTION") return "/attractions";
  if (type === "REAL_ESTATE") return "/real-estate";
  return "/";
}

function getSchemaType(type: string) {
  if (type === "RESTAURANT") return "Restaurant";
  if (type === "HOTEL") return "Hotel";
  if (type === "REAL_ESTATE") return "RealEstateAgent";
  return "TouristAttraction";
}

function parseReviews(json?: string | null): Review[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, 5).map((item: unknown) => {
      if (typeof item === "string") return { text: item };
      if (typeof item === "object" && item !== null) {
        const r = item as Record<string, unknown>;
        return {
          text: String(r.text ?? ""),
          author: r.author ? String(r.author) : undefined,
          rating: typeof r.rating === "number" ? r.rating : undefined,
        };
      }
      return { text: String(item) };
    }).filter((r) => r.text.trim());
  } catch {
    return [];
  }
}

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeSlug(slug);
  const place = await getPlaceBySlug(decodedSlug);
  if (!place) notFound();

  const tags = place.tags?.split(",").filter(Boolean) ?? [];
  const typeLabel = getTypeLabel(place.type);
  const listingHref = getListingHref(place.type);
  const schemaImage = isPublicImageUrl(place.coverImage) ? place.coverImage : undefined;
  const priceText = getPriceNumeric(place.priceRange);
  const reviews = parseReviews(place.reviewsJson);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": getSchemaType(place.type),
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
    image: schemaImage,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 md:px-8 py-10">
        <div className="mb-6">
          <Breadcrumbs crumbs={[
            { label: `${typeLabel}s`, href: listingHref },
            { label: place.name },
          ]} />
        </div>

        {/* Cover image */}
        {place.coverImage && (
          <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-8">
            <SafeImage src={place.coverImage} alt={place.name} fill className="object-cover" sizes="100vw" priority />
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
            <h1 className="text-2xl md:text-4xl font-extrabold mb-3">{place.name}</h1>

            {/* Rating · Reviews · Price — one line like Google Maps */}
            <div className="flex flex-wrap items-center gap-2 mb-6 text-sm">
              {place.rating && place.rating > 0 && (
                <>
                  <span className="font-bold text-amber-500">{place.rating.toFixed(1)}</span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-4 h-4 ${s <= Math.round(place.rating!) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                    ))}
                  </div>
                  <span className="text-muted-foreground">({place.reviewCount?.toLocaleString()})</span>
                  {priceText && <span className="text-muted-foreground">·</span>}
                </>
              )}
              {priceText && (
                <span className="font-semibold text-primary">{priceText}</span>
              )}
            </div>

            {/* Description */}
            {place.description && (
              /^</.test(place.description.trim()) ? (
                <div
                  className="prose prose-sm md:prose-base max-w-none prose-headings:font-extrabold prose-a:text-primary prose-img:rounded-xl prose-img:w-full [&_table]:block [&_table]:overflow-x-auto [&_img]:max-w-full [&_*]:max-w-full break-words mb-6"
                  dangerouslySetInnerHTML={{ __html: place.description }}
                />
              ) : (
                <p className="text-muted-foreground leading-relaxed text-base mb-6 break-words">{place.description}</p>
              )
            )}

            {/* Long-form content */}
            {place.content && (
              <div className="w-full min-w-0">
                <div
                  className="prose prose-sm md:prose-base max-w-none prose-headings:font-extrabold prose-a:text-primary prose-img:rounded-xl prose-img:w-full prose-table:block prose-table:overflow-x-auto prose-pre:overflow-x-auto [&_table]:block [&_table]:overflow-x-auto [&_img]:max-w-full [&_iframe]:w-full [&_*]:max-w-full break-words"
                  dangerouslySetInnerHTML={{ __html: place.content }}
                />
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
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4 md:sticky md:top-24">

              {/* Price */}
              {priceText && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Price per person</p>
                  <p className="text-xl font-bold text-primary">{priceText}</p>
                </div>
              )}

              {/* Address */}
              {place.address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{place.address}</span>
                </div>
              )}

              {/* Phone */}
              {place.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <a href={`tel:${place.phone}`} className="text-muted-foreground hover:text-primary">{place.phone}</a>
                </div>
              )}

              {/* Hours */}
              {place.openingHours && (
                <div className="flex items-start gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground whitespace-pre-line">{place.openingHours}</span>
                </div>
              )}

              {/* Website */}
              {place.website && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-primary flex-shrink-0" />
                  <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                    Website <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Google Maps button */}
              {place.lat && place.lng && (
                <a
                  href={`https://www.google.com/maps?q=${place.lat},${place.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gradient-btn text-white w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <MapPin className="w-4 h-4" /> View on Google Maps
                </a>
              )}

              {/* Booking */}
              {place.bookingUrl && (
                <div className="space-y-2">
                  <a
                    href={place.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center border-2 border-primary text-primary w-full py-2.5 rounded-xl text-sm font-bold hover:bg-primary hover:text-white transition-all"
                  >
                    {place.type === "HOTEL" ? "Check Latest Rates & Deals" : "Reserve a Table"}
                  </a>
                  {place.type === "HOTEL" && (
                    <a
                      href={place.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center bg-primary text-white w-full py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
                    >
                      เช็กราคาล่าสุดและดีลส่วนลด
                    </a>
                  )}
                </div>
              )}

              {/* Reviews from Google Maps */}
              {reviews.length > 0 && (
                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <MessageSquareQuote className="w-3.5 h-3.5" />
                    Reviews
                  </div>
                  {reviews.map((rv, i) => (
                    <div key={i} className="bg-accent/60 rounded-xl p-3 text-xs space-y-1">
                      {rv.rating && (
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map((s) => (
                            <Star key={s} className={`w-3 h-3 ${s <= rv.rating! ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}`} />
                          ))}
                        </div>
                      )}
                      <p className="text-muted-foreground leading-relaxed italic">&ldquo;{rv.text}&rdquo;</p>
                      {rv.author && <p className="font-semibold text-foreground/70">— {rv.author}</p>}
                    </div>
                  ))}
                </div>
              )}

            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
