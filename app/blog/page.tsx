import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPlaces, BLOG_CATEGORIES } from "@/lib/places";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Calendar, Tag } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — Hua Hin Travel Guide",
  description: "Hua Hin travel guides, local tips, restaurant picks, hotel reviews, and fresh things to do around Thailand's favorite beach town.",
};

export const revalidate = 3600;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const posts = await getPlaces({ type: "BLOG", ...(category && { category }) });

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-10">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Blog</p>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Hua Hin Travel Journal</h1>
          <p className="text-muted-foreground max-w-xl">
            English travel guides, local tips, restaurant picks, hotel reviews, and fresh things to do around Hua Hin.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href="/blog"
            className={`text-sm font-semibold px-4 py-1.5 rounded-full border transition-all ${
              !category ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            All Posts
          </Link>
          {BLOG_CATEGORIES.map((c) => (
            <Link
              key={c.value}
              href={`/blog?category=${c.value}`}
              className={`text-sm font-semibold px-4 py-1.5 rounded-full border transition-all ${
                category === c.value ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {c.label}
            </Link>
          ))}
        </div>

        {/* Posts grid */}
        {posts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-xl font-bold">No posts in this category yet</p>
            <Link href="/blog" className="text-primary hover:underline text-sm mt-2 inline-block">View all posts</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const cat = BLOG_CATEGORIES.find((c) => c.value === post.category);
              return (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  {/* Cover */}
                  <div className="relative h-52 rounded-2xl overflow-hidden mb-4 bg-accent">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">📝</div>
                    )}
                    {cat && (
                      <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                        {cat.label}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <h2 className="text-lg font-extrabold mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {post.name}
                  </h2>
                  {(post.excerpt ?? post.description) && (
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                      {post.excerpt ?? post.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </span>
                    {post.tags && (
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {post.tags.split(",")[0]}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
