import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  TrendingUp,
  Globe,
  Star,
  FileText,
  LayoutGrid,
  Mail,
  Users,
  Search,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Advertise with Us | Hua Hin Vibes",
  description:
    "Reach thousands of international and Thai travelers planning their Hua Hin trip. Feature your restaurant, hotel, or business on Hua Hin Vibes.",
  alternates: { canonical: "/advertise" },
};

const packages = [
  {
    icon: Star,
    title: "Featured Listing",
    description:
      "Get your business pinned at the top of search results with a prominent Featured badge. Stand out from hundreds of listings and be the first place visitors discover.",
    highlights: [
      "Featured badge on your listing",
      "Priority placement in search & category pages",
      "Enhanced photos gallery",
      "Direct booking link",
    ],
  },
  {
    icon: FileText,
    title: "Sponsored Review Article",
    description:
      "We craft a professionally written, SEO-optimized article about your business — published on Hua Hin Vibes and indexed by Google. Your story stays online permanently.",
    highlights: [
      "Professional English copywriting",
      "SEO-optimized to rank on Google",
      "Permanent article (not a time-limited ad)",
      "Shareable link for your social media",
    ],
  },
  {
    icon: LayoutGrid,
    title: "Display & Banner",
    description:
      "Place your brand in front of travelers at the exact moment they are planning their Hua Hin visit — on the homepage, category pages, or blog section.",
    highlights: [
      "Homepage & category page placements",
      "Mobile-optimized creatives",
      "Custom call-to-action link",
      "Monthly performance report",
    ],
  },
];

const stats = [
  { icon: Globe, value: "International", label: "Audience of global travelers" },
  { icon: Users, value: "Growing", label: "Monthly unique visitors" },
  { icon: Search, value: "Google SEO", label: "Organic search traffic" },
  { icon: TrendingUp, value: "Targeted", label: "Hua Hin travel intent" },
];

const reasons = [
  "Visitors come to Hua Hin Vibes with high purchase intent — they are actively planning a trip",
  "SEO-driven traffic means your listing is found at the right moment on Google",
  "International reach: English-language content targeting tourists from Europe, Asia & beyond",
  "Affordable compared to print media — with permanent online visibility",
  "Curated, trusted content that travelers rely on for recommendations",
];

export default function AdvertisePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">

        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-20 md:py-28 text-center">
            <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              Grow Your Business
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              Reach Travelers Planning Their<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,#b50062,#7f45a1)" }}>
                Hua Hin Experience
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Hua Hin Vibes is the go-to English-language guide for international and Thai travelers
              discovering the best restaurants, hotels, and attractions in Hua Hin.
              Put your business in front of the right audience at exactly the right moment.
            </p>
            <a
              href="mailto:advertise@huahinvibes.com"
              className="gradient-btn text-white px-8 py-3.5 rounded-full font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Get in Touch
            </a>
          </div>
        </section>

        {/* Audience Stats */}
        <section className="max-w-5xl mx-auto px-4 md:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center p-6 rounded-2xl border border-border bg-card">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <s.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="font-extrabold text-lg text-primary">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Advertising Options */}
        <section className="bg-accent/40 py-16">
          <div className="max-w-5xl mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Advertising Options</p>
              <h2 className="text-3xl font-extrabold">Choose How You Want to Be Featured</h2>
              <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                We offer flexible packages tailored to businesses of every size — from local eateries to luxury resorts.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div key={pkg.title} className="bg-card border border-border rounded-2xl p-6 flex flex-col">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <pkg.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-extrabold text-lg mb-2">{pkg.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">{pkg.description}</p>
                  <ul className="space-y-2 mt-auto">
                    {pkg.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Advertise */}
        <section className="max-w-5xl mx-auto px-4 md:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Why Hua Hin Vibes</p>
              <h2 className="text-3xl font-extrabold mb-6">The Smarter Way to Reach Hua Hin Visitors</h2>
              <ul className="space-y-4">
                {reasons.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">🌏</div>
              <h3 className="font-extrabold text-xl mb-3">International Audience</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our English-first content attracts travelers from the UK, Europe, Australia,
                and across Asia — visitors who spend more and seek quality recommendations before they arrive.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-primary to-secondary py-16">
          <div className="max-w-3xl mx-auto px-4 md:px-8 text-center text-white">
            <h2 className="text-3xl font-extrabold mb-4">Ready to Grow Your Business?</h2>
            <p className="text-white/80 mb-8 text-lg">
              Contact us today to discuss the best package for your business.
              No long-term commitments required to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:advertise@huahinvibes.com"
                className="bg-white text-primary px-8 py-3.5 rounded-full font-bold hover:bg-white/90 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                advertise@huahinvibes.com
              </a>
              <Link
                href="/blog"
                className="border-2 border-white text-white px-8 py-3.5 rounded-full font-bold hover:bg-white/10 transition-colors"
              >
                See Our Content
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
