"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/ai") return null;

  return (
    <footer className="border-t border-border/40 bg-background/50 text-xs text-muted-foreground">
      <div className="container mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
        {/* Left: Wordmark & Concise Brand Statement */}
        <div className="space-y-1.5">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-foreground transition-opacity hover:opacity-90"
          >
            MyRehat
          </Link>
          <p className="max-w-md text-xs text-muted-foreground">
            Direct homestay marketplace and host network across Malaysia.
          </p>
          <p className="text-[11px] text-muted-foreground/70">
            &copy; 2026 MyRehat. All rights reserved.
          </p>
        </div>

        {/* Right: Inline Editorial Links (Kinfolk / Airbnb Style) */}
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-muted-foreground">
          <Link
            href="/homestays"
            className="transition-colors hover:text-foreground"
          >
            Marketplace
          </Link>
          <span className="text-border select-none">&middot;</span>
          <Link
            href="/dashboard"
            className="transition-colors hover:text-foreground"
          >
            Host Dashboard
          </Link>
          <span className="text-border select-none">&middot;</span>
          <Link
            href="/ai"
            className="transition-colors hover:text-foreground"
          >
            AI Concierge
          </Link>
          <span className="text-border select-none">&middot;</span>
          <a
            href="https://wa.me/60123456789"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            WhatsApp Support
          </a>
        </nav>
      </div>
    </footer>
  );
}
