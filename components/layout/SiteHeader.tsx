"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun, User, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";

const NAV_LINKS = [
  { href: "/search", label: "Rooms & Suites" },
  { href: "/#dining", label: "Dining" },
  { href: "/#experiences", label: "Experiences" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Intentional: reads the DOM (an external system) to sync initial icon state.
    const stored = document.documentElement.classList.contains("dark");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(stored);
  }, []);

  function toggleDark() {
    document.documentElement.classList.toggle("dark");
    setDark((d) => !d);
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[var(--color-canvas)]/90 backdrop-blur-lg shadow-[var(--shadow-soft)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-2xl tracking-tight text-[var(--color-ink)]">
            Amara
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.3em] text-[var(--color-gold)] sm:block">
            Nairobi
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--color-ink)]/80 transition-colors hover:text-[var(--color-ink)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            aria-label="Toggle dark mode"
            onClick={toggleDark}
            className="rounded-full p-2 text-[var(--color-ink)]/70 transition-colors hover:bg-[var(--color-ink)]/5"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <>
              <Link
                href={user.role === "GUEST" ? "/dashboard" : "/admin"}
                className="flex items-center gap-2 rounded-full border border-[var(--color-ink)]/15 px-4 py-2 text-sm font-medium text-[var(--color-ink)] hover:border-[var(--color-ink)]/40"
              >
                {user.role === "GUEST" ? <User size={16} /> : <LayoutDashboard size={16} />}
                {user.firstName}
              </Link>
              <Button variant="ghost" size="sm" onClick={() => logout()}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-[var(--color-ink)]/80 hover:text-[var(--color-ink)]">
                Sign in
              </Link>
              <Link href="/search">
                <Button size="sm">Book now</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-full p-2 text-[var(--color-ink)] lg:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[var(--color-ink)]/40 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="ml-auto flex h-full w-72 flex-col gap-6 bg-[var(--color-canvas)] p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="ml-auto" onClick={() => setOpen(false)} aria-label="Close menu">
                <X size={22} />
              </button>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-xl text-[var(--color-ink)]"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link href={user.role === "GUEST" ? "/dashboard" : "/admin"}>
                      <Button className="w-full">My account</Button>
                    </Link>
                    <Button variant="outline" className="w-full" onClick={() => logout()}>
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="outline" className="w-full">
                        Sign in
                      </Button>
                    </Link>
                    <Link href="/search">
                      <Button className="w-full">Book now</Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
