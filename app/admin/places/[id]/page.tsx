import { notFound } from "next/navigation";
import { getPlaceById } from "@/lib/places";
import PlaceForm from "@/components/admin/PlaceForm";
import Link from "next/link";
import { ChevronLeft, Eye } from "lucide-react";
import { getBlogHref, getPlaceHref } from "@/lib/slug";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const place = await getPlaceById(id);
  return { title: `Edit: ${place?.name ?? "Place"} — Admin` };
}

export default async function EditPlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const place = await getPlaceById(id);
  if (!place) notFound();

  const viewUrl = place.type === "BLOG" ? getBlogHref(place.slug) : getPlaceHref(place.slug);

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Link href="/admin/places" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back to Places
          </Link>
          <a href={viewUrl} target="_blank" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <Eye className="w-4 h-4" />
            View on site
          </a>
        </div>
        <h1 className="text-2xl font-extrabold">Edit: {place.name}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Status: <span className={`font-semibold ${place.status === "published" ? "text-green-600" : "text-muted-foreground"}`}>{place.status}</span>
          {" · "}Last updated: {new Date(place.updatedAt).toLocaleDateString("en-GB")}
        </p>
      </div>
      <PlaceForm place={place} mode="edit" />
    </div>
  );
}
