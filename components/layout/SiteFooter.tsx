"use client";

import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";

// lucide-react no longer ships brand/logo icons — small inline marks instead.
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16} {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.77l-.44 2.91h-2.33V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
    </svg>
  );
}
function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} width={16} height={16} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={14} height={14} {...props}>
      <path d="M18.3 2H21l-6.5 7.4L22.2 22h-6.9l-5.4-7-6.2 7H1l7-8-7.7-11h7.1l4.9 6.4L18.3 2Zm-1.2 18h1.9L7 4h-2l12.1 16Z" />
    </svg>
  );
}

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/newsletter", { email });
      toast.success("You're on the list — welcome to Amara.");
      setEmail("");
    } catch {
      toast.error("Couldn't subscribe right now. Try again shortly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer id="contact" className="bg-[var(--color-ink)] text-[var(--color-canvas)]">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <span className="font-display text-3xl">Amara</span>
            <p className="mt-4 max-w-xs text-sm text-[var(--color-canvas)]/70">
              A landmark of Nairobi hospitality, set among the Karen hills — where East
              African warmth meets modern craft.
            </p>
            <div className="mt-6 flex gap-3">
              {[FacebookIcon, InstagramIcon, XIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-canvas)]/20 transition-colors hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">
              Explore
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-[var(--color-canvas)]/75">
              <li><Link href="/search">Rooms &amp; Suites</Link></li>
              <li><Link href="/#dining">Dining</Link></li>
              <li><Link href="/#experiences">Spa &amp; Wellness</Link></li>
              <li><Link href="/#gallery">Gallery</Link></li>
              <li><Link href="/#faq">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">
              Contact
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-[var(--color-canvas)]/75">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                Karen Road, Nairobi, Kenya
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="shrink-0" /> +254 700 123 456
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="shrink-0" /> reservations@amarahotel.co.ke
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">
              Stay in the loop
            </h4>
            <p className="mt-4 text-sm text-[var(--color-canvas)]/70">
              Seasonal offers and Nairobi travel notes, once or twice a month.
            </p>
            <form onSubmit={subscribe} className="mt-4 flex gap-2">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-full border border-[var(--color-canvas)]/25 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-[var(--color-canvas)]/40 focus:border-[var(--color-gold)]"
              />
              <Button type="submit" variant="secondary" size="sm" loading={loading}>
                Join
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-canvas)]/10 pt-8 text-xs text-[var(--color-canvas)]/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Amara Hotel &amp; Residences. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
