import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import { getPlaceBySlug, BLOG_CATEGORIES, getPriceNumeric } from "@/lib/places";
import { prisma } from "@/lib/prisma";
import { isPublicImageUrl } from "@/lib/image-url";
import { decodeSlug, getBlogHref, getPlaceHref } from "@/lib/slug";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogPostActions from "@/components/blog/BlogPostActions";
import SafeImage from "@/components/SafeImage";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Calendar, Tag } from "lucide-react";
import RankedPlacesMap from "@/components/blog/RankedPlacesMapClient";

const BLOG_SLUG_REDIRECTS: Record<string, string> = {
  "ตลาดโต้รุ่ง-หัวหิน": "talad-to-rung-hua-hin",
};

function getCanonicalBlogSlug(slug: string) {
  const decoded = decodeSlug(slug);
  return BLOG_SLUG_REDIRECTS[decoded] ?? decoded;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const canonicalSlug = getCanonicalBlogSlug(slug);
  const post = await getPlaceBySlug(canonicalSlug);
  if (!post) return {};
  const ogImage = isPublicImageUrl(post.coverImage) ? post.coverImage : undefined;

  return {
    title: post.seoTitle ?? post.name,
    description: post.seoDesc ?? post.excerpt ?? post.description ?? undefined,
    openGraph: {
      title: post.seoTitle ?? post.name,
      description: post.seoDesc ?? post.excerpt ?? undefined,
      images: ogImage ? [ogImage] : [],
      type: "article",
    },
    alternates: { canonical: getBlogHref(canonicalSlug) },
  };
}

