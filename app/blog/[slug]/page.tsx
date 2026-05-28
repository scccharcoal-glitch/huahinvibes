import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPlaceBySlug, BLOG_CATEGORIES } from "@/lib/places";
import { isPublicImageUrl } from "@/lib/image-url";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogPostActions from "@/components/blog/BlogPostActions";
import SafeImage from "@/components/SafeImage";
import { Calendar, Tag, ArrowLeft } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPlaceBySlug(slug);
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
    alternates: { canonical: `/blog/${slug}` },
  };
}

export const dynamic = "force-dynamic";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPlaceBySlug(slug);
  if (!post || post.type !== "BLOG") notFound();

  const cat = BLOG_CATEGORIES.find((c) => c.value === post.category);
  const tags = post.tags?.split(",").map((t) => t.trim()).filter(Boolean) ?? [];
  const schemaImage = isPublicImageUrl(post.coverImage) ? post.coverImage : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.name,
    description: post.excerpt ?? post.description,
    image: schemaImage,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Organization", name: "Hua Hin Vibes" },
    publisher: { "@type": "Organization", name: "Hua Hin Vibes" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 md:px-8 py-10">

        {/* Back */}
        <Link href="/blog" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

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
            {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">{post.name}</h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-lg text-muted-foreground leading-relaxed mb-6 border-l-4 border-primary pl-4">
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
          <div
            className="prose prose-sm md:prose-base max-w-none prose-headings:font-extrabold prose-a:text-primary prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : post.description ? (
          <div className="prose prose-sm md:prose-base max-w-none">
            <p>{post.description}</p>
          </div>
        ) : null}

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
