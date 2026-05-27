"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import SearchBox from "@/components/SearchBox";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/restaurants", label: "Restaurants" },
  { href: "/hotels", label: "Hotels" },
  { href: "/attractions", label: "Attractions" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="glass-nav sticky top-0 z-50 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-18 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 text-primary font-extrabold text-xl tracking-tight">
          Hua Hin Vibes
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition-colors hover:text-primary ${
                pathname === link.href
                  ? "text-primary border-b-2 border-primary pb-0.5"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Search */}
        <SearchBox className="hidden lg:flex" placeholder="Somtam, seafood, spa..." />

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="hidden md:flex gradient-btn text-white px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Admin
          </Link>
          <button className="text-muted-foreground hover:text-primary transition-colors">
            <User className="w-6 h-6" />
          </button>
          <button
            className="md:hidden text-muted-foreground hover:text-primary"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block text-sm font-semibold py-2 transition-colors ${
                pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <SearchBox placeholder="Search restaurants..." />
        </div>
      )}
    </nav>
  );
}
