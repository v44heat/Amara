"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function BookingSearchStub() {
  const router = useRouter();
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);

  const [checkIn, setCheckIn] = useState(tomorrow.toISOString().slice(0, 10));
  const [checkOut, setCheckOut] = useState(dayAfter.toISOString().slice(0, 10));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      adults: String(adults),
      children: String(children),
    });
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSearch}
      className="relative mx-auto flex w-full max-w-4xl flex-col overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-white)] shadow-[var(--shadow-lift)] md:flex-row"
    >
      {/* Stub label */}
      <div className="flex shrink-0 flex-col justify-center gap-1 bg-[var(--color-ink)] px-6 py-5 text-[var(--color-canvas)] md:w-44">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-gold)]">
          Boarding
        </span>
        <span className="font-display text-lg leading-tight">Reserve<br />your stay</span>
      </div>

      {/* Perforated notch divider */}
      <div className="stub-notch hidden w-0 border-l-2 border-dashed border-[var(--color-mist)] md:block" />

      <div className="grid flex-1 grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-5 lg:items-end">
        <label className="flex flex-col gap-1.5 lg:col-span-1">
          <span className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-[var(--color-ink)]/60">
            <CalendarDays size={14} /> Check-in
          </span>
          <input
            type="date"
            required
            value={checkIn}
            min={today.toISOString().slice(0, 10)}
            onChange={(e) => setCheckIn(e.target.value)}
            className="rounded-lg border border-[var(--color-mist)] px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]"
          />
        </label>

        <label className="flex flex-col gap-1.5 lg:col-span-1">
          <span className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-[var(--color-ink)]/60">
            <CalendarDays size={14} /> Check-out
          </span>
          <input
            type="date"
            required
            value={checkOut}
            min={checkIn}
            onChange={(e) => setCheckOut(e.target.value)}
            className="rounded-lg border border-[var(--color-mist)] px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]"
          />
        </label>

        <label className="flex flex-col gap-1.5 lg:col-span-1">
          <span className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-[var(--color-ink)]/60">
            <Users size={14} /> Adults
          </span>
          <select
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            className="rounded-lg border border-[var(--color-mist)] px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} Adult{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 lg:col-span-1">
          <span className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-[var(--color-ink)]/60">
            <Users size={14} /> Children
          </span>
          <select
            value={children}
            onChange={(e) => setChildren(Number(e.target.value))}
            className="rounded-lg border border-[var(--color-mist)] px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]"
          >
            {[0, 1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n} Child{n !== 1 ? "ren" : ""}
              </option>
            ))}
          </select>
        </label>

        <Button type="submit" size="md" className="w-full lg:col-span-1">
          <Search size={16} /> Search
        </Button>
      </div>
    </form>
  );
}
