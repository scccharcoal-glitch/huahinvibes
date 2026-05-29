import Link from "next/link";
import { getLatestBlogPosts, getPlaces, BLOG_CATEGORIES } from "@/lib/places";
import PlaceCard from "@/components/places/PlaceCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SearchBox from "@/components/SearchBox";
import SafeImage from "@/components/SafeImage";
import { UtensilsCrossed, Hotel, Compass, Star, MapPin, TrendingUp, Calendar } from "lucide-react";

const categories = [
  { href: "/restaurants", icon: UtensilsCrossed, label: "Restaurants", desc: "200+ dining spots", color: "bg-pink-50 text-primary" },
  { href: "/hotels", icon: Hotel, label: "Hotels", desc: "Top resorts & villas", color: "bg-purple-50 text-secondary" },
  { href: "/attractions", icon: Compass, label: "Attractions", desc: "Beaches, temples, markets", color: "bg-amber-50 text-amber-700" },
];

export default async function HomePage() {
  const [featured, latestPosts] = await Promise.all([
    getPlaces({ featured: true, limit: 6 }),
    getLatestBlogPosts(6),
  ]);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-28 text-center relative">
            <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              Thailand&apos;s Coastal Gem
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight mb-6">
              Discover the Best of<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,#b50062,#7f45a1)" }}>
                Hua Hin
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Your premium guide to restaurants, hotels, and experiences in Hua Hin — Thailand&apos;s most beloved coastal destination.
            </p>
            <div className="flex justify-center mb-8">
              <SearchBox
                size="large"
                placeholder="Search somtam lao, seafood, cafe, spa..."
                className="mx-auto"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/restaurants" className="gradient-btn text-white px-8 py-3.5 rounded-full font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/25">
                Explore Restaurants
              </Link>
              <Link href="/hotels" className="border-2 border-primary text-primary px-8 py-3.5 rounded-full font-bold hover:bg-primary hover:text-white transition-all">
                Find Hotels
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-14">
              {[
                { icon: MapPin, value: "200+", label: "Places" },
                { icon: Star, value: "4.8", label: "Avg Rating" },
                { icon: TrendingUp, value: "50K+", label: "Visitors/mo" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-extrabold text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <h2 className="text-2xl font-bold mb-8 text-center">What are you looking for?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group flex flex-col items-center p-8 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all place-card"
              >
                <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <cat.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-lg mb-1">{cat.label}</h3>
                <p className="text-sm text-muted-foreground">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Places */}
        {featured.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 pb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Editor&apos;s Pick</p>
                <h2 className="text-2xl font-bold">Featured in Hua Hin</h2>
              </div>
              <Link href="/restaurants" className="text-sm font-semibold text-primary hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          </section>
        )}

        {/* Latest Blog Posts */}
        {latestPosts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 pb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Travel Journal</p>
                <h2 className="text-2xl font-bold">บทความล่าสุด</h2>
              </div>
              <Link href="/blog" className="text-sm font-semibold text-primary hover:underline">
                ดูทั้งหมด →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post) => {
                const cat = BLOG_CATEGORIES.find((c) => c.value === post.category);
                return (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                    <div className="relative h-48 rounded-2xl overflow-hidden mb-3 bg-accent">
                      {post.coverImage ? (
                        <SafeImage
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
                          {cat.labelTh}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-base leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">
                      {post.name}
                    </h3>
                    {(post.excerpt ?? post.description) && (
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
                        {post.excerpt ?? post.description}
                      </p>
                    )}
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.createdAt).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* pSEO Quick Links */}
        <section className="bg-gradient-to-r from-primary to-secondary py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8 text-center text-white">
            <h2 className="text-3xl font-extrabold mb-4">Looking for something specific?</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Browse by cuisine, hotel type, or attraction category
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { label: "Indian Restaurant", href: "/restaurants/indian/hua-hin" },
                { label: "Thai Seafood", href: "/restaurants/thai-seafood/khao-takiab" },
                { label: "Luxury Resort", href: "/hotels/resort/hua-hin" },
                { label: "Night Market", href: "/attractions/market/hua-hin" },
                { label: "Japanese Food", href: "/restaurants/japanese/hua-hin" },
                { label: "Beach Spa", href: "/attractions/spa/hua-hin" },
              ].map((chip) => (
                <Link
                  key={chip.href}
                  href={chip.href}
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-white hover:text-primary transition-all"
                >
                  {chip.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
