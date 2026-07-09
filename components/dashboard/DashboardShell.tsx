"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, CalendarCheck, CreditCard, Heart, User, Bell } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";

const LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/dashboard/bookings", label: "My bookings", icon: CalendarCheck },
  { href: "/dashboard/payments", label: "Payment history", icon: CreditCard },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 pb-24 pt-32 lg:grid-cols-[240px_1fr] lg:px-10">
        <aside className="h-fit rounded-[var(--radius-card)] border border-[var(--color-mist)] p-4">
          <nav className="flex flex-col gap-1">
            {LINKS.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
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
