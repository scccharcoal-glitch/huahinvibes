"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type Place } from "@prisma/client";
import { imageFileToDataUrl } from "@/lib/image-file";
import RichTextEditor from "./RichTextEditor";

type NewsInput = {
  name: string;
  slug: string;
  category: string;
  status: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string;
  seoTitle: string;
  seoDesc: string;
  publishedAt: string;
};

// ─── Preset categories per language ───────────────────────────────────────────
const EN_CATEGORIES = [
  { value: "thailand-news",          label: "Thailand News (ทั่วไป)" },
  { value: "thailand-news-politics", label: "การเมือง (Politics)" },
  { value: "thailand-news-economy",  label: "เศรษฐกิจ (Economy)" },
  { value: "thailand-news-travel",   label: "ท่องเที่ยว (Travel)" },
  { value: "thailand-news-property", label: "อสังหาฯ (Property)" },
  { value: "thailand-news-lifestyle",label: "ไลฟ์สไตล์ (Lifestyle)" },
];
const TH_CATEGORIES = [
  { value: "thailand-news-th",          label: "ข่าวทั่วไป" },
  { value: "thailand-news-th-politics", label: "ข่าวการเมือง" },
  { value: "thailand-news-th-economy",  label: "ข่าวเศรษฐกิจ" },
  { value: "thailand-news-th-travel",   label: "ข่าวท่องเที่ยว" },
  { value: "thailand-news-th-property", label: "ข่าวอสังหาฯ" },
  { value: "thailand-news-th-lifestyle",label: "ข่าวไลฟ์สไตล์" },
];

function detectLang(category?: string | null): "en" | "th" {
  if (!category) return "en";
  return category.endsWith("-th") ? "th" : "en";
}

interface Props {
  place?: Place;
  mode: "create" | "edit";
}

