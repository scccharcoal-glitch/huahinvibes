import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchThailandNewsEn, timeAgoEn } from "@/lib/thailand-news";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Latest Thailand News — Hua Hin Vibes",
  description: "Stay updated with the latest news from Thailand — travel, lifestyle, real estate, and more.",
};

export const revalidate = 1800;

export default async function ThailandNewsPage() {
  const news = await fetchThailandNewsEn();
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
          <div className="flex gap-3 mt-4">
            <Link href="/th" className="text-sm font-semibold border border-border px-4 py-1.5 rounded-full hover:border-primary hover:text-primary transition-all">
              🇹🇭 อ่านภาษาไทย
            </Link>
            <a href="https://www.fazwaz.com/property-for-sale/thailand" target="_blank" rel="noopener noreferrer sponsored"
              className="text-sm font-semibold border border-border px-4 py-1.5 rounded-full hover:border-primary hover:text-primary transition-all"
            >
              🏠 Real Estate in Thailand
            </a>
          </div>
        </div>

        {/* Featured */}
        {featured && (
          <a href={featured.link} target="_blank" rel="noopener noreferrer"
            className="group relative block rounded-2xl overflow-hidden mb-10 h-80 md:h-[420px] bg-accent"
          >
            {featured.image && (
              <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              {featured.category && (
                <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-3">{featured.category}</span>
              )}
              <h2 className="text-white font-extrabold text-2xl md:text-3xl leading-snug mb-2 max-w-3xl">{featured.title}</h2>
              {featured.description && (
                <p className="text-white/75 text-sm line-clamp-2 max-w-2xl mb-3">{featured.description}</p>
              )}
              <p className="text-white/60 text-xs">{timeAgoEn(featured.pubDate)} · {featured.source}</p>
            </div>
          </a>
        )}

        {/* Grid */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((item, i) => (
              <a key={i} href={item.link} target="_blank" rel="noopener noreferrer"
                className="group block hover:bg-accent/40 rounded-2xl p-3 transition-colors -m-3"
              >
                <div className="relative h-48 rounded-xl overflow-hidden bg-accent mb-3">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">📰</div>
                  )}
                  {item.category && (
                    <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">{item.category}</span>
                  )}
                </div>
                <h3 className="font-bold text-base leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
                {item.description && (
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-2">{item.description}</p>
                )}
                <p className="text-xs text-muted-foreground">{timeAgoEn(item.pubDate)} · {item.source}</p>
              </a>
            ))}
          </div>
        )}

        {news.length === 0 && (
          <div className="text-center py-24 text-muted-foreground">
            <p className="text-4xl mb-4">📰</p>
            <p className="font-bold text-xl">Unable to load news right now</p>
            <p className="text-sm mt-2">Please check back shortly.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
