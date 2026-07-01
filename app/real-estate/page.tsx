import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Home, TrendingUp, ArrowRight, BookOpen } from "lucide-react";
import { RE_CITIES } from "@/lib/real-estate-cities";

export const metadata: Metadata = {
  title: "Real Estate in Thailand — Hua Hin Vibes",
  description: "Thailand property guide for 17 provinces — Hua Hin, Bangkok, Phuket, Chiang Mai, Pattaya, Chonburi, Krabi, Phang Nga and more.",
};

export default function RealEstatePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">

        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 text-center">
            <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              🏠 Real Estate
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
              Real Estate in Thailand
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Complete property guides for {RE_CITIES.length} provinces across Thailand —
              villas, condos, houses, and land with pricing insights and location tips.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {RE_CITIES.map((c) => (
                <span key={c.slug} className="bg-card border border-border px-3 py-1 rounded-full text-sm text-muted-foreground">
                  {c.city}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-wrap gap-6 justify-center md:justify-start text-sm">
            {[
              { icon: Home,      label: `${RE_CITIES.length} Provinces` },
              { icon: TrendingUp,label: "4–10% Yield per year" },
              { icon: BookOpen,  label: "In-depth guide per province" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-muted-foreground">
                <s.icon className="w-4 h-4 text-primary" />
                <span className="font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* City grid */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 pb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Choose a Province</p>
              <h2 className="text-2xl font-bold">Property Guide by Province</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {RE_CITIES.map((c) => (
              <Link
                key={c.slug}
                href={`/blog/${c.slug}`}
                className="group block rounded-2xl overflow-hidden border border-border bg-card hover:shadow-lg hover:border-primary/30 transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={c.img}
                    alt={c.city}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <p className="text-white font-extrabold text-xl drop-shadow">{c.city}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground mb-3">{c.tagline}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:gap-2 transition-all">
                    Read guide <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-primary to-secondary py-14">
          <div className="max-w-4xl mx-auto px-4 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
              Interested in Thai Property Investment?
            </h2>
            <p className="text-white/80 mb-6">
              Read our province guides — pricing, location insights, and top projects.
            </p>
            <Link
              href="/real-estate"
              className="inline-block bg-white text-primary font-extrabold px-10 py-4 rounded-full hover:bg-white/90 transition-colors shadow-xl"
            >
              Browse All Provinces →
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
