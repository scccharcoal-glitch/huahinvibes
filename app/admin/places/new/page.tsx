import PlaceForm from "@/components/admin/PlaceForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "Add New Place — Admin" };

export default function NewPlacePage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/places" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
          <ChevronLeft className="w-4 h-4" />
          Back to Places
        </Link>
        <h1 className="text-2xl font-extrabold">Add New Place</h1>
        <p className="text-muted-foreground text-sm mt-1">Fill in the details. Use Google Place ID to auto-fill from Google Maps.</p>
      </div>
      <PlaceForm mode="create" />
    </div>
  );
}
