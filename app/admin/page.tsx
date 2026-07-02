import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { UtensilsCrossed, Hotel, Compass, Plus, TrendingUp, Eye, Star, Newspaper } from "lucide-react";
import { getPlaceHref } from "@/lib/slug";

export const metadata = { title: "Admin Dashboard — Hua Hin Vibes" };

export default async function AdminDashboard() {
  const [restaurants, hotels, attractions, newsCount, recent] = await Promise.all([
    prisma.place.count({ where: { type: "RESTAURANT" } }),
    prisma.place.count({ where: { type: "HOTEL" } }),
    prisma.place.count({ where: { type: "ATTRACTION" } }),
    prisma.place.count({ where: { type: "BLOG", category: { in: ["thailand-news", "thailand-news-th"] } } }),
    prisma.place.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const stats = [
    { label: "Restaurants", count: restaurants, icon: UtensilsCrossed, href: "/admin/places?type=RESTAURANT", color: "text-primary bg-pink-50" },
    { label: "Hotels", count: hotels, icon: Hotel, href: "/admin/places?type=HOTEL", color: "text-secondary bg-purple-50" },
    { label: "Attractions", count: attractions, icon: Compass, href: "/admin/places?type=ATTRACTION", color: "text-amber-700 bg-amber-50" },
    { label: "Total Places", count: restaurants + hotels + attractions, icon: TrendingUp, href: "/admin/places", color: "text-green-700 bg-green-50" },
    { label: "Thailand News", count: newsCount, icon: Newspaper, href: "/admin/news", color: "text-blue-700 bg-blue-50" },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your Hua Hin Vibes content</p>
        </div>
        <Link
          href="/admin/places/new"
          className="gradient-btn text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          Add New Place
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-3xl font-extrabold text-foreground mb-1">{stat.count}</div>
            <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent Places */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-bold text-foreground">Recent Places</h2>
          <Link href="/admin/places" className="text-xs font-semibold text-primary hover:underline">View all</Link>
        </div>
        <div className="divide-y divide-border">
          {recent.map((place) => (
            <div key={place.id} className="px-6 py-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-xs font-bold text-muted-foreground">
                  {place.type[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{place.name}</p>
                  <p className="text-xs text-muted-foreground">{place.area} · {place.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {place.rating && place.rating > 0 && (
                  <div className="flex items-center gap-1 text-xs text-amber-600">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {place.rating.toFixed(1)}
                  </div>
                )}
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  place.status === "published" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                }`}>
                  {place.status}
                </span>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/places/${place.id}`} className="text-xs text-primary hover:underline font-medium">
                    Edit
                  </Link>
                  <a href={getPlaceHref(place.slug)} target="_blank" className="text-muted-foreground hover:text-primary">
                    <Eye className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
