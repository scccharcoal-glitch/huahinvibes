import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Home, TrendingUp, ArrowRight, BookOpen } from "lucide-react";
import { RE_CITIES } from "@/lib/real-estate-cities";

export const metadata: Metadata = {
  title: "Real Estate in Thailand — Hua Hin Vibes",
  description: "คู่มืออสังหาริมทรัพย์ไทย 17 จังหวัด — หัวหิน กรุงเทพฯ ภูเก็ต เชียงใหม่ พัทยา ชลบุรี กระบี่ พังงา และอีกมากมาย",
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
              🏠 อสังหาริมทรัพย์ไทย
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
              Real Estate in Thailand
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              คู่มือซื้ออสังหาริมทรัพย์ครบ {RE_CITIES.length} จังหวัดในประเทศไทย —
              วิลล่า คอนโด บ้านเดี่ยว และที่ดิน พร้อมข้อมูลราคาและทำเลแนะนำ
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {RE_CITIES.map((c) => (
                <span key={c.slug} className="bg-card border border-border px-3 py-1 rounded-full text-sm text-muted-foreground">
                  {c.cityTh}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-wrap gap-6 justify-center md:justify-start text-sm">
            {[
              { icon: Home,      label: `${RE_CITIES.length} จังหวัดทั่วไทย` },
              { icon: TrendingUp,label: "Yield 4–10% ต่อปี" },
              { icon: BookOpen,  label: "คู่มือเชิงลึกแต่ละจังหวัด" },
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
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">เลือกจังหวัด</p>
              <h2 className="text-2xl font-bold">คู่มืออสังหาฯ แต่ละจังหวัด</h2>
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
                    alt={c.cityTh}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <p className="text-white font-extrabold text-xl drop-shadow">{c.cityTh}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground mb-3">{c.tagline}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:gap-2 transition-all">
                    อ่านคู่มือ <ArrowRight className="w-3 h-3" />
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
              สนใจลงทุนอสังหาริมทรัพย์ในไทย?
            </h2>
            <p className="text-white/80 mb-6">
              อ่านคู่มือแต่ละจังหวัด — ข้อมูลราคา ทำเล และโครงการแนะนำ
            </p>
            <Link
              href="/real-estate"
              className="inline-block bg-white text-primary font-extrabold px-10 py-4 rounded-full hover:bg-white/90 transition-colors shadow-xl"
            >
              ดูคู่มือทุกจังหวัด →
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
