"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type Place } from "@prisma/client";
import { AREAS, CUISINES, HOTEL_TYPES, ATTRACTION_CATEGORIES, BLOG_CATEGORIES, PRICE_RANGES } from "@/lib/places";
import RichTextEditor from "./RichTextEditor";

type PlaceInput = Partial<Omit<Place, "id" | "createdAt" | "updatedAt">>;

interface Props {
  place?: Place;
  mode: "create" | "edit";
}

const TYPE_OPTIONS = [
  { value: "RESTAURANT", label: "Restaurant" },
  { value: "HOTEL", label: "Hotel" },
  { value: "ATTRACTION", label: "Attraction" },
  { value: "BLOG", label: "Blog Post" },
];

export default function PlaceForm({ place, mode }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const [form, setForm] = useState<PlaceInput>({
    name: place?.name ?? "",
    slug: place?.slug ?? "",
    type: place?.type ?? "RESTAURANT",
    status: place?.status ?? "draft",
    featured: place?.featured ?? false,
    description: place?.description ?? "",
    content: place?.content ?? "",
    address: place?.address ?? "",
    area: place?.area ?? "",
    lat: place?.lat ?? undefined,
    lng: place?.lng ?? undefined,
    googlePlaceId: place?.googlePlaceId ?? "",
    cuisine: place?.cuisine ?? "",
    priceRange: place?.priceRange ?? "",
    openingHours: place?.openingHours ?? "",
    hotelType: place?.hotelType ?? "",
    starRating: place?.starRating ?? undefined,
    category: place?.category ?? "",
    phone: place?.phone ?? "",
    website: place?.website ?? "",
    email: place?.email ?? "",
    bookingUrl: place?.bookingUrl ?? "",
    coverImage: place?.coverImage ?? "",
    tags: place?.tags ?? "",
    seoTitle: place?.seoTitle ?? "",
    seoDesc: place?.seoDesc ?? "",
    rating: place?.rating ?? undefined,
    reviewCount: place?.reviewCount ?? undefined,
  });

  function set(key: keyof PlaceInput, value: unknown) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      // Auto-generate slug from name
      if (key === "name" && mode === "create") {
        next.slug = (value as string)
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim();
      }
      return next;
    });
  }

  async function fetchFromGoogleMaps() {
    if (!form.googlePlaceId) return;
    setGoogleLoading(true);
    try {
      const res = await fetch(`/api/google-places?placeId=${form.googlePlaceId}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setForm((prev) => ({
        ...prev,
        name: data.name || prev.name,
        address: data.address || prev.address,
        phone: data.phone || prev.phone,
        website: data.website || prev.website,
        lat: data.lat || prev.lat,
        lng: data.lng || prev.lng,
        rating: data.rating || prev.rating,
        reviewCount: data.reviewCount || prev.reviewCount,
        openingHours: data.openingHours || prev.openingHours,
      }));
    } catch {
      setError("Could not fetch from Google Maps. Check your API key.");
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = mode === "create" ? "/api/places" : `/api/places/${place?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save");
      }

      router.push("/admin/places");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!place || !confirm(`Delete "${place.name}"? This cannot be undone.`)) return;
    setLoading(true);
    try {
      await fetch(`/api/places/${place.id}`, { method: "DELETE" });
      router.push("/admin/places");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const inputCls = "w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";
  const labelCls = "block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
      )}

      {/* Basic Info */}
      <section className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-bold text-base mb-5 pb-3 border-b border-border">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelCls}>Name *</label>
            <input required value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} className={inputCls} placeholder="e.g. Baan Itsara Indian Restaurant" />
          </div>
          <div>
            <label className={labelCls}>Slug (URL)</label>
            <input value={form.slug ?? ""} onChange={(e) => set("slug", e.target.value)} className={inputCls} placeholder="baan-itsara-indian-restaurant" />
          </div>
          <div>
            <label className={labelCls}>Type *</label>
            <select required value={form.type ?? "RESTAURANT"} onChange={(e) => set("type", e.target.value)} className={inputCls}>
              {TYPE_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <select value={form.status ?? "draft"} onChange={(e) => set("status", e.target.value)} className={inputCls}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="featured" checked={form.featured ?? false} onChange={(e) => set("featured", e.target.checked)} className="w-4 h-4 accent-primary rounded" />
            <label htmlFor="featured" className="text-sm font-medium cursor-pointer">Featured (show on homepage)</label>
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Description</label>
            <textarea value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} rows={3} className={inputCls} placeholder="Short description shown on cards and search results" />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Content (long-form)</label>
            <RichTextEditor
              value={form.content ?? ""}
              onChange={(html) => set("content", html)}
              placeholder="เขียนรายละเอียด เนื้อหา บทความ..."
            />
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-bold text-base mb-5 pb-3 border-b border-border">Location & Google Maps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelCls}>Google Place ID</label>
            <div className="flex gap-2">
              <input value={form.googlePlaceId ?? ""} onChange={(e) => set("googlePlaceId", e.target.value)} className={inputCls} placeholder="ChIJ... (from Google Maps URL or Places API)" />
              <button
                type="button"
                onClick={fetchFromGoogleMaps}
                disabled={!form.googlePlaceId || googleLoading}
                className="flex-shrink-0 gradient-btn text-white px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                {googleLoading ? "Loading..." : "Auto-fill"}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">Paste a Google Place ID to auto-fill name, address, phone, hours, and ratings</p>
          </div>
          <div>
            <label className={labelCls}>Area</label>
            <select value={form.area ?? ""} onChange={(e) => set("area", e.target.value)} className={inputCls}>
              <option value="">Select area</option>
              {AREAS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Full Address</label>
            <input value={form.address ?? ""} onChange={(e) => set("address", e.target.value)} className={inputCls} placeholder="123 Phetkasem Rd, Hua Hin" />
          </div>
          <div>
            <label className={labelCls}>Latitude</label>
            <input type="number" step="any" value={form.lat ?? ""} onChange={(e) => set("lat", parseFloat(e.target.value))} className={inputCls} placeholder="12.5706" />
          </div>
          <div>
            <label className={labelCls}>Longitude</label>
            <input type="number" step="any" value={form.lng ?? ""} onChange={(e) => set("lng", parseFloat(e.target.value))} className={inputCls} placeholder="99.9576" />
          </div>
        </div>
      </section>

      {/* Type-specific */}
      {form.type === "RESTAURANT" && (
        <section className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-bold text-base mb-5 pb-3 border-b border-border">Restaurant Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Cuisine</label>
              <select value={form.cuisine ?? ""} onChange={(e) => set("cuisine", e.target.value)} className={inputCls}>
                <option value="">Select cuisine</option>
                {CUISINES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Price Range</label>
              <select value={form.priceRange ?? ""} onChange={(e) => set("priceRange", e.target.value)} className={inputCls}>
                <option value="">Select price range</option>
                {PRICE_RANGES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Opening Hours</label>
              <input value={form.openingHours ?? ""} onChange={(e) => set("openingHours", e.target.value)} className={inputCls} placeholder="11:00–22:00" />
            </div>
          </div>
        </section>
      )}

      {form.type === "HOTEL" && (
        <section className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-bold text-base mb-5 pb-3 border-b border-border">Hotel Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Hotel Type</label>
              <select value={form.hotelType ?? ""} onChange={(e) => set("hotelType", e.target.value)} className={inputCls}>
                <option value="">Select type</option>
                {HOTEL_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Star Rating</label>
              <select value={form.starRating ?? ""} onChange={(e) => set("starRating", parseInt(e.target.value))} className={inputCls}>
                <option value="">Select stars</option>
                {[1,2,3,4,5].map((s) => <option key={s} value={s}>{s} Star{s > 1 ? "s" : ""}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Price Range</label>
              <select value={form.priceRange ?? ""} onChange={(e) => set("priceRange", e.target.value)} className={inputCls}>
                <option value="">Select price range</option>
                {PRICE_RANGES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>
        </section>
      )}

      {form.type === "BLOG" && (
        <section className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-bold text-base mb-5 pb-3 border-b border-border">Blog Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>หมวดหมู่</label>
              <select value={form.category ?? ""} onChange={(e) => set("category", e.target.value)} className={inputCls}>
                <option value="">เลือกหมวดหมู่</option>
                {BLOG_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label} — {c.labelTh}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Excerpt (สรุปสั้น)</label>
              <input value={form.excerpt ?? ""} onChange={(e) => set("excerpt", e.target.value)} className={inputCls} placeholder="สรุปบทความสั้นๆ สำหรับ listing..." />
            </div>
          </div>
        </section>
      )}

      {form.type === "ATTRACTION" && (
        <section className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-bold text-base mb-5 pb-3 border-b border-border">Attraction Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Category</label>
              <select value={form.category ?? ""} onChange={(e) => set("category", e.target.value)} className={inputCls}>
                <option value="">Select category</option>
                {ATTRACTION_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Opening Hours</label>
              <input value={form.openingHours ?? ""} onChange={(e) => set("openingHours", e.target.value)} className={inputCls} placeholder="08:00–18:00" />
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-bold text-base mb-5 pb-3 border-b border-border">Contact & Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Phone</label>
            <input value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} className={inputCls} placeholder="032-512-000" />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input type="email" value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} className={inputCls} placeholder="info@example.com" />
          </div>
          <div>
            <label className={labelCls}>Website</label>
            <input type="url" value={form.website ?? ""} onChange={(e) => set("website", e.target.value)} className={inputCls} placeholder="https://..." />
          </div>
          <div>
            <label className={labelCls}>Booking URL</label>
            <input type="url" value={form.bookingUrl ?? ""} onChange={(e) => set("bookingUrl", e.target.value)} className={inputCls} placeholder="https://..." />
          </div>
        </div>
      </section>

      {/* Media */}
      <section className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-bold text-base mb-5 pb-3 border-b border-border">Media</h2>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Cover Image URL</label>
            <input value={form.coverImage ?? ""} onChange={(e) => set("coverImage", e.target.value)} className={inputCls} placeholder="https://images.unsplash.com/..." />
          </div>
          {form.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.coverImage} alt="Preview" className="h-40 w-full object-cover rounded-xl border border-border" />
          )}
          <div>
            <label className={labelCls}>Tags (comma-separated)</label>
            <input value={form.tags ?? ""} onChange={(e) => set("tags", e.target.value)} className={inputCls} placeholder="indian,curry,vegetarian,family" />
          </div>
        </div>
      </section>

      {/* Rating */}
      <section className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-bold text-base mb-5 pb-3 border-b border-border">Rating & Reviews</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Rating (0–5)</label>
            <input type="number" step="0.1" min="0" max="5" value={form.rating ?? ""} onChange={(e) => set("rating", parseFloat(e.target.value))} className={inputCls} placeholder="4.5" />
          </div>
          <div>
            <label className={labelCls}>Review Count</label>
            <input type="number" value={form.reviewCount ?? ""} onChange={(e) => set("reviewCount", parseInt(e.target.value))} className={inputCls} placeholder="312" />
          </div>
        </div>
      </section>

      {/* SEO */}
      <section className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-bold text-base mb-5 pb-3 border-b border-border">SEO</h2>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>SEO Title</label>
            <input value={form.seoTitle ?? ""} onChange={(e) => set("seoTitle", e.target.value)} className={inputCls} placeholder="Best Indian Restaurant in Hua Hin — ..." />
            <p className="text-xs text-muted-foreground mt-1">{(form.seoTitle ?? "").length}/60 chars</p>
          </div>
          <div>
            <label className={labelCls}>SEO Description</label>
            <textarea value={form.seoDesc ?? ""} onChange={(e) => set("seoDesc", e.target.value)} rows={2} className={inputCls} placeholder="Authentic Indian food in Hua Hin. Rich curries..." />
            <p className="text-xs text-muted-foreground mt-1">{(form.seoDesc ?? "").length}/160 chars</p>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="gradient-btn text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-60 shadow-lg shadow-primary/20"
          >
            {loading ? "Saving..." : mode === "create" ? "Create Place" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl border border-border text-sm font-medium hover:bg-accent transition-colors"
          >
            Cancel
          </button>
        </div>
        {mode === "edit" && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="text-red-600 hover:bg-red-50 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-colors"
          >
            Delete Place
          </button>
        )}
      </div>
    </form>
  );
}
