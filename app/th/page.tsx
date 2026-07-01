import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SafeImage from "@/components/SafeImage";
import { getPlaces } from "@/lib/places";
import { Calendar } from "lucide-react";
import { RE_CITIES } from "@/lib/real-estate-cities";

export const metadata: Metadata = {
  title: "ข่าวไทย & คู่มือหัวหิน — Hua Hin Vibes ภาษาไทย",
  description: "ข่าวสารล่าสุดจากประเทศไทยและคู่มือหัวหินฉบับภาษาไทย",
};

export const dynamic = "force-dynamic";

export default async function ThaiHomePage() {
  const [newsEn, newsTh] = await Promise.all([
    getPlaces({ type: "BLOG", category: "thailand-news" }),
    getPlaces({ type: "BLOG", category: "thailand-news-th" }),
  ]);

  const allNews = [...newsTh, ...newsEn];
  const featured = allNews[0];
  const latest = allNews.slice(1, 9);

  return (
    <>
      <Navbar />
      <main className="flex-1">

        {/* Hero Thai */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 text-center relative">
            <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              🇹🇭 ภาษาไทย
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
              ค้นพบสิ่งที่ดีที่สุดใน<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,#b50062,#7f45a1)" }}>
                หัวหิน
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              คู่มือระดับพรีเมียมสำหรับร้านอาหาร โรงแรม และประสบการณ์ที่ดีที่สุดในหัวหิน พร้อมข่าวสารล่าสุดจากประเทศไทย
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
              <Link href="/restaurants" className="gradient-btn text-white px-8 py-3.5 rounded-full font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/25">
                ร้านอาหารในหัวหิน
              </Link>
              <Link href="/hotels" className="border-2 border-primary text-primary px-8 py-3.5 rounded-full font-bold hover:bg-primary hover:text-white transition-all">
                โรงแรมในหัวหิน
              </Link>
              <Link href="/thailand-news" className="border-2 border-border text-muted-foreground px-8 py-3.5 rounded-full font-bold hover:border-primary hover:text-primary transition-all">
                ข่าว EN
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Thai News */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">ข่าวสาร</p>
              <h2 className="text-2xl font-bold">ข่าวล่าสุด</h2>
            </div>
          </div>

          {featured ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Featured big */}
              <Link href={`/blog/${featured.slug}`}
                className="lg:col-span-2 group relative block rounded-2xl overflow-hidden bg-accent min-h-[300px]"
              >
                {featured.coverImage ? (
                  <SafeImage src={featured.coverImage} alt={featured.name} fill className="object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-300" sizes="100vw" priority />
                ) : (
                  <div className="w-full h-full absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-3">ข่าว</span>
                  <h3 className="text-white font-extrabold text-xl md:text-2xl leading-snug mb-2">{featured.name}</h3>
                  <p className="text-white/70 text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(featured.publishedAt ?? featured.createdAt).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
              </Link>

              {/* Side */}
              <div className="flex flex-col gap-3">
                {latest.slice(0, 5).map((item) => (
                  <Link key={item.id} href={`/blog/${item.slug}`}
                    className="group flex gap-3 hover:bg-accent/50 rounded-xl p-2 transition-colors"
                  >
                    <div className="relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-accent">
                      {item.coverImage ? (
                        <SafeImage src={item.coverImage} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-200" sizes="80px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">📰</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.publishedAt ?? item.createdAt).toLocaleDateString("th-TH", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-border rounded-2xl text-muted-foreground">
              <p className="text-4xl mb-4">📰</p>
              <p className="font-bold">ยังไม่มีข่าว</p>
              <p className="text-sm mt-1">เพิ่มโพสต์ที่มี category <b>ข่าวภาษาไทย</b> หรือ <b>Thailand News</b> ในแอดมิน</p>
              <Link href="/admin" className="mt-4 inline-block gradient-btn text-white px-6 py-2 rounded-full text-sm font-bold">
                ไปหน้าแอดมิน →
              </Link>
            </div>
          )}
        </section>

        {/* Horizontal scroll */}
        {latest.length > 0 && (
          <section className="py-8 pb-16 bg-accent/30">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <h2 className="text-2xl font-bold mb-6">ข่าวทั้งหมด</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory">
                {allNews.map((item) => (
                  <Link key={item.id} href={`/blog/${item.slug}`}
                    className="group flex-shrink-0 w-52 snap-start block"
                  >
                    <div className="relative h-36 rounded-xl overflow-hidden bg-accent mb-2">
                      {item.coverImage ? (
                        <SafeImage src={item.coverImage} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-200" sizes="208px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">📰</div>
                      )}
                      <span className="absolute bottom-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">ข่าว</span>
                    </div>
                    <p className="text-sm font-bold line-clamp-2 leading-snug group-hover:text-primary transition-colors mb-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.publishedAt ?? item.createdAt).toLocaleDateString("th-TH", { month: "short", day: "numeric" })}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Real Estate */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">อสังหาริมทรัพย์ในไทย</h2>
            <Link href="/real-estate" className="text-sm font-semibold text-primary hover:underline">
              คู่มือทั้งหมด →
            </Link>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2.5">
            {RE_CITIES.map((c) => (
              <Link key={c.slug} href="/real-estate" className="group block">
                <div className="relative rounded-xl overflow-hidden aspect-[3/4]">
                  <img src={c.img} alt={c.cityTh} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-1.5 text-center">
                    <p className="text-white font-extrabold text-[11px] leading-tight drop-shadow">{c.cityTh}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/real-estate"
              className="inline-block gradient-btn text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity"
            >
              ดูคู่มืออสังหาฯ ทุกจังหวัด ({RE_CITIES.length} จังหวัด) →
            </Link>
          </div>
        </section>

        {/* Quick Links */}
        <section className="bg-gradient-to-r from-primary to-secondary py-14">
          <div className="max-w-7xl mx-auto px-4 md:px-8 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4">ค้นหาในหัวหิน</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { label: "ร้านอาหารทะเล", href: "/restaurants/thai-seafood/khao-takiab" },
                { label: "รีสอร์ทหรู", href: "/hotels/resort/hua-hin" },
                { label: "ตลาดกลางคืน", href: "/attractions/market/hua-hin" },
                { label: "ร้านอาหารญี่ปุ่น", href: "/restaurants/japanese/hua-hin" },
                { label: "สปาริมหาด", href: "/attractions/spa/hua-hin" },
              ].map((chip) => (
                <Link key={chip.href} href={chip.href}
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
