"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search } from "lucide-react";

type SearchBoxProps = {
  placeholder?: string;
  size?: "default" | "large";
  className?: string;
};

export default function SearchBox({
  placeholder = "Search somtam, seafood, spa...",
  size = "default",
  className = "",
}: SearchBoxProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const isLarge = size === "large";

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const value = search.trim();
    if (!value) return;

    router.push(`/restaurants?q=${encodeURIComponent(value)}`);
    setSearch("");
  }

  return (
    <form
      onSubmit={handleSearch}
      className={`flex w-full items-center gap-2 ${isLarge ? "max-w-3xl" : "max-w-md"} ${className}`}
    >
      <div className="relative flex-1">
        <MapPin
          className={`absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground ${
            isLarge ? "w-5 h-5" : "w-4 h-4"
          }`}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-card border-2 border-primary/30 rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm ${
            isLarge ? "pl-12 pr-5 py-4 text-base md:text-lg" : "pl-9 pr-4 py-2 text-sm"
          }`}
        />
      </div>
      <button
        type="submit"
        className={`gradient-btn text-white rounded-full font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 ${
          isLarge ? "px-6 py-4 text-base md:px-8" : "px-4 py-2 text-sm"
        }`}
      >
        <Search className={isLarge ? "w-5 h-5" : "w-4 h-4"} />
        <span className="hidden sm:inline">Search</span>
      </button>
    </form>
  );
}
