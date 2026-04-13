"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BudgetItem } from "@/lib/budget";
import { TinderCard } from "./tinder-card";
import { useCuts } from "@/context/cuts-context";

export function TinderMode({ items }: { items: BudgetItem[] }) {
  const { toggleCut, setMode } = useCuts();
  const cuttable = items.filter((i) => i.cuttable);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (index >= cuttable.length) return;
      if (e.key === "ArrowRight" || e.key === "d") handleAxe();
      if (e.key === "ArrowLeft" || e.key === "a") handleKeep();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const handleAxe = () => {
    if (index >= cuttable.length) return;
    toggleCut(cuttable[index].id);
    setIndex((i) => i + 1);
  };

  const handleKeep = () => {
    setIndex((i) => i + 1);
  };

  const visible = cuttable.slice(index, index + 3);
  const done = index >= cuttable.length;
  const pct = Math.round((index / cuttable.length) * 100);

  return (
    <div
      className="flex flex-col items-center px-4 pt-8 pb-16"
      style={{ fontFamily: "var(--font-space-mono)" }}
    >
      {/* Hero — only before first swipe */}
      <AnimatePresence>
        {index === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center mb-8 max-w-md"
          >
            <h1
              className="text-2xl font-black mb-3 tracking-wide uppercase leading-snug"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              TRIM THE FEDERAL FAT.
              <br />
              <span className="text-primary">WATCH YOUR CHECK GO UP.</span>
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              // SWIPE RIGHT TO AXE &nbsp;·&nbsp; SWIPE LEFT TO SPARE
              <br />
              // EVERY CUT PUTS MONEY IN YOUR POCKET
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {done ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center text-center mt-16 max-w-sm border border-border p-8"
        >
          <p className="text-xs text-muted-foreground tracking-widest mb-4">
            &gt; PROCESS_COMPLETE
          </p>
          <h2
            className="text-xl font-black mb-3 tracking-wide uppercase"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            KILL LIST COMPILED.
          </h2>
          <p className="text-xs text-muted-foreground mb-8 leading-relaxed">
            // SWITCH TO TABLE MODE TO REVIEW YOUR CUTS, ADD MORE, OR RESTORE
          </p>
          <button
            onClick={() => setMode("table")}
            className="px-6 py-3 bg-primary text-primary-foreground text-xs font-bold tracking-widest uppercase border border-primary hover:opacity-90 transition-opacity terminal-glow"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            &gt; REVIEW CUTS
          </button>
        </motion.div>
      ) : (
        <>
          {/* Card stack */}
          <div className="relative w-full max-w-sm h-[500px]">
            {[...visible].reverse().map((item, reverseIdx) => {
              const stackIndex = visible.length - 1 - reverseIdx;
              return (
                <TinderCard
                  key={item.id}
                  item={item}
                  stackIndex={stackIndex}
                  onAxe={stackIndex === 0 ? handleAxe : undefined}
                  onKeep={stackIndex === 0 ? handleKeep : undefined}
                />
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-8 mt-10">
            <button
              onClick={handleKeep}
              className="px-5 py-2 border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all text-xs font-bold tracking-widest terminal-glow"
              style={{ fontFamily: "var(--font-orbitron)" }}
              title="Keep (←)"
            >
              [ KEEP ]
            </button>

            {/* Progress */}
            <div className="text-center min-w-[80px]">
              <p className="text-xs text-muted-foreground tabular-nums">
                {String(index + 1).padStart(2, "0")}/{String(cuttable.length).padStart(2, "0")}
              </p>
              <div className="w-20 h-px bg-border mt-2 overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  animate={{ width: `${pct}%` }}
                  transition={{ type: "spring", stiffness: 100 }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{pct}%</p>
            </div>

            <button
              onClick={handleAxe}
              className="px-5 py-2 border border-destructive/60 text-destructive hover:border-destructive hover:bg-destructive/10 transition-all text-xs font-bold tracking-widest terminal-glow"
              style={{ fontFamily: "var(--font-orbitron)" }}
              title="Axe it (→)"
            >
              [ AXE ]
            </button>
          </div>

          <p className="text-xs text-muted-foreground/40 mt-5 tracking-widest">
            // ARROW KEYS ALSO WORK
          </p>
        </>
      )}
    </div>
  );
}
