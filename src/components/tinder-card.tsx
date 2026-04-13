"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { BudgetItem, TYPE_LABELS } from "@/lib/budget";

interface Props {
  item: BudgetItem;
  stackIndex: number;
  onAxe?: () => void;
  onKeep?: () => void;
}

const SWIPE_THRESHOLD = 120;
const EXIT_X = 620;

const TYPE_TAG: Record<BudgetItem["type"], string> = {
  mandatory: "MANDATORY",
  discretionary_defense: "DEFENSE",
  discretionary_nondefense: "DISCRETIONARY",
  interest: "DEBT",
};

function CardFace({ item }: { item: BudgetItem }) {
  const budgetStr =
    item.budget_billions >= 100
      ? `$${Math.round(item.budget_billions)}B`
      : `$${item.budget_billions.toFixed(1)}B`;

  return (
    <div
      className="bg-card border border-border select-none overflow-hidden"
      style={{ fontFamily: "var(--font-space-mono)" }}
    >
      {/* Terminal title bar */}
      <div className="border-b border-border px-4 py-2 flex items-center justify-between bg-muted/30">
        <span className="text-xs text-muted-foreground tracking-widest uppercase">
          &gt; {TYPE_TAG[item.type]}
        </span>
        <span className="text-xs text-muted-foreground tracking-wider truncate max-w-[180px]">
          // {item.agency.toUpperCase()}
        </span>
      </div>

      <div className="p-5">
        {/* Program name */}
        <h2
          className="text-lg font-black leading-tight mb-4 tracking-wide uppercase"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          {item.name}
        </h2>

        {/* Budget line */}
        <div className="mb-1">
          <span className="text-xs text-muted-foreground tracking-widest">
            ANNUAL_BUDGET =&nbsp;
          </span>
          <span className="text-4xl font-bold tabular-nums text-foreground">
            {budgetStr}
          </span>
        </div>
        <div className="border-t border-border/50 mb-4 mt-3" />

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-5 line-clamp-3">
          {item.description}
        </p>

        {/* Dividend block */}
        <div className="border border-primary/30 bg-primary/5 p-4">
          <p className="text-xs text-muted-foreground tracking-widest mb-2">
            &gt; IF_AXED: DIVIDEND_PER_AMERICAN
          </p>
          <p className="text-3xl font-bold text-primary tabular-nums">
            +${item.ubi_per_month.toFixed(2)}
            <span className="text-sm font-normal text-muted-foreground">
              /month
            </span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            ${item.ubi_per_year.toFixed(2)}/yr &nbsp;·&nbsp; $
            {item.ubi_per_week.toFixed(2)}/wk
          </p>
        </div>
      </div>
    </div>
  );
}

export function TinderCard({ item, stackIndex, onAxe, onKeep }: Props) {
  const [gone, setGone] = useState(false);
  const exitX = useRef(0);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-12, 12]);
  const keepOpacity = useTransform(x, [-SWIPE_THRESHOLD, -20], [1, 0]);
  const axeOpacity = useTransform(x, [20, SWIPE_THRESHOLD], [0, 1]);

  const scale = 1 - stackIndex * 0.04;
  const translateY = stackIndex * 16;

  if (stackIndex > 0) {
    return (
      <motion.div
        className="absolute inset-x-0"
        initial={{ scale, y: translateY + 10, opacity: 0.5 }}
        animate={{ scale, y: translateY, opacity: 1 - stackIndex * 0.2 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ zIndex: 10 - stackIndex * 5 }}
      >
        <CardFace item={item} />
      </motion.div>
    );
  }

  const triggerGone = (direction: "left" | "right") => {
    exitX.current = direction === "right" ? EXIT_X : -EXIT_X;
    setGone(true);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      triggerGone("right");
      onAxe?.();
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      triggerGone("left");
      onKeep?.();
    }
  };

  return (
    <motion.div
      className="absolute inset-x-0 cursor-grab active:cursor-grabbing"
      style={{ x, rotate, zIndex: 30 }}
      drag={gone ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      animate={
        gone
          ? {
              x: exitX.current,
              opacity: 0,
              rotate: exitX.current > 0 ? 14 : -14,
            }
          : undefined
      }
      transition={
        gone
          ? { duration: 0.32, ease: "easeOut" }
          : { type: "spring", stiffness: 400, damping: 25 }
      }
    >
      {/* KEEP stamp */}
      <motion.div
        style={{ opacity: keepOpacity, fontFamily: "var(--font-orbitron)" }}
        className="absolute top-4 left-4 z-10 border-2 border-primary text-primary font-black text-lg px-3 py-0.5 -rotate-12 pointer-events-none tracking-widest"
      >
        KEEP
      </motion.div>
      {/* AXE stamp */}
      <motion.div
        style={{ opacity: axeOpacity, fontFamily: "var(--font-orbitron)" }}
        className="absolute top-4 right-4 z-10 border-2 border-destructive text-destructive font-black text-lg px-3 py-0.5 rotate-12 pointer-events-none tracking-widest"
      >
        AXED
      </motion.div>

      <CardFace item={item} />
    </motion.div>
  );
}
