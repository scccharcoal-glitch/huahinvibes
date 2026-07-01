import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchThailandNewsTh, timeAgo } from "@/lib/thailand-news";

export const metadata: Metadata = {
  title: "ข่าวไทย & คู่มือหัวหิน — Hua Hin Vibes ภาษาไทย",
  description: "ข่าวสารล่าสุดจากประเทศไทย — ท่องเที่ยว ไลฟ์สไตล์ อสังหาริมทรัพย์ และคู่มือหัวหินฉบับภาษาไทย",
};

export const revalidate = 1800;

export default async function ThaiHomePage() {
  const news = await fetchThailandNewsTh();
  const featured = news[0];
  const latest = news.slice(1, 8);

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
              ค้นพบสิ่งที่ดีที่สุด<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,#b50062,#7f45a1)" }}>
                หัวหิน
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              คู่มือระดับพรีเมียมสำหรับร้านอาหาร โรงแรม และประสบการณ์ที่ดีที่สุดในหัวหิน พร้อมข่าวสารล่าสุดจากทั่วประเทศไทย
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/restaurants" className="gradient-btn text-white px-8 py-3.5 rounded-full font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/25">
                ร้านอาหารในหัวหิน
              </Link>
              <Link href="/hotels" className="border-2 border-primary text-primary px-8 py-3.5 rounded-full font-bold hover:bg-primary hover:text-white transition-all">
                โรงแรมในหัวหิน
              </Link>
              <Link href="/thailand-news" className="border-2 border-border text-muted-foreground px-8 py-3.5 rounded-full font-bold hover:border-primary hover:text-primary transition-all">
                ข่าวภาษาอังกฤษ
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Thai News */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">ข่าวสาร</p>
              <h2 className="text-2xl font-bold">ข่าวล่าสุด ภาษาไทย</h2>
            </div>
          </div>

          {featured ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Featured big card */}
              <a href={featured.link} target="_blank" rel="noopener noreferrer"
                className="lg:col-span-2 group relative block rounded-2xl overflow-hidden bg-accent min-h-[300px]"
              >
                {featured.image ? (
                  <img src={featured.image} alt={featured.title} className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {featured.category && (
                    <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-3">{featured.category}</span>
                  )}
                  <h3 className="text-white font-extrabold text-xl md:text-2xl leading-snug mb-2">{featured.title}</h3>
                  <p className="text-white/70 text-xs">{timeAgo(featured.pubDate)} · {featured.source}</p>
                </div>
              </a>

              {/* Side news list */}
              <div className="flex flex-col gap-3">
                {latest.slice(0, 5).map((item, i) => (
                  <a key={i} href={item.link} target="_blank" rel="noopener noreferrer"
                    className="group flex gap-3 hover:bg-accent/50 rounded-xl p-2 transition-colors"
                  >
                    <div className="w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-accent">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">📰</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      {item.category && <p className="text-xs font-bold text-primary mb-0.5">{item.category}</p>}
                      <p className="text-sm font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(item.pubDate)}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-4xl mb-4">📰</p>
              <p>กำลังโหลดข่าว...</p>
            </div>
          )}
        </section>

        {/* Horizontal news scroll */}
        {latest.length > 0 && (
          <section className="py-8 pb-16 bg-accent/30">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <h2 className="text-2xl font-bold mb-6">ข่าวล่าสุดทั้งหมด</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory">
                {news.map((item, i) => (
                  <a key={i} href={item.link} target="_blank" rel="noopener noreferrer"
                    className="group flex-shrink-0 w-52 snap-start block"
                  >
                    <div className="relative h-36 rounded-xl overflow-hidden bg-accent mb-2">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">📰</div>
                      )}
                      {item.category && (
                        <span className="absolute bottom-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{item.category}</span>
                      )}
                    </div>
                    <p className="text-sm font-bold line-clamp-2 leading-snug group-hover:text-primary transition-colors mb-1">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{timeAgo(item.pubDate)}</p>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Real Estate Thai */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">อสังหาริมทรัพย์ในไทย</h2>
            <a href="https://www.fazwaz.com/property-for-sale/thailand" target="_blank" rel="noopener noreferrer sponsored"
              className="text-sm font-semibold text-primary hover:underline"
            >
              ดูทั้งหมด →
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { city: "กรุงเทพฯ", area: "สุขุมวิท", href: "bangkok", img: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&q=80" },
              { city: "ภูเก็ต", area: "ป่าตอง", href: "phuket", img: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=400&q=80" },
              { city: "เชียงใหม่", area: "นิมมาน", href: "chiang-mai", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&q=80" },
              { city: "หัวหิน", area: "ถนนเพชรเกษม", href: "hua-hin", img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80" },
            ].map((loc) => (
              <a key={loc.city} href={`https://www.fazwaz.com/property-for-sale/thailand/${loc.href}`} target="_blank" rel="noopener noreferrer sponsored"
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] block"
              >
                <img src={loc.img} alt={loc.city} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
                <div className="absolute bottom-0 left-0 p-4">
                  <p className="text-white font-extrabold text-lg leading-tight">{loc.city}</p>
                  <p className="text-white/80 text-xs">{loc.area}</p>
                </div>
              </a>
            ))}
          </div>
          <div className="mt-4 text-center">
            <a href="https://www.fazwaz.com/property-for-sale/thailand" target="_blank" rel="noopener noreferrer sponsored"
              className="inline-block gradient-btn text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity"
            >
              ค้นหาอสังหาริมทรัพย์ในไทย →
            </a>
          </div>
        </section>

        {/* Quick Links Thai */}
        <section className="bg-gradient-to-r from-primary to-secondary py-14">
          <div className="max-w-7xl mx-auto px-4 md:px-8 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4">ค้นหาสิ่งที่คุณต้องการในหัวหิน</h2>
            <p className="text-white/80 mb-8">ร้านอาหาร โรงแรม และสถานที่ท่องเที่ยวในหัวหิน</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { label: "ร้านอาหารทะเล", href: "/restaurants/thai-seafood/khao-takiab" },
                { label: "รีสอร์ทหรู", href: "/hotels/resort/hua-hin" },
                { label: "ตลาดกลางคืน", href: "/attractions/market/hua-hin" },
                { label: "ร้านอาหารญี่ปุ่น", href: "/restaurants/japanese/hua-hin" },
                { label: "สปาริมหาด", href: "/attractions/spa/hua-hin" },
                { label: "ที่พักราคาประหยัด", href: "/hotels" },
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
