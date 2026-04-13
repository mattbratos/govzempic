"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCuts } from "@/context/cuts-context";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const { mode, setMode, totalCutBillions, ubiPerMonth, ubiPerYear, cutCount } =
    useCuts();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
        {/* Logo */}
        <a href="/" className="font-black text-lg tracking-tight shrink-0">
          Gov<span className="text-red-500">Zempic</span>
        </a>

        {/* Mode toggle */}
        <div className="flex bg-muted rounded-lg p-0.5 gap-0.5 shrink-0">
          {(["tinder", "table"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                mode === m
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "tinder" ? "Swipe" : "Table"}
            </button>
          ))}
        </div>

        {/* UBI counter — centre */}
        <div className="flex-1 flex items-center justify-center min-w-0">
          <AnimatePresence mode="wait">
            {totalCutBillions > 0 ? (
              <motion.div
                key="counter"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="flex items-baseline gap-2 text-center"
              >
                <motion.span
                  key={ubiPerMonth.toFixed(2)}
                  initial={{ scale: 1.2, color: "#4ade80" }}
                  animate={{ scale: 1 }}
                  className="text-green-400 font-black text-lg tabular-nums"
                >
                  +${ubiPerMonth.toFixed(2)}
                  <span className="text-sm font-normal text-muted-foreground">
                    /mo
                  </span>
                </motion.span>
                <span className="hidden sm:inline text-xs text-muted-foreground">
                  ${ubiPerYear.toFixed(0)}/yr &middot; {cutCount} cut
                  {cutCount !== 1 ? "s" : ""} &middot; $
                  {totalCutBillions.toFixed(1)}B
                </span>
              </motion.div>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-muted-foreground text-sm hidden sm:block"
              >
                Start cutting to see your dividend
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}
