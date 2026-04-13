"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCuts } from "@/context/cuts-context";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const { mode, setMode, totalCutBillions, ubiPerMonth, ubiPerYear, cutCount } =
    useCuts();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Logo */}
        <a
          href="/"
          className="shrink-0 text-base font-black tracking-widest uppercase"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          <span className="text-muted-foreground">&gt; </span>
          GOV<span className="text-destructive">ZEMPIC</span>
          <span className="cursor text-muted-foreground" />
        </a>

        {/* Mode toggle */}
        <div className="flex border border-border shrink-0">
          {(["tinder", "table"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-1.5 text-xs font-bold tracking-widest uppercase transition-all terminal-glow ${
                mode === m
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              {m === "tinder" ? "[ SWIPE ]" : "[ TABLE ]"}
            </button>
          ))}
        </div>

        {/* UBI counter */}
        <div className="flex-1 flex items-center justify-center min-w-0 font-mono">
          <AnimatePresence mode="wait">
            {totalCutBillions > 0 ? (
              <motion.div
                key="counter"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="flex items-center gap-3"
              >
                <span className="text-muted-foreground text-xs tracking-widest hidden sm:block">
                  DIVIDEND:
                </span>
                <motion.span
                  key={ubiPerMonth.toFixed(2)}
                  initial={{ scale: 1.15 }}
                  animate={{ scale: 1 }}
                  className="text-primary font-bold text-base tabular-nums terminal-glow-active"
                >
                  +${ubiPerMonth.toFixed(2)}
                  <span className="text-xs text-muted-foreground">/mo</span>
                </motion.span>
                <span className="hidden md:inline text-xs text-muted-foreground">
                  // ${ubiPerYear.toFixed(0)}/yr &nbsp;·&nbsp; {cutCount}{" "}
                  CUT{cutCount !== 1 ? "S" : ""} &nbsp;·&nbsp; $
                  {totalCutBillions.toFixed(1)}B
                </span>
              </motion.div>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-muted-foreground text-xs tracking-wider hidden sm:block"
              >
                // START CUTTING TO SEE YOUR DIVIDEND
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}
