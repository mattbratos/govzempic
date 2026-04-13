"use client";

import { useState, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  PanInfo,
} from "framer-motion";
import { BudgetItem, TYPE_LABELS, TYPE_COLORS } from "@/lib/budget";

interface Props {
  item: BudgetItem;
  stackIndex: number; // 0 = top card, 1 = middle, 2 = back
  onAxe?: () => void;
  onKeep?: () => void;
}

const SWIPE_THRESHOLD = 120;
const EXIT_X = 600;

function TypeBadge({ type }: { type: BudgetItem["type"] }) {
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full border ${TYPE_COLORS[type]}`}
    >
      {TYPE_LABELS[type]}
    </span>
  );
}

function CardFace({ item }: { item: BudgetItem }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl select-none">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <TypeBadge type={item.type} />
        <span className="text-xs text-muted-foreground">{item.agency}</span>
      </div>

      {/* Name */}
      <h2 className="text-2xl font-black leading-tight mb-3">{item.name}</h2>

      {/* Budget */}
      <div className="mb-4">
        <span className="text-5xl font-black tabular-nums">
          ${item.budget_billions >= 100
            ? Math.round(item.budget_billions)
            : item.budget_billions.toFixed(1)}
          <span className="text-2xl font-bold text-muted-foreground">B</span>
        </span>
        <p className="text-xs text-muted-foreground mt-0.5">annual budget</p>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3">
        {item.description}
      </p>

      {/* UBI impact */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
        <p className="text-xs text-muted-foreground mb-1">
          If axed, every American gets
        </p>
        <p className="text-3xl font-black text-emerald-400 tabular-nums">
          +${item.ubi_per_month.toFixed(2)}
          <span className="text-sm font-normal text-muted-foreground">
            /month
          </span>
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          ${item.ubi_per_year.toFixed(2)}/yr &middot; $
          {item.ubi_per_week.toFixed(2)}/wk
        </p>
      </div>
    </div>
  );
}

export function TinderCard({ item, stackIndex, onAxe, onKeep }: Props) {
  const [gone, setGone] = useState(false);
  const exitX = useRef(0);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-18, 18]);
  const keepOpacity = useTransform(x, [-SWIPE_THRESHOLD, -20], [1, 0]);
  const axeOpacity = useTransform(x, [20, SWIPE_THRESHOLD], [0, 1]);

  const scale = 1 - stackIndex * 0.05;
  const translateY = stackIndex * 18;

  // Background cards: just show scaled/pushed down, not interactive
  if (stackIndex > 0) {
    return (
      <motion.div
        className="absolute inset-x-0"
        initial={{ scale, y: translateY + 10, opacity: 0.6 }}
        animate={{ scale, y: translateY, opacity: 1 - stackIndex * 0.15 }}
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
      animate={gone ? { x: exitX.current, opacity: 0, rotate: exitX.current > 0 ? 20 : -20 } : undefined}
      transition={gone ? { duration: 0.35, ease: "easeOut" } : { type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Overlay indicators */}
      <motion.div
        style={{ opacity: keepOpacity }}
        className="absolute top-6 left-6 z-10 border-4 border-emerald-500 text-emerald-500 font-black text-xl px-3 py-1 rounded-lg -rotate-12 pointer-events-none"
      >
        KEEP
      </motion.div>
      <motion.div
        style={{ opacity: axeOpacity }}
        className="absolute top-6 right-6 z-10 border-4 border-red-500 text-red-500 font-black text-xl px-3 py-1 rounded-lg rotate-12 pointer-events-none"
      >
        AXE IT
      </motion.div>

      <CardFace item={item} />
    </motion.div>
  );
}