export const dynamic = "force-dynamic";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const canonicalSlug = getCanonicalBlogSlug(slug);
  if (canonicalSlug !== decodeSlug(slug)) permanentRedirect(getBlogHref(canonicalSlug));

  const post = await getPlaceBySlug(canonicalSlug);
  if (!post || post.type !== "BLOG") notFound();

  const cat = BLOG_CATEGORIES.find((c) => c.value === post.category);
  const tags = post.tags?.split(",").map((t) => t.trim()).filter(Boolean) ?? [];
  const schemaImage = isPublicImageUrl(post.coverImage) ? post.coverImage : undefined;

  // Ranked Places (listicle)
  type LinkedItem = { slug: string; review: string };
  let rankedPlaces: (Awaited<ReturnType<typeof prisma.place.findUnique>> & { review: string })[] = [];
  if (post.linkedPlaces) {
    try {
      const items: LinkedItem[] = JSON.parse(post.linkedPlaces);
      const fetched = await Promise.all(
        items.map(async (item) => {
          const place = await prisma.place.findUnique({ where: { slug: item.slug } });
          return place ? { ...place, review: item.review } : null;
        })
      );
      rankedPlaces = fetched.filter(Boolean) as typeof rankedPlaces;
    } catch { /* invalid JSON */ }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.name,
    description: post.excerpt ?? post.description,
    image: schemaImage,
    datePublished: (post.publishedAt ?? post.createdAt).toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Organization", name: "Hua Hin Vibes" },
    publisher: { "@type": "Organization", name: "Hua Hin Vibes" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 md:px-8 py-10">

        <div className="mb-6">
          <Breadcrumbs crumbs={[
            { label: "Blog", href: "/blog" },
            ...(cat ? [{ label: cat.label, href: `/blog?category=${cat.value}` }] : []),
            { label: post.name },
          ]} />
        </div>

        <BlogPostActions postId={post.id} postName={post.name} />

        {/* Category + date */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {cat && (
            <Link href={`/blog?category=${cat.value}`} className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-all">
              {cat.label}
            </Link>
          )}
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-4xl font-extrabold mb-4 leading-tight">{post.name}</h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6 border-l-4 border-primary pl-4">
            {post.excerpt}
          </p>
        )}

        {/* Cover image */}
        {post.coverImage && (
          <div className="relative h-72 md:h-[420px] rounded-2xl overflow-hidden mb-10">
            <SafeImage
              src={post.coverImage}
              alt={post.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        )}

        {/* Rich text content */}
        {post.content ? (
          <div className="w-full min-w-0">
            <div
              className="prose prose-sm md:prose-base max-w-none
                prose-headings:font-extrabold prose-headings:leading-tight
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:w-full prose-img:h-auto
                prose-table:block prose-table:w-full prose-table:overflow-x-auto
                prose-pre:overflow-x-auto prose-pre:text-xs md:prose-pre:text-sm
                prose-code:text-xs md:prose-code:text-sm prose-code:break-words
                [&_table]:block [&_table]:overflow-x-auto [&_table]:w-full
                [&_img]:max-w-full [&_img]:h-auto
                [&_iframe]:w-full [&_iframe]:max-w-full
                [&_*]:max-w-full break-words"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        ) : post.description ? (
          <div className="prose prose-sm md:prose-base max-w-none break-words">
            <p>{post.description}</p>
          </div>
        ) : null}

        {/* Ranked Places */}
        {rankedPlaces.length > 0 && (
          <div className="mt-10 space-y-8">
            <h2 className="text-2xl font-extrabold border-b border-border pb-3">Rankings</h2>

            {/* Map — show only if places have coordinates */}
            {rankedPlaces.some((p) => p.lat && p.lng) && (
              <RankedPlacesMap
                places={rankedPlaces
                  .filter((p) => p.lat && p.lng)
                  .map((p, i) => ({
                    id: p.id,
                    name: p.name,
                    slug: p.slug,
                    lat: p.lat!,
                    lng: p.lng!,
                    rank: i + 1,
                    rating: p.rating,
                  }))}
              />
            )}
            {rankedPlaces.map((place, i) => (
              <div key={place.id} className="flex flex-col md:flex-row gap-5 bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                {/* Rank badge */}
                <div className="relative md:w-64 h-48 md:h-auto flex-shrink-0">
                  {place.coverImage && isPublicImageUrl(place.coverImage) ? (
                    <SafeImage src={place.coverImage} alt={place.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 256px" />
                  ) : (
                    <div className="w-full h-full bg-accent flex items-center justify-center text-4xl">🏨</div>
                  )}
                  <span className="absolute top-3 left-3 w-9 h-9 rounded-full bg-primary text-white text-base font-extrabold flex items-center justify-center shadow-lg">
                    {i + 1}
                  </span>
                </div>
                {/* Info */}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{place.type}</span>
                      {place.rating && place.rating > 0 && (
                        <span className="flex items-center gap-1 text-amber-500 text-xs font-bold">⭐ {place.rating.toFixed(1)}</span>
                      )}
                      {place.priceRange && (
                        <span className="text-xs text-primary font-semibold">{getPriceNumeric(place.priceRange)}</span>
                      )}
                    </div>
                    <h3 className="text-lg font-extrabold mb-2 leading-snug">{place.name}</h3>
                    {place.review && (
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{place.review}</p>
                    )}
                    {place.description && !place.review && (
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">{place.description}</p>
                    )}
                  </div>
                  <a
                    href={getPlaceHref(place.slug)}
                    className="gradient-btn text-white text-sm font-bold px-5 py-2 rounded-xl hover:opacity-90 transition-opacity w-fit"
                  >
                    View Details →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border">
            <Tag className="w-4 h-4 text-muted-foreground mt-0.5" />
            {tags.map((tag) => (
              <span key={tag} className="bg-accent text-muted-foreground text-xs font-medium px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-2xl text-center">
          <p className="font-bold text-lg mb-2">Discover restaurants and hotels in Hua Hin</p>
          <p className="text-muted-foreground text-sm mb-4">Explore curated local places from Hua Hin Vibes.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/restaurants" className="gradient-btn text-white px-5 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-opacity">
              Restaurants
            </Link>
            <Link href="/hotels" className="border-2 border-primary text-primary px-5 py-2 rounded-full text-sm font-bold hover:bg-primary hover:text-white transition-all">
              Hotels
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
