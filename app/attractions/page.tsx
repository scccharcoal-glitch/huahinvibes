import { Metadata } from "next";
import { getPlaces, AREAS, ATTRACTION_CATEGORIES } from "@/lib/places";
import PlaceCard from "@/components/places/PlaceCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Attractions & Activities in Hua Hin — Best Things To Do",
  description: "Discover the top attractions in Hua Hin — beaches, temples, night markets, spas, and outdoor activities.",
};

export default async function AttractionsPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string; category?: string }>;
}) {
  const { area, category } = await searchParams;
  const places = await getPlaces({ type: "ATTRACTION", ...(area && { area }), ...(category && { category }) });

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="mb-6">
          <Breadcrumbs crumbs={[{ label: "Attractions", href: "/attractions" }]} />
        </div>
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Things To Do</p>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Attractions in Hua Hin</h1>
          <p className="text-muted-foreground">{places.length} attractions found</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-60 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Category</h3>
                <div className="space-y-1.5">
                  <Link href="/attractions" className={`block text-sm py-1.5 px-3 rounded-lg transition-colors ${!category ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-primary hover:bg-accent"}`}>
                    All Categories
                  </Link>
                  {ATTRACTION_CATEGORIES.map((c) => (
                    <Link key={c.value} href={`/attractions?category=${c.value}`} className={`block text-sm py-1.5 px-3 rounded-lg transition-colors ${category === c.value ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-primary hover:bg-accent"}`}>
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Area</h3>
                <div className="space-y-1.5">
                  {AREAS.map((a) => (
                    <Link key={a.value} href={`/attractions?area=${a.value}`} className={`block text-sm py-1.5 px-3 rounded-lg transition-colors ${area === a.value ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-primary hover:bg-accent"}`}>
                      {a.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
          <div className="flex-1">
            {places.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">No attractions found</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {places.map((place) => <PlaceCard key={place.id} place={place} />)}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
