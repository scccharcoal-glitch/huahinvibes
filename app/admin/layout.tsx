import Link from "next/link";
import { LayoutDashboard, UtensilsCrossed, Hotel, Compass, Plus, Settings } from "lucide-react";

const sideNav = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/places?type=RESTAURANT", icon: UtensilsCrossed, label: "Restaurants" },
  { href: "/admin/places?type=HOTEL", icon: Hotel, label: "Hotels" },
  { href: "/admin/places?type=ATTRACTION", icon: Compass, label: "Attractions" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-accent/30">
      {/* Sidebar */}
      <aside className="w-64 bg-foreground text-background flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="text-primary font-extrabold text-lg">Hua Hin Vibes</Link>
          <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sideNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link href="/admin/places/new" className="flex items-center gap-2 w-full gradient-btn text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            Add New Place
          </Link>
          <Link href="/" className="flex items-center gap-2 text-xs text-gray-400 hover:text-white px-3 py-1.5 transition-colors">
            <Settings className="w-3 h-3" />
            View Public Site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
