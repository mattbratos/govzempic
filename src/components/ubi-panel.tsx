"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCuts } from "@/context/cuts-context";
import { useCountry } from "@/context/country-context";
import { formatCurrency } from "@/lib/countries";

function AnimatedNumber({ value, decimals = 2 }: { value: number; decimals?: number }) {
  return (
    <motion.span
      key={value.toFixed(decimals)}
      initial={{ opacity: 0.4, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
    >
      {value.toFixed(decimals)}
    </motion.span>
  );
}

export function UBIPanel() {
  const {
    ubiPerMonth,
    ubiPerYear,
    ubiPerWeek,
    totalCutBillions,
    killCount,
    slimCount,
  } = useCuts();
  const { currency } = useCountry();

  const hasAnyCuts = totalCutBillions > 0;
  const fmt = (usd: number) => formatCurrency(usd, currency);

  return (
    <div
      className="flex flex-col h-full border-border"
      style={{ fontFamily: "var(--font-space-mono)" }}
    >
      {/* Panel header */}
      <div className="border-b border-border px-5 py-3 bg-muted/20">
        <p
          className="text-xs text-muted-foreground tracking-widest"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          &gt; YOUR_DIVIDEND
        </p>
      </div>

      <div className="flex-1 flex flex-col px-5 py-6 gap-6">
        {/* Main UBI number */}
        <div>
          <p className="text-xs text-muted-foreground tracking-widest mb-3">
            PER_MONTH
          </p>
          <div
            className={`text-5xl font-black tabular-nums leading-none transition-colors duration-300 ${
              hasAnyCuts ? "text-[oklch(0.88_0.27_145)] glow-green-lg" : "text-muted-foreground/30"
            }`}
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            {fmt(ubiPerMonth)}
          </div>
          <AnimatePresence>
            {hasAnyCuts && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1"
              >
                <div className="w-full h-px bg-primary/20 mt-4 mb-4" />
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground tracking-widest">PER_YEAR</span>
                    <span className="text-lg font-bold text-foreground tabular-nums">
                      {fmt(ubiPerYear)}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground tracking-widest">PER_WEEK</span>
                    <span className="text-base font-bold text-foreground tabular-nums">
                      {fmt(ubiPerWeek)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Stats */}
        <div className="flex flex-col gap-3">
          <p
            className="text-xs text-muted-foreground tracking-widest"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            &gt; KILL_LIST
          </p>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-destructive tracking-widest">KILLED</span>
              <span
                className={`text-xl font-black tabular-nums ${
                  killCount > 0 ? "text-destructive" : "text-muted-foreground/30"
                }`}
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                {String(killCount).padStart(2, "0")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-orange-400 tracking-widest">SLIMMED</span>
              <span
                className={`text-xl font-black tabular-nums ${
                  slimCount > 0 ? "text-orange-400" : "text-muted-foreground/30"
                }`}
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                {String(slimCount).padStart(2, "0")}
              </span>
            </div>
          </div>

          <div className="border-t border-border pt-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-muted-foreground tracking-widest">SAVED</span>
              <span className="text-sm font-bold tabular-nums text-foreground">
                $<AnimatedNumber value={totalCutBillions} decimals={1} />B
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Context note */}
        <div className="text-xs text-muted-foreground/50 leading-relaxed">
          // 50% OF SAVINGS
          <br />
          // SPLIT BETWEEN
          <br />
          // 335M AMERICANS
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border px-5 py-3">
        <p className="text-xs text-muted-foreground/40 tracking-widest">
          FY2026 · CBO DATA
        </p>
      </div>
    </div>
  );
}

/* ── Compact bar for mobile ─────────────────────────── */
export function UBIBar() {
  const { ubiPerMonth, totalCutBillions, killCount, slimCount } = useCuts();
  const hasAnyCuts = totalCutBillions > 0;

  return (
    <div
      className="border border-border bg-muted/10 px-4 py-3 mb-4 flex items-center justify-between gap-4"
      style={{ fontFamily: "var(--font-space-mono)" }}
    >
      <div>
        <p className="text-xs text-muted-foreground tracking-widest">DIVIDEND/MO</p>
        <p
          className={`text-2xl font-black tabular-nums leading-tight ${
            hasAnyCuts ? "text-primary glow-green-md" : "text-muted-foreground/30"
          }`}
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          ${ubiPerMonth.toFixed(2)}
        </p>
      </div>
      <div className="flex gap-4 text-xs">
        <div className="text-center">
          <p className="text-destructive tracking-widest">KILLED</p>
          <p className="text-lg font-black text-destructive" style={{ fontFamily: "var(--font-orbitron)" }}>
            {String(killCount).padStart(2, "0")}
          </p>
        </div>
        <div className="text-center">
          <p className="text-orange-400 tracking-widest">SLIMMED</p>
          <p className="text-lg font-black text-orange-400" style={{ fontFamily: "var(--font-orbitron)" }}>
            {String(slimCount).padStart(2, "0")}
          </p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground tracking-widest">SAVED</p>
          <p className="text-lg font-black text-foreground" style={{ fontFamily: "var(--font-orbitron)" }}>
            ${totalCutBillions.toFixed(0)}B
          </p>
        </div>
      </div>
    </div>
  );
}
