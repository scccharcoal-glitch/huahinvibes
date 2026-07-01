"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, Eye, EyeOff, Save, Loader2, CheckCircle, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import type { NewsRow } from "@/lib/site-config";

type Config = {
  showNews: boolean;
  showRealestate: boolean;
  showBlog: boolean;
  showFeatured: boolean;
  showCategories: boolean;
  newsCategory: string;
  blogCategory: string;
  newsLimit: number;
  blogLimit: number;
  featuredLimit: number;
  newsRows: NewsRow[];
  thRows: NewsRow[];
};

const ALL_CATEGORIES = [
  { value: "thailand-news",    label: "Thailand News (EN)" },
  { value: "thailand-news-th", label: "ข่าวไทย (TH)" },
  { value: "food-guide",       label: "Food Guide" },
  { value: "travel-tips",      label: "Travel Tips" },
  { value: "hidden-gems",      label: "Hidden Gems" },
  { value: "lifestyle",        label: "Lifestyle" },
  { value: "events",           label: "Events" },
  { value: "hotel-review",     label: "Hotel Review" },
  { value: "real-estate",      label: "Real Estate" },
];

const BLOG_CATEGORIES = [
  { value: "", label: "All Blog Posts" },
  ...ALL_CATEGORIES.filter((c) => !c.value.startsWith("thailand-news")),
];

const SECTIONS = [
  { key: "showNews",        label: "Thailand News",             desc: "Featured hero + category grid rows" },
  { key: "showRealestate",  label: "Real Estate",               desc: "17-province city grid" },
  { key: "showBlog",        label: "Travel Journal",            desc: "Latest blog articles" },
  { key: "showCategories",  label: "What are you looking for?", desc: "Restaurants / Hotels / Attractions" },
  { key: "showFeatured",    label: "Featured in Hua Hin",       desc: "Editor's Pick places" },
] as const;