export default function NewsForm({ place, mode }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [lang, setLang] = useState<"en" | "th">(() => detectLang(place?.category));
  const [customCat, setCustomCat] = useState(false);
  const [customCatValue, setCustomCatValue] = useState("");

  const [form, setForm] = useState<NewsInput>({
    name: place?.name ?? "",
    slug: place?.slug ?? "",
    category: place?.category ?? "thailand-news",
    status: place?.status ?? "draft",
    excerpt: place?.excerpt ?? "",
    content: place?.content ?? "",
    coverImage: place?.coverImage ?? "",
    tags: place?.tags ?? "",
    seoTitle: place?.seoTitle ?? "",
    seoDesc: place?.seoDesc ?? "",
    publishedAt: place?.publishedAt
      ? new Date(place.publishedAt).toISOString().slice(0, 16)
      : "",
  });

  function set(key: keyof NewsInput, value: string) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "name" && mode === "create") {
        next.slug = value
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim();
      }
      return next;
    });
  }

  function switchLang(l: "en" | "th") {
    setLang(l);
    setCustomCat(false);
    setCustomCatValue("");
    const defaultCat = l === "en" ? "thailand-news" : "thailand-news-th";
    set("category", defaultCat);
  }

  function applyCustomCategory() {
    if (!customCatValue.trim()) return;
    const slug = customCatValue.trim().toLowerCase().replace(/\s+/g, "-");
    const final = lang === "th" && !slug.endsWith("-th") ? `${slug}-th` : slug;
    set("category", final);
    setCustomCat(false);
    setCustomCatValue("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const url = mode === "create" ? "/api/places" : `/api/places/${place?.id}`;
      const method = mode === "create" ? "POST" : "PUT";
      const publishedAt = form.publishedAt ? new Date(form.publishedAt).toISOString() : null;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: "BLOG", publishedAt }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save");
      }
      router.push("/admin/news");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!place || !confirm(`ลบ "${place.name}"? ไม่สามารถกู้คืนได้`)) return;
    setLoading(true);
    try {
      await fetch(`/api/places/${place.id}`, { method: "DELETE" });
      router.push("/admin/news");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleCoverUpload(file?: File) {
    if (!file) return;
    setError("");

    try {
      const dataUrl = await imageFileToDataUrl(file);
      set("coverImage", dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "ไม่สามารถอัปโหลดรูปนี้ได้");
    }
  }

  const presets = lang === "en" ? EN_CATEGORIES : TH_CATEGORIES;
  const inputCls = "w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";
  const labelCls = "block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
      )}

      {/* ── Step 1: Language ── */}
      <section className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-bold text-base mb-4 pb-3 border-b border-border">
          1. เลือกภาษา (Language)
        </h2>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => switchLang("en")}
            className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${
              lang === "en"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-border bg-background text-muted-foreground hover:border-blue-300"
            }`}
          >
            🇬🇧 English News
          </button>
          <button
            type="button"
            onClick={() => switchLang("th")}
            className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${
              lang === "th"
                ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                : "border-border bg-background text-muted-foreground hover:border-yellow-300"
            }`}
          >
            🇹🇭 ข่าวภาษาไทย
          </button>
        </div>
      </section>

      {/* ── Step 2: Category ── */}
      <section className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-bold text-base mb-4 pb-3 border-b border-border">
          2. หมวดหมู่ (Category)
        </h2>

        {/* preset buttons */}
        <div className="flex flex-wrap gap-2 mb-3">
          {presets.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => { set("category", c.value); setCustomCat(false); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                form.category === c.value && !customCat
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:border-primary/50"
              }`}
            >
              {c.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCustomCat(true)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
              customCat
                ? "border-secondary bg-secondary/10 text-secondary"
                : "border-dashed border-border text-muted-foreground hover:border-secondary"
            }`}
          >
            + สร้างใหม่
          </button>
        </div>

        {/* custom category input */}
        {customCat && (
          <div className="flex gap-2 mt-2">
            <input
              value={customCatValue}
              onChange={(e) => setCustomCatValue(e.target.value)}
              placeholder={lang === "en" ? "e.g. thailand-news-sports" : "เช่น ข่าวกีฬา"}
              className={inputCls}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyCustomCategory())}
            />
            <button
              type="button"
              onClick={applyCustomCategory}
              className="gradient-btn text-white px-5 rounded-xl text-sm font-bold hover:opacity-90 flex-shrink-0"
            >
              ใช้
            </button>
          </div>
        )}

        {/* current value */}
        <p className="text-xs text-muted-foreground mt-2">
          หมวดหมู่ที่เลือก:{" "}
          <code className="bg-accent px-2 py-0.5 rounded font-mono">{form.category}</code>
        </p>
      </section>

      {/* ── Core content ── */}
      <section className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-bold text-base mb-5 pb-3 border-b border-border">3. ข้อมูลข่าว</h2>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>หัวข้อข่าว *</label>
            <input
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={inputCls}
              placeholder={lang === "en" ? "e.g. Thailand Tourism Hits Record 35 Million Visitors..." : "เช่น หัวหินคว้ารางวัลเมืองท่องเที่ยวยั่งยืน..."}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Slug (URL)</label>
              <input
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                className={inputCls}
                placeholder="thailand-tourism-record-2025"
              />
            </div>
            <div>
              <label className={labelCls}>สถานะ</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputCls}>
                <option value="draft">Draft (ฉบับร่าง)</option>
                <option value="published">Published (เผยแพร่แล้ว)</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>สรุปสั้น (Excerpt)</label>
            <textarea
              rows={2}
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              className={inputCls}
              placeholder={lang === "en" ? "Short summary shown on news cards..." : "สรุปข่าวสั้นๆ แสดงบนการ์ดและหน้าลิสต์..."}
            />
          </div>
          <div>
            <label className={labelCls}>เนื้อหาข่าว (Content)</label>
            <RichTextEditor
              value={form.content}
              onChange={(html) => setForm((prev) => ({ ...prev, content: html }))}
              placeholder={lang === "en" ? "Write the full news article..." : "เขียนเนื้อหาข่าวแบบเต็ม..."}
            />
          </div>
        </div>
      </section>

      {/* ── Publish settings ── */}
      <section className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-bold text-base mb-5 pb-3 border-b border-border">4. การเผยแพร่</h2>
        <div>
          <label className={labelCls}>
            วันที่เผยแพร่
            <span className="font-normal normal-case text-muted-foreground ml-1">(ปล่อยว่าง = เผยแพร่ทันที)</span>
          </label>
          <input
            type="datetime-local"
            value={form.publishedAt}
            onChange={(e) => set("publishedAt", e.target.value)}
            className={inputCls}
          />
          {form.publishedAt && new Date(form.publishedAt) > new Date() && (
            <p className="text-xs text-amber-600 font-semibold mt-1.5">
              ⏰ Scheduled — จะแสดงวันที่ {new Date(form.publishedAt).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>
      </section>

      {/* ── Media ── */}
      <section className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-bold text-base mb-5 pb-3 border-b border-border">5. รูปภาพและ Tags</h2>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Cover Image URL</label>
            <input
              value={form.coverImage}
              onChange={(e) => set("coverImage", e.target.value)}
              className={inputCls}
              placeholder="https://images.unsplash.com/..."
            />
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleCoverUpload(e.target.files?.[0])}
                className="w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-xs file:font-bold file:text-white hover:file:opacity-90"
              />
              <p className="text-xs text-muted-foreground mt-1">
                แนบรูปจากเครื่อง หรือวาง URL รูปภาพด้านบน
              </p>
            </div>
          </div>
          {form.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.coverImage} alt="Preview" className="h-40 w-full object-cover rounded-xl border border-border" />
          )}
          <div>
            <label className={labelCls}>Tags (คั่นด้วยจุลภาค)</label>
            <input
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              className={inputCls}
              placeholder="tourism,thailand,hua-hin,travel"
            />
          </div>
        </div>
      </section>

      {/* ── SEO ── */}
      <section className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-bold text-base mb-5 pb-3 border-b border-border">6. SEO</h2>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>SEO Title</label>
            <input
              value={form.seoTitle}
              onChange={(e) => set("seoTitle", e.target.value)}
              className={inputCls}
              placeholder="Thailand Tourism Record 2025 — Hua Hin Vibes"
            />
            <p className="text-xs text-muted-foreground mt-1">{form.seoTitle.length}/60 chars</p>
          </div>
          <div>
            <label className={labelCls}>SEO Description</label>
            <textarea
              rows={2}
              value={form.seoDesc}
              onChange={(e) => set("seoDesc", e.target.value)}
              className={inputCls}
              placeholder="Stay updated with the latest Thailand travel news..."
            />
            <p className="text-xs text-muted-foreground mt-1">{form.seoDesc.length}/160 chars</p>
          </div>
        </div>
      </section>

      {/* ── Actions ── */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="gradient-btn text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-60 shadow-lg shadow-primary/20"
          >
            {loading ? "กำลังบันทึก..." : mode === "create" ? "สร้างข่าว" : "บันทึกการเปลี่ยนแปลง"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl border border-border text-sm font-medium hover:bg-accent transition-colors"
          >
            ยกเลิก
          </button>
        </div>
        {mode === "edit" && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="text-red-600 hover:bg-red-50 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-colors"
          >
            ลบข่าว
          </button>
        )}
      </div>
    </form>
  );
}
