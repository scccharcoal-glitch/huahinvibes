import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SafeImage from "@/components/SafeImage";
import { getPlaces } from "@/lib/places";
import { Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Latest Thailand News — Hua Hin Vibes",
  description: "Stay updated with the latest news from Thailand — travel, lifestyle, real estate, and more.",
};

export const dynamic = "force-dynamic";

export default async function ThailandNewsPage() {
  const news = await getPlaces({ type: "BLOG", category: "thailand-news" });
  const featured = news[0];
  const rest = news.slice(1);

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Thailand</p>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Latest Thailand News</h1>
          <p className="text-muted-foreground">Up-to-date news from Thailand — travel, lifestyle, property & more.</p>
          <div className="flex gap-3 mt-4 flex-wrap">
            <Link href="/th" className="text-sm font-semibold border border-border px-4 py-1.5 rounded-full hover:border-primary hover:text-primary transition-all">
              🇹🇭 Read in Thai
            </Link>
            <Link href="/real-estate"
              className="text-sm font-semibold border border-border px-4 py-1.5 rounded-full hover:border-primary hover:text-primary transition-all"
            >
              🏠 Real Estate in Thailand
            </Link>
          </div>
        </div>

        {/* Featured */}
        {featured && (
          <Link href={`/blog/${featured.slug}`}
            className="group relative block rounded-2xl overflow-hidden mb-10 h-80 md:h-[420px] bg-accent"
          >
            {featured.coverImage && (
              <SafeImage src={featured.coverImage} alt={featured.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="100vw" priority />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-3">Thailand News</span>
              <h2 className="text-white font-extrabold text-2xl md:text-3xl leading-snug mb-2 max-w-3xl">{featured.name}</h2>
              {(featured.excerpt ?? featured.description) && (
                <p className="text-white/75 text-sm line-clamp-2 max-w-2xl mb-3">{featured.excerpt ?? featured.description}</p>
              )}
              <p className="text-white/60 text-xs flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(featured.publishedAt ?? featured.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </Link>
        )}

        {/* Grid */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((item) => (
              <Link key={item.id} href={`/blog/${item.slug}`}
                className="group block hover:bg-accent/40 rounded-2xl p-3 transition-colors -m-3"
              >
                <div className="relative h-48 rounded-xl overflow-hidden bg-accent mb-3">
                  {item.coverImage ? (
                    <SafeImage src={item.coverImage} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-200" sizes="(max-width: 768px) 100vw, 33vw" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">📰</div>
                  )}
                  <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">Thailand News</span>
                </div>
                <h3 className="font-bold text-base leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">{item.name}</h3>
                {(item.excerpt ?? item.description) && (
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-2">{item.excerpt ?? item.description}</p>
                )}
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.publishedAt ?? item.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </Link>
            ))}
          </div>
        )}

        {news.length === 0 && (
          <div className="text-center py-24 text-muted-foreground">
            <p className="text-4xl mb-4">📰</p>
            <p className="font-bold text-xl">No Thailand News posts yet</p>
            <p className="text-sm mt-2">Add posts with category <b>Thailand News</b> in the admin panel.</p>
            <Link href="/admin" className="mt-4 inline-block gradient-btn text-white px-6 py-2 rounded-full text-sm font-bold">
              Go to Admin →
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