function RowEditor({
  rows,
  onChange,
  locale,
}: {
  rows: NewsRow[];
  onChange: (rows: NewsRow[]) => void;
  locale: "en" | "th";
}) {
  function update(i: number, field: keyof NewsRow, val: string | number) {
    const next = rows.map((r, idx) => idx === i ? { ...r, [field]: val } : r);
    onChange(next);
  }
  function remove(i: number) {
    onChange(rows.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...rows, { category: locale === "th" ? "thailand-news-th" : "thailand-news", label: "New Section", limit: 4 }]);
  }

  return (
    <div className="space-y-2">
      {rows.map((row, i) => (
        <div key={i} className="flex items-center gap-2 p-3 rounded-xl border border-border bg-card">
          <div className="flex-1 grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] text-muted-foreground block mb-0.5">Label (ชื่อหัวข้อ)</label>
              <input
                value={row.label}
                onChange={(e) => update(i, "label", e.target.value)}
                className="w-full text-sm border border-border rounded-lg px-2 py-1.5 bg-background"
                placeholder="Section label"
              />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground block mb-0.5">Category</label>
              <select
                value={row.category}
                onChange={(e) => update(i, "category", e.target.value)}
                className="w-full text-sm border border-border rounded-lg px-2 py-1.5 bg-background"
              >
                {ALL_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground block mb-0.5">จำนวน</label>
              <select
                value={row.limit}
                onChange={(e) => update(i, "limit", parseInt(e.target.value))}
                className="w-full text-sm border border-border rounded-lg px-2 py-1.5 bg-background"
              >
                {[2, 3, 4, 6, 8].map((n) => <option key={n} value={n}>{n} items</option>)}
              </select>
            </div>
          </div>
          <button
            onClick={() => remove(i)}
            className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"
            title="Remove"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        onClick={add}
        className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline py-1"
      >
        <Plus className="w-3.5 h-3.5" /> Add Row
      </button>
    </div>
  );
}

export default function HomepageConfigPage() {
  const [config, setConfig] = useState<Config>({
    showNews: true, showRealestate: true, showBlog: true,
    showFeatured: true, showCategories: true,
    newsCategory: "thailand-news", blogCategory: "",
    newsLimit: 10, blogLimit: 6, featuredLimit: 6,
    newsRows: [{ category: "thailand-news", label: "Latest Thailand News", limit: 4 }],
    thRows: [
      { category: "thailand-news-th", label: "ข่าวล่าสุด", limit: 4 },
      { category: "thailand-news", label: "Thailand News", limit: 4 },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/homepage-config")
      .then((r) => r.json())
      .then((data) => { setConfig(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    await fetch("/api/admin/homepage-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function toggle(key: keyof Config) {
    setConfig((c) => ({ ...c, [key]: !c[key as keyof Config] }));
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-extrabold">Homepage Sections</h1>
          </div>
          <p className="text-sm text-muted-foreground">เลือกว่าจะแสดง section ไหน และตั้งค่าแต่ละส่วน</p>
        </div>
        <Link href="/" target="_blank" className="text-xs text-primary hover:underline">
          ดูหน้าเว็บ →
        </Link>
      </div>

      {/* Section toggles */}
      <div className="space-y-3 mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">แสดง / ซ่อน Section</p>
        {SECTIONS.map(({ key, label, desc }) => {
          const isOn = config[key as keyof Config] as boolean;
          return (
            <div
              key={key}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                isOn ? "border-primary/30 bg-primary/5" : "border-border bg-card opacity-60"
              }`}
              onClick={() => toggle(key as keyof Config)}
            >
              <div className="flex items-center gap-3">
                {isOn
                  ? <Eye className="w-4 h-4 text-primary flex-shrink-0" />
                  : <EyeOff className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                }
                <div>
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
              <div className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 flex items-center px-0.5 ${isOn ? "bg-primary" : "bg-muted"}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${isOn ? "translate-x-5" : "translate-x-0"}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Settings per section */}
      <div className="space-y-6 mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">ตั้งค่าแต่ละ Section</p>

        {/* EN News rows */}
        {config.showNews && (
          <div className="p-4 rounded-xl border border-border bg-card space-y-3">
            <p className="font-semibold text-sm">📰 EN Homepage — News Rows</p>
            <p className="text-xs text-muted-foreground">แต่ละ row จะแสดงเป็น grid section ต่อกันลงมา</p>
            <RowEditor
              rows={config.newsRows}
              onChange={(rows) => setConfig((c) => ({ ...c, newsRows: rows }))}
              locale="en"
            />
          </div>
        )}

        {/* TH page rows */}
        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
          <p className="font-semibold text-sm">🇹🇭 /th Page — News Rows</p>
          <p className="text-xs text-muted-foreground">หน้า /th มี config แยกต่างหาก</p>
          <RowEditor
            rows={config.thRows}
            onChange={(rows) => setConfig((c) => ({ ...c, thRows: rows }))}
            locale="th"
          />
        </div>

        {/* Blog settings */}
        {config.showBlog && (
          <div className="p-4 rounded-xl border border-border bg-card space-y-3">
            <p className="font-semibold text-sm">✍️ Travel Journal</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">หมวดหมู่</label>
                <select
                  value={config.blogCategory}
                  onChange={(e) => setConfig((c) => ({ ...c, blogCategory: e.target.value }))}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background"
                >
                  {BLOG_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">จำนวนบทความ</label>
                <select
                  value={config.blogLimit}
                  onChange={(e) => setConfig((c) => ({ ...c, blogLimit: parseInt(e.target.value) }))}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background"
                >
                  {[3, 6, 9, 12].map((n) => <option key={n} value={n}>{n} บทความ</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Featured settings */}
        {config.showFeatured && (
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="font-semibold text-sm mb-3">⭐ Featured in Hua Hin</p>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">จำนวน places</label>
              <select
                value={config.featuredLimit}
                onChange={(e) => setConfig((c) => ({ ...c, featuredLimit: parseInt(e.target.value) }))}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background"
              >
                {[3, 6, 9, 12].map((n) => <option key={n} value={n}>{n} places</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Save button */}
      <button
        onClick={save}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 gradient-btn text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {saving ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
        ) : saved ? (
          <><CheckCircle className="w-4 h-4" /> Saved!</>
        ) : (
          <><Save className="w-4 h-4" /> บันทึกการตั้งค่า</>
        )}
      </button>
    </div>
  );
}
