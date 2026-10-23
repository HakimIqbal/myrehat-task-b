"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

type NavLink = {
  href: "/" | "/homestays" | "/dashboard" | "/ai";
  label: string;
};

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = authClient.useSession();

  // Guest: Home, BuyHomestay, AI Concierge
  // Authenticated: Home, BuyHomestay, Dashboard, AI Concierge
  const navLinks: NavLink[] = [
    { href: "/", label: "Home" },
    { href: "/homestays", label: "BuyHomestay" },
    ...(session?.user ? [{ href: "/dashboard" as const, label: "Dashboard" }] : []),
    { href: "/ai", label: "AI Concierge" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl transition-all">
      <div className="container mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo & Desktop Nav */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-foreground transition-opacity hover:opacity-90"
          >
            MyRehat
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-foreground/5 text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Theme Toggle + User Menu (Unified Harmonious Group) */}
        <div className="flex items-center gap-2.5">
          <ModeToggle />
          <UserMenu />

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-9 items-center justify-center rounded-full border border-border/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground md:hidden cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="border-b border-border/40 bg-background/95 px-4 py-3 backdrop-blur-xl md:hidden space-y-1 animate-in slide-in-from-top-2">
          {navLinks.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-foreground/10 text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
