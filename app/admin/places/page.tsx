import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Eye, Star } from "lucide-react";

export const metadata = { title: "All Places — Admin" };

const TYPE_LABELS: Record<string, string> = {
  RESTAURANT: "Restaurant",
  HOTEL: "Hotel",
  ATTRACTION: "Attraction",
  BLOG: "Blog",
};

export default async function AdminPlacesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string }>;
}) {
  const { type, status } = await searchParams;

  const places = await prisma.place.findMany({
    where: {
      ...(type && { type }),
      ...(status && { status }),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold">
            {type ? `${TYPE_LABELS[type] ?? type}s` : "All Places"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{places.length} entries</p>
        </div>
        <Link
          href="/admin/places/new"
          className="gradient-btn text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add New
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["", "RESTAURANT", "HOTEL", "ATTRACTION", "BLOG"].map((t) => (
          <Link
            key={t}
            href={t ? `/admin/places?type=${t}` : "/admin/places"}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              type === t || (!type && !t)
                ? "bg-primary text-white"
                : "bg-card border border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {t ? TYPE_LABELS[t] : "All"}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-accent/50">
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Area</th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Rating</th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {places.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    No places found.{" "}
                    <Link href="/admin/places/new" className="text-primary hover:underline">Add one now</Link>
                  </td>
                </tr>
              ) : (
                places.map((place) => (
                  <tr key={place.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-foreground">{place.name}</div>
                      <div className="text-xs text-muted-foreground">{place.slug}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent font-medium">
                        {TYPE_LABELS[place.type] ?? place.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{place.area ?? "—"}</td>
                    <td className="px-5 py-4">
                      {place.rating && place.rating > 0 ? (
                        <div className="flex items-center gap-1 text-amber-600">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span className="text-xs font-bold">{place.rating.toFixed(1)}</span>
                        </div>
                      ) : "—"}
                    </td>
                    <td className="px-5 py-4">
                      {(() => {
                        const isScheduled =
                          place.status === "published" &&
                          place.publishedAt &&
                          new Date(place.publishedAt) > new Date();
                        return (
                          <div className="flex flex-col gap-1">
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold w-fit ${
                              isScheduled
                                ? "bg-amber-100 text-amber-700"
                                : place.status === "published"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-muted text-muted-foreground"
                            }`}>
                              {isScheduled ? "⏰ scheduled" : place.status}
                            </span>
                            {isScheduled && (
                              <span className="text-xs text-amber-600">
                                {new Date(place.publishedAt!).toLocaleDateString("th-TH", {
                                  day: "numeric", month: "short", year: "numeric",
                                  hour: "2-digit", minute: "2-digit",
                                })}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/places/${place.id}`} className="text-primary hover:underline flex items-center gap-1 text-xs font-medium">
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </Link>
                        <a
                          href={place.type === "BLOG" ? `/blog/${place.slug}` : `/place/${place.slug}`}
                          target="_blank"
                          className="text-muted-foreground hover:text-secondary flex items-center gap-1 text-xs"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
