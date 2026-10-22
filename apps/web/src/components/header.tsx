"use client";
import Link from "next/link";

import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

export default function Header() {
  const links = [
    { to: "/", label: "Home" },
    { to: "/homestays", label: "BuyHomestay" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/ai", label: "AI Chat" },
  ] as const;

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-4 py-2.5">
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="font-bold text-base text-primary">
            MyRehat
          </Link>
          {links.map(({ to, label }) => {
            return (
              <Link
                key={to}
                href={to}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserMenu />
        </div>
      </div>
      <hr />
    </div>
  );
}
