import NewsForm from "@/components/admin/NewsForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "เพิ่มข่าวใหม่ — Admin" };

export default function NewNewsPage() {
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
        <h1 className="text-2xl font-extrabold">เพิ่มข่าวใหม่</h1>
        <p className="text-muted-foreground text-sm mt-1">เขียนข่าวสารจากประเทศไทย — เลือกภาษาอังกฤษหรือภาษาไทย</p>
      </div>
      <NewsForm mode="create" />
    </div>
  );
}
