"use client";

import { ThemeToggle } from "./theme-toggle";
import { CountrySelector } from "./country-selector";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        <a
          href="/"
          className="shrink-0 text-base font-black tracking-widest uppercase"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          <span className="text-destructive">☠ </span>
          GOV<span className="text-destructive">ZEMPIC</span>
          <span className="cursor text-muted-foreground" />
        </a>

        <div className="flex-1" />

        <p
          className="hidden sm:block text-xs text-muted-foreground tracking-widest"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          // TRIM THE FEDERAL FAT. WATCH YOUR CHECK GO UP.
        </p>

        <div className="flex-1" />

        <CountrySelector />
        <ThemeToggle />
      </div>
    </header>
  );
}
