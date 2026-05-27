import { Metadata } from "next";
import { getPlaces, CUISINES, AREAS } from "@/lib/places";
import PlaceCard from "@/components/places/PlaceCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Restaurants in Hua Hin — Best Dining Guide",
  description: "Discover the best restaurants in Hua Hin. From Thai seafood to Indian, Italian, and Japanese cuisine. Updated reviews and ratings.",
};

export default async function RestaurantsPage({
  searchParams,
}: {
  searchParams: Promise<{ cuisine?: string; area?: string; q?: string }>;
}) {
  const { cuisine, area, q } = await searchParams;

  const places = await getPlaces({
    type: "RESTAURANT",
    ...(cuisine && { cuisine }),
    ...(area && { area }),
  });

  const filtered = q
    ? places.filter(
        (p) =>
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.cuisine?.includes(q.toLowerCase()) ||
          p.tags?.includes(q.toLowerCase()) ||
          p.area?.includes(q.toLowerCase())
      )
    : places;

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Dining in Hua Hin</p>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            {cuisine
              ? `${CUISINES.find((c) => c.value === cuisine)?.label ?? cuisine} Restaurants`
              : "All Restaurants"}
            {area ? ` in ${AREAS.find((a) => a.value === area)?.label ?? area}` : " in Hua Hin"}
          </h1>
          <p className="text-muted-foreground">
            Showing <span className="font-bold text-foreground">{filtered.length}</span> restaurants
            {q && ` for "${q}"`}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters */}
          <aside className="w-full md:w-60 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Cuisine */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Cuisine</h3>
                <div className="space-y-1.5">
                  <Link
                    href="/restaurants"
                    className={`block text-sm py-1.5 px-3 rounded-lg transition-colors ${!cuisine ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-primary hover:bg-accent"}`}
                  >
                    All Cuisines
                  </Link>
                  {CUISINES.map((c) => (
                    <Link
                      key={c.value}
                      href={`/restaurants?cuisine=${c.value}${area ? `&area=${area}` : ""}`}
                      className={`block text-sm py-1.5 px-3 rounded-lg transition-colors ${cuisine === c.value ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-primary hover:bg-accent"}`}
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Area */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Area</h3>
                <div className="space-y-1.5">
                  <Link
                    href={`/restaurants${cuisine ? `?cuisine=${cuisine}` : ""}`}
                    className={`block text-sm py-1.5 px-3 rounded-lg transition-colors ${!area ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-primary hover:bg-accent"}`}
                  >
                    All Areas
                  </Link>
                  {AREAS.map((a) => (
                    <Link
                      key={a.value}
                      href={`/restaurants?area=${a.value}${cuisine ? `&cuisine=${cuisine}` : ""}`}
                      className={`block text-sm py-1.5 px-3 rounded-lg transition-colors ${area === a.value ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-primary hover:bg-accent"}`}
                    >
                      {a.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* pSEO links */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Popular Searches</h3>
                <div className="space-y-1.5">
                  {[
                    { label: "Indian in Hua Hin", href: "/restaurants/indian/hua-hin" },
                    { label: "Seafood in Khao Takiab", href: "/restaurants/thai-seafood/khao-takiab" },
                    { label: "Japanese in Hua Hin", href: "/restaurants/japanese/hua-hin" },
                    { label: "Italian in Hua Hin", href: "/restaurants/italian/hua-hin" },
                  ].map((link) => (
                    <Link key={link.href} href={link.href} className="block text-sm py-1.5 px-3 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent transition-colors">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-lg font-semibold mb-2">No restaurants found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
