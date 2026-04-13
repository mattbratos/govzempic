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

  // Keyboard controls
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

  const remaining = cuttable.slice(index);
  // Reverse so the first item renders on top (highest DOM order = top of stack)
  const visible = remaining.slice(0, 3);

  const done = index >= cuttable.length;

  return (
    <div className="flex flex-col items-center px-4 pt-8 pb-16">
      {/* Hero text — only show before first swipe */}
      <AnimatePresence>
        {index === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center mb-8 max-w-md"
          >
            <h1 className="text-3xl font-black mb-2 leading-tight">
              Trim the federal fat.
              <br />
              <span className="text-emerald-400">Watch your check go up.</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Swipe right to axe a program. Swipe left to spare it.
              <br />
              Every cut puts money directly in your pocket.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {done ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center text-center mt-16 max-w-sm"
        >
          <div className="text-6xl mb-6">🪓</div>
          <h2 className="text-3xl font-black mb-3">You&apos;ve reviewed everything.</h2>
          <p className="text-muted-foreground mb-8">
            Switch to Table mode to review your cuts, add more, or change your mind.
          </p>
          <button
            onClick={() => setMode("table")}
            className="px-6 py-3 bg-foreground text-background rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            Review my cuts →
          </button>
        </motion.div>
      ) : (
        <>
          {/* Card stack */}
          <div className="relative w-full max-w-sm h-[480px]">
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

          {/* Action buttons */}
          <div className="flex items-center gap-10 mt-10">
            <button
              onClick={handleKeep}
              className="w-14 h-14 rounded-full border-2 border-border flex items-center justify-center text-muted-foreground hover:border-emerald-500 hover:text-emerald-500 transition-all text-xl font-bold"
              title="Keep (←)"
            >
              ✕
            </button>

            <div className="text-center">
              <p className="text-xs text-muted-foreground tabular-nums">
                {index + 1} / {cuttable.length}
              </p>
              <div className="w-24 h-1 bg-muted rounded-full mt-1 overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500 rounded-full"
                  animate={{ width: `${((index) / cuttable.length) * 100}%` }}
                  transition={{ type: "spring", stiffness: 100 }}
                />
              </div>
            </div>

            <button
              onClick={handleAxe}
              className="w-14 h-14 rounded-full border-2 border-red-500/40 bg-red-500/5 flex items-center justify-center text-red-400 hover:border-red-500 hover:bg-red-500/15 transition-all text-xl"
              title="Axe it (→)"
            >
              🪓
            </button>
          </div>

          {/* Keyboard hint */}
          <p className="text-xs text-muted-foreground/50 mt-4">
            ← / → arrow keys also work
          </p>
        </>
      )}
    </div>
  );
}
