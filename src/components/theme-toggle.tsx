"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="border border-border px-2 py-1.5 text-xs text-muted-foreground hover:border-primary/60 hover:text-primary transition-all terminal-glow tracking-widest"
      style={{ fontFamily: "var(--font-orbitron)" }}
    >
      {theme === "dark" ? "LIGHT" : "DARK"}
    </button>
  );
}
