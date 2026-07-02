import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Eye, Newspaper } from "lucide-react";
import { getBlogHref } from "@/lib/slug";

export const metadata = { title: "Thailand News — Admin" };
export const dynamic = "force-dynamic";

const CATEGORY_LABEL: Record<string, { label: string; color: string }> = {
  "thailand-news":    { label: "EN", color: "bg-blue-100 text-blue-700" },
  "thailand-news-th": { label: "TH", color: "bg-yellow-100 text-yellow-700" },
};

export default async function AdminNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; status?: string }>;
}) {
  const { category, status } = await searchParams;

  const news = await prisma.place.findMany({
    where: {
      type: "BLOG",
      category: category ?? { in: ["thailand-news", "thailand-news-th"] },
      ...(status && { status }),
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });

  const totalEn = await prisma.place.count({ where: { type: "BLOG", category: "thailand-news" } });
  const totalTh = await prisma.place.count({ where: { type: "BLOG", category: "thailand-news-th" } });

  const filters = [
    { label: "ทั้งหมด", value: "" },
    { label: "English (EN)", value: "thailand-news" },
    { label: "ภาษาไทย (TH)", value: "thailand-news-th" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-primary" />
            Thailand News
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            จัดการข่าวสารประเทศไทย — {totalEn} EN · {totalTh} TH
          </p>
        </div>
        <Link
          href="/admin/news/new"
          className="gradient-btn text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          เพิ่มข่าวใหม่
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <div className="text-3xl font-extrabold text-foreground">{totalEn + totalTh}</div>
          <div className="text-sm text-muted-foreground mt-1">ข่าวทั้งหมด</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <div className="text-3xl font-extrabold text-blue-600">{totalEn}</div>
          <div className="text-sm text-muted-foreground mt-1">ข่าวภาษาอังกฤษ</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <div className="text-3xl font-extrabold text-yellow-600">{totalTh}</div>
          <div className="text-sm text-muted-foreground mt-1">ข่าวภาษาไทย</div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map((f) => (
          <Link
            key={f.value}
            href={f.value ? `/admin/news?category=${f.value}` : "/admin/news"}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              (category ?? "") === f.value
                ? "bg-primary text-white"
                : "bg-card border border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {f.label}
          </Link>
        ))}
        <div className="flex-1" />
        {[
          { label: "ทุกสถานะ", value: "" },
          { label: "Published", value: "published" },
          { label: "Draft", value: "draft" },
        ].map((f) => (
          <Link
            key={f.value}
            href={
              f.value
                ? `/admin/news${category ? `?category=${category}&` : "?"}status=${f.value}`
                : `/admin/news${category ? `?category=${category}` : ""}`
            }
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              (status ?? "") === f.value
                ? "bg-secondary text-white"
                : "bg-card border border-border text-muted-foreground hover:border-secondary hover:text-secondary"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-accent/50">
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">หัวข้อข่าว</th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">ภาษา</th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">วันที่</th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">สถานะ</th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {news.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-muted-foreground">
                    <Newspaper className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">ยังไม่มีข่าว</p>
                    <Link href="/admin/news/new" className="mt-2 inline-block text-primary hover:underline text-sm">
                      + เพิ่มข่าวใหม่
                    </Link>
                  </td>
                </tr>
              ) : (
                news.map((item) => {
                  const isScheduled =
                    item.status === "published" &&
                    item.publishedAt &&
                    new Date(item.publishedAt) > new Date();
                  const cat = CATEGORY_LABEL[item.category ?? ""] ?? { label: "?", color: "bg-muted text-muted-foreground" };
                  return (
                    <tr key={item.id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-5 py-4 max-w-xs">
                        <div className="font-semibold text-foreground line-clamp-2">{item.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 truncate">{item.slug}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${cat.color}`}>
                          {cat.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground text-xs whitespace-nowrap">
                        {item.publishedAt
                          ? new Date(item.publishedAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })
                          : new Date(item.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                          isScheduled
                            ? "bg-amber-100 text-amber-700"
                            : item.status === "published"
                              ? "bg-green-100 text-green-700"
                              : "bg-muted text-muted-foreground"
                        }`}>
                          {isScheduled ? "⏰ scheduled" : item.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/admin/news/${item.id}`}
                            className="text-primary hover:underline flex items-center gap-1 text-xs font-medium"
                          >
                            <Edit className="w-3.5 h-3.5" /> แก้ไข
                          </Link>
                          <a
                            href={getBlogHref(item.slug)}
                            target="_blank"
                            className="text-muted-foreground hover:text-secondary flex items-center gap-1 text-xs"
                          >
                            <Eye className="w-3.5 h-3.5" /> ดู
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
