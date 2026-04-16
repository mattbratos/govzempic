"use client";

import { useState } from "react";
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

const YEAR_OPTIONS = [5, 10, 15, 20];

function fmtMass(billions: number) {
  return billions >= 1000
    ? `$${(billions / 1000).toFixed(1)}T`
    : `$${billions.toFixed(0)}B`;
}

export function UBIPanel() {
  const { ubiPerMonth, ubiPerYear, ubiPerWeek, totalCutBillions, killCount, slimCount } = useCuts();
  const { currency, currentBudget, country } = useCountry();
  const { items } = currentBudget;
  const { total_outlays_billions, national_debt_billions, population } = currentBudget.meta;

  const [growthRate, setGrowthRate] = useState(country.avgGrowthRate);
  const [projectionYears, setProjectionYears] = useState(10);
  const [familySize, setFamilySize] = useState(1);
  const [targetBodyFatPct, setTargetBodyFatPct] = useState(20);

  const totalFatBillions = items
    .filter((i) => i.cuttable && i.parent === null)
    .reduce((sum, i) => sum + i.budget_billions, 0);
  const muscleBillions = items
    .filter((i) => !i.cuttable && i.parent === null)
    .reduce((sum, i) => sum + i.budget_billions, 0);
  const fatRemainingBillions = Math.max(0, totalFatBillions - totalCutBillions);
  const targetFatBillions = total_outlays_billions * (targetBodyFatPct / 100);
  const currentBodyFatPct = (fatRemainingBillions / total_outlays_billions) * 100;
  const reductionNeeded = Math.max(0, totalFatBillions - targetFatBillions);
  const cutProgress = reductionNeeded > 0
    ? Math.min(1, totalCutBillions / reductionNeeded)
    : 1;
  const goalReached = fatRemainingBillions <= targetFatBillions;

  const hasAnyCuts = totalCutBillions > 0;
  const fmt = (usd: number) => formatCurrency(usd, currency);

  const debtFreeYear = (() => {
    if (totalCutBillions <= 0) return null;
    const g = growthRate / 100;
    let years: number;
    if (g === 0) {
      years = national_debt_billions / totalCutBillions;
    } else {
      // geometric series: S * ((1+g)^n - 1) / g = D  →  n = log(1 + D*g/S) / log(1+g)
      years = Math.log(1 + (national_debt_billions * g) / totalCutBillions) / Math.log(1 + g);
    }
    return new Date().getFullYear() + Math.ceil(years);
  })();

  const projectedUBI = ubiPerMonth * Math.pow(1 + growthRate / 100, projectionYears);
  const familyMonthly = ubiPerMonth * familySize;

  return (
    <div className="flex flex-col h-full border-border" style={{ fontFamily: "var(--font-space-mono)" }}>
      {/* Panel header */}
      <div className="border-b border-border px-5 py-3 bg-muted/20">
        <p className="text-xs text-muted-foreground tracking-widest" style={{ fontFamily: "var(--font-orbitron)" }}>
          &gt; YOUR_DIVIDEND
        </p>
      </div>

      <div className="flex-1 flex flex-col px-5 py-6 gap-6 overflow-y-auto">

        {/* ── HERO NUMBERS ── */}
        <div className="flex flex-col gap-4">
          {/* Individual */}
          <div>
            <p className="text-xs text-muted-foreground tracking-widest mb-2">INDIVIDUAL/MO</p>
            <div
              className={`text-4xl font-black tabular-nums leading-none transition-colors duration-300 ${
                hasAnyCuts ? "text-[oklch(0.88_0.27_145)] glow-green-lg" : "text-muted-foreground/30"
              }`}
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              {fmt(ubiPerMonth)}
            </div>
          </div>

          {/* Family size slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-muted-foreground tracking-widest">HOUSEHOLD_SIZE</span>
              <span className="text-xs font-bold tabular-nums text-muted-foreground" style={{ fontFamily: "var(--font-orbitron)" }}>
                {familySize} {familySize === 1 ? "person" : "people"}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={familySize}
              onChange={(e) => setFamilySize(parseInt(e.target.value))}
              aria-label="Household size"
              className="w-full accent-[oklch(0.88_0.27_145)] h-1 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span><span>5</span><span>10</span>
            </div>
          </div>

          {/* Household total */}
          {familySize > 1 && (
            <div>
              <p className="text-xs text-muted-foreground tracking-widest mb-2">HOUSEHOLD/MO</p>
              <div
                className={`text-3xl font-black tabular-nums leading-none transition-colors duration-300 ${
                  hasAnyCuts ? "text-[oklch(0.88_0.27_145)] glow-green-md" : "text-muted-foreground/30"
                }`}
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                {fmt(familyMonthly)}
              </div>
            </div>
          )}

          <AnimatePresence>
            {hasAnyCuts && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="w-full h-px bg-primary/20 mb-3" />
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground tracking-widest">PER_YEAR</span>
                    <span className="text-lg font-bold text-foreground tabular-nums">{fmt(ubiPerYear)}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground tracking-widest">PER_WEEK</span>
                    <span className="text-base font-bold text-foreground tabular-nums">{fmt(ubiPerWeek)}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── GROWTH PROJECTION ── */}
        <div className="border border-border p-4 flex flex-col gap-4">
          <p className="text-xs text-muted-foreground tracking-widest" style={{ fontFamily: "var(--font-orbitron)" }}>
            &gt; PROJECTION
          </p>

          {/* GDP growth slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-muted-foreground tracking-widest">GDP_GROWTH</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs text-muted-foreground tracking-widest">
                  avg {country.avgGrowthRate}%
                </span>
                <span className="text-sm font-bold tabular-nums text-foreground" style={{ fontFamily: "var(--font-orbitron)" }}>
                  {growthRate.toFixed(1)}%
                </span>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={0.5}
              value={growthRate}
              onChange={(e) => setGrowthRate(parseFloat(e.target.value))}
              aria-label="GDP growth rate"
              className="w-full accent-[oklch(0.88_0.27_145)] h-1 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span><span>50%</span><span>100%</span>
            </div>
          </div>

          {/* Year buttons */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground tracking-widest">YEARS_AHEAD</span>
            <div className="flex gap-1.5">
              {YEAR_OPTIONS.map((y) => (
                <button
                  key={y}
                  onClick={() => setProjectionYears(y)}
                  className={`flex-1 py-1 text-xs font-bold tracking-widest border transition-all ${
                    projectionYears === y
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary/60 hover:text-primary"
                  }`}
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  +{y}
                </button>
              ))}
            </div>
          </div>

          {/* Projected values */}
          <div className="border-t border-border pt-3 flex flex-col gap-2">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-muted-foreground tracking-widest">
                {new Date().getFullYear() + projectionYears}_UBI/MO
              </span>
              <div
                className={`text-2xl font-black tabular-nums leading-none ${
                  hasAnyCuts ? "text-[oklch(0.88_0.27_145)]" : "text-muted-foreground/30"
                }`}
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                {fmt(projectedUBI)}
              </div>
            </div>
            {familySize > 1 && (
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-muted-foreground tracking-widest">
                  FAMILY_{familySize}/MO
                </span>
                <div
                  className={`text-2xl font-black tabular-nums leading-none ${
                    hasAnyCuts ? "text-[oklch(0.88_0.27_145)]" : "text-muted-foreground/30"
                  }`}
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  {fmt(projectedUBI * familySize)}
                </div>
              </div>
            )}
            {hasAnyCuts && growthRate > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                ×{Math.pow(1 + growthRate / 100, projectionYears).toFixed(2)} from today
              </p>
            )}
          </div>
        </div>

        {/* ── KILL LIST ── */}
        <div className="flex flex-col gap-3">
          <p className="text-xs text-muted-foreground tracking-widest" style={{ fontFamily: "var(--font-orbitron)" }}>
            &gt; KILL_LIST
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-destructive tracking-widest">KILLED</span>
              <span className={`text-xl font-black tabular-nums ${killCount > 0 ? "text-destructive" : "text-muted-foreground/30"}`}
                style={{ fontFamily: "var(--font-orbitron)" }}>
                {String(killCount).padStart(2, "0")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-orange-400 tracking-widest">SLIMMED</span>
              <span className={`text-xl font-black tabular-nums ${slimCount > 0 ? "text-orange-400" : "text-muted-foreground/30"}`}
                style={{ fontFamily: "var(--font-orbitron)" }}>
                {String(slimCount).padStart(2, "0")}
              </span>
            </div>
          </div>
          <div className="border-t border-border pt-3 flex flex-col gap-2">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-muted-foreground tracking-widest">SAVED</span>
              <span className="text-sm font-bold tabular-nums text-foreground">
                {totalCutBillions >= 1000
                  ? <><AnimatedNumber value={totalCutBillions / 1000} decimals={2} /> T</>
                  : <><AnimatedNumber value={totalCutBillions} decimals={1} /> B</>
                }
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-muted-foreground tracking-widest">DEBT_FREE</span>
              <motion.span
                key={debtFreeYear ?? "none"}
                initial={{ opacity: 0.4, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className={`text-sm font-bold tabular-nums ${debtFreeYear ? "text-[oklch(0.88_0.27_145)]" : "text-muted-foreground/30"}`}
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                {debtFreeYear ?? "—"}
              </motion.span>
            </div>
          </div>
        </div>

        {/* ── BODY COMPOSITION ── */}
        <div className="border border-border p-4 flex flex-col gap-4">
          <p className="text-xs text-muted-foreground tracking-widest" style={{ fontFamily: "var(--font-orbitron)" }}>
            &gt; BODY_COMPOSITION
          </p>

          {/* Fat mass */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-muted-foreground tracking-widest">FAT_MASS</span>
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`text-sm font-bold tabular-nums ${goalReached ? "text-[oklch(0.88_0.27_145)]" : "text-foreground"}`}
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  {fmtMass(fatRemainingBillions)}
                </span>
                <span className="text-xs text-muted-foreground">/ {fmtMass(targetFatBillions)}</span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
              {/* Target marker — position relative to total fat */}
              <div
                className="absolute top-0 bottom-0 w-px bg-[oklch(0.88_0.27_145)]/60 z-10"
                style={{ left: `${Math.min(99, (targetFatBillions / totalFatBillions) * 100)}%` }}
              />
              {/* Remaining fat bar */}
              <motion.div
                className="h-full bg-orange-500/70 rounded-full"
                animate={{ width: `${(fatRemainingBillions / totalFatBillions) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{currentBodyFatPct.toFixed(1)}% body fat</span>
              <span className={`font-bold ${goalReached ? "text-[oklch(0.88_0.27_145)]" : "text-muted-foreground"}`}>
                {goalReached ? "GOAL REACHED" : `${cutProgress < 1 ? `${(cutProgress * 100).toFixed(0)}% there` : "DONE"}`}
              </span>
            </div>
          </div>

          {/* Muscle mass */}
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-muted-foreground tracking-widest">MUSCLE_MASS</span>
            <span className="text-sm font-bold tabular-nums text-blue-400" style={{ fontFamily: "var(--font-orbitron)" }}>
              {fmtMass(muscleBillions)}
            </span>
          </div>

          {/* Target body fat slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-muted-foreground tracking-widest">TARGET_BODY_FAT</span>
              <span className="text-sm font-bold tabular-nums text-foreground" style={{ fontFamily: "var(--font-orbitron)" }}>
                {targetBodyFatPct}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              step={1}
              value={targetBodyFatPct}
              onChange={(e) => setTargetBodyFatPct(parseInt(e.target.value))}
              aria-label="Target body fat percentage"
              className="w-full accent-[oklch(0.88_0.27_145)] h-1 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span><span>20%</span><span>40%</span>
            </div>
          </div>
        </div>

        {/* ── COUNTRY STATS ── */}
        <div className="border-t border-border pt-6 flex flex-col gap-2">
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-muted-foreground tracking-widest">TOTAL_BUDGET</span>
            <span className="text-sm font-bold tabular-nums text-foreground">
              ${total_outlays_billions >= 1000
                ? (total_outlays_billions / 1000).toFixed(1) + "T"
                : total_outlays_billions + "B"}
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-muted-foreground tracking-widest">POPULATION</span>
            <span className="text-sm font-bold tabular-nums text-foreground">
              {(population / 1_000_000).toFixed(1)}M
            </span>
          </div>
        </div>

        {/* Context note */}
        <div className="text-xs text-muted-foreground leading-relaxed">
          {"// 50% OF SAVINGS SPLIT"}
          <br />
          {"// EQUALLY ACROSS "}
          {(population / 1_000_000).toFixed(0)}
          {"M PEOPLE"}
        </div>

      </div>

      {/* Footer */}
      <div className="border-t border-border px-5 py-3">
        <p className="text-xs text-muted-foreground tracking-widest">
          FY2026 · CBO DATA
        </p>
      </div>
    </div>
  );
}

/* ── Compact bar for mobile ── */
export function UBIBar() {
  const { ubiPerMonth, totalCutBillions, killCount, slimCount } = useCuts();
  const { currency } = useCountry();
  const hasAnyCuts = totalCutBillions > 0;

  return (
    <div className="border border-border bg-muted/10 px-4 py-3 mb-4 flex items-center justify-between gap-4"
      style={{ fontFamily: "var(--font-space-mono)" }}>
      <div>
        <p className="text-xs text-muted-foreground tracking-widest">DIVIDEND/MO</p>
        <p className={`text-2xl font-black tabular-nums leading-tight ${hasAnyCuts ? "text-[oklch(0.88_0.27_145)] glow-green-md" : "text-muted-foreground/30"}`}
          style={{ fontFamily: "var(--font-orbitron)" }}>
          {formatCurrency(ubiPerMonth, currency)}
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
