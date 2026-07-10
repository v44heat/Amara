# ---- dmi shelll
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  BedDouble,
  CalendarCheck,
  Users,
  Sparkles,
  UtensilsCrossed,
  BarChart3,
  Star,
  Contact,
  Images,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutGrid },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/rooms", label: "Rooms", icon: BedDouble },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/customers", label: "Customers", icon: Contact },
  { href: "/admin/staff", label: "Staff", icon: Users },
  { href: "/admin/housekeeping", label: "Housekeeping", icon: Sparkles },
  { href: "/admin/restaurant", label: "Restaurant", icon: UtensilsCrossed },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <main className="min-h-screen bg-[var(--color-canvas-soft)]">
      <SiteHeader />
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-6 pb-24 pt-32 lg:grid-cols-[220px_1fr] lg:px-10">
        <aside className="h-fit rounded-[var(--radius-card)] border border-[var(--color-mist)] bg-[var(--color-white)] p-4">
          <p className="px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-[var(--color-gold)]">
            Staff Console
          </p>
          <nav className="mt-2 flex flex-col gap-1">
            {LINKS.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-[var(--color-ink)] text-[var(--color-canvas)]"
                      : "text-[var(--color-ink)]/70 hover:bg-[var(--color-ink)]/5"
                  }`}
                >
                  <Icon size={16} /> {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </main>
  );
}
