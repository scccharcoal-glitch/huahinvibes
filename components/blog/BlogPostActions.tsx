"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "lucide-react";

export default function BlogPostActions({
  postId,
  postName,
}: {
  postId: string;
  postName: string;
}) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Delete "${postName}"? This cannot be undone.`)) return;

    const res = await fetch(`/api/places/${postId}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Could not delete this post. Please make sure you are logged in as admin.");
      return;
    }

    router.push("/blog");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-3">
      <span className="text-xs font-bold uppercase tracking-widest text-primary mr-1">
        Admin
      </span>
      <Link
        href={`/admin/places/${postId}`}
        className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white hover:opacity-90 transition-opacity"
      >
        <Edit className="w-3.5 h-3.5" />
        Edit post
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        className="flex items-center gap-1.5 rounded-full border border-red-200 bg-white px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Delete post
      </button>
    </div>
  );
}
