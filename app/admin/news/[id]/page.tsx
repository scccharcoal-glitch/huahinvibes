import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import NewsForm from "@/components/admin/NewsForm";
import Link from "next/link";
import { ChevronLeft, Eye } from "lucide-react";
import { getBlogHref } from "@/lib/slug";

export const metadata = { title: "แก้ไขข่าว — Admin" };
export const dynamic = "force-dynamic";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const place = await prisma.place.findUnique({ where: { id } });

  if (!place || place.type !== "BLOG") notFound();

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <Link
          href="/admin/news"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          กลับไปหน้าข่าว
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">แก้ไขข่าว</h1>
            <p className="text-muted-foreground text-sm mt-1 font-mono">{place.slug}</p>
          </div>
          <a
            href={getBlogHref(place.slug)}
            target="_blank"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary border border-border px-4 py-2 rounded-xl transition-colors"
          >
            <Eye className="w-4 h-4" />
            ดูบนเว็บ
          </a>
        </div>
      </div>
      <NewsForm place={place} mode="edit" />
    </div>
  );
}
