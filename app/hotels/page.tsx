import { Metadata } from "next";
import { getPlaces, AREAS, HOTEL_TYPES } from "@/lib/places";
import PlaceCard from "@/components/places/PlaceCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hotels & Resorts in Hua Hin — Best Accommodation Guide",
  description: "Find the best hotels, resorts, and villas in Hua Hin. From luxury beachfront resorts to cosy boutique hotels.",
};

export default async function HotelsPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string; type?: string }>;
}) {
  const { area, type } = await searchParams;
  const places = await getPlaces({ type: "HOTEL", ...(area && { area }), ...(type && { hotelType: type }) });

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Accommodation</p>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Hotels & Resorts in Hua Hin</h1>
          <p className="text-muted-foreground">{places.length} properties found</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-60 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Hotel Type</h3>
                <div className="space-y-1.5">
                  <Link href="/hotels" className={`block text-sm py-1.5 px-3 rounded-lg transition-colors ${!type ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-primary hover:bg-accent"}`}>
                    All Types
                  </Link>
                  {HOTEL_TYPES.map((t) => (
                    <Link key={t.value} href={`/hotels?type=${t.value}`} className={`block text-sm py-1.5 px-3 rounded-lg transition-colors ${type === t.value ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-primary hover:bg-accent"}`}>
                      {t.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Area</h3>
                <div className="space-y-1.5">
                  {AREAS.map((a) => (
                    <Link key={a.value} href={`/hotels?area=${a.value}`} className={`block text-sm py-1.5 px-3 rounded-lg transition-colors ${area === a.value ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-primary hover:bg-accent"}`}>
                      {a.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
          <div className="flex-1">
            {places.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">No hotels found</div>
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
