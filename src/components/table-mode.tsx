"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BudgetItem, ItemType, TYPE_LABELS } from "@/lib/budget";
import { useCuts, CutType } from "@/context/cuts-context";

type SortKey = "budget_billions" | "name";
type SortDir = "asc" | "desc";
type Filter = ItemType | "all" | "cuttable";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "ALL" },
  { key: "mandatory", label: "MANDATORY" },
  { key: "discretionary_defense", label: "DEFENSE" },
  { key: "discretionary_nondefense", label: "DISCR." },
  { key: "interest", label: "DEBT" },
  { key: "cuttable", label: "CUTTABLE" },
];

const TYPE_TAG_COLOR: Record<ItemType, string> = {
  mandatory: "text-blue-400 border-blue-500/30",
  discretionary_defense: "text-destructive border-destructive/30",
  discretionary_nondefense: "text-primary border-primary/30",
  interest: "text-orange-400 border-orange-500/30",
};

export function TableMode({ items }: { items: BudgetItem[] }) {
  const { getCut, setCut, setCutBulk, removeCut, resetCuts, cuts } = useCuts();
  const [sortKey, setSortKey] = useState<SortKey>("budget_billions");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filter, setFilter] = useState<Filter>("all");
  const [showChildren, setShowChildren] = useState(false);

  const filtered = items
    .filter((i) => (!showChildren ? i.parent === null : true))
    .filter((i) => {
      if (filter === "cuttable") return i.cuttable;
      if (filter === "all") return true;
      return i.type === filter;
    })
    .sort((a, b) => {
      const m = sortDir === "desc" ? -1 : 1;
      if (sortKey === "name") return m * a.name.localeCompare(b.name);
      return m * (a[sortKey] - b[sortKey]);
    });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const sortIcon = (key: SortKey) =>
    sortKey === key ? (sortDir === "desc" ? " ▼" : " ▲") : " ·";

  const handleCutClick = (id: string, type: CutType) => {
    const current = getCut(id);
    if (current === type) removeCut(id);   // toggle off
    else setCut(id, type);                  // set or upgrade/downgrade
  };

  const cutCount = filtered.filter((i) => cuts.has(i.id)).length;

  return (
    <div
      className="px-4 py-5"
      style={{ fontFamily: "var(--font-space-mono)" }}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1 text-xs font-bold tracking-widest border transition-all terminal-glow ${
                filter === key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/60 hover:text-primary"
              }`}
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-1.5">
          <button
            onClick={() => setCutBulk(filtered.map((i) => i.id), "kill")}
            className="px-3 py-1 text-xs font-bold tracking-widest border border-destructive/40 text-destructive/70 hover:border-destructive hover:text-destructive hover:bg-destructive/10 transition-all terminal-glow"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            KILL ALL
          </button>
          <button
            onClick={() => setCutBulk(filtered.map((i) => i.id), "slim")}
            className="px-3 py-1 text-xs font-bold tracking-widest border border-orange-500/40 text-orange-500/70 hover:border-orange-500 hover:text-orange-400 hover:bg-orange-500/5 transition-all terminal-glow"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            SLIM ALL
          </button>
          <button
            onClick={() => setShowChildren((v) => !v)}
            className="px-3 py-1 text-xs font-bold tracking-widest border border-border text-muted-foreground hover:border-primary/60 hover:text-primary transition-all terminal-glow"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            {showChildren ? "– SUB" : "+ SUB"}
          </button>
          {cuts.size > 0 && (
            <button
              onClick={resetCuts}
              className="px-3 py-1 text-xs font-bold tracking-widest border border-border text-muted-foreground hover:border-primary/60 hover:text-primary transition-all terminal-glow"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              RESET
            </button>
          )}
        </div>
      </div>

      {/* Status line */}
      {cuts.size > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-4 px-4 py-2 border border-border flex items-center gap-4 text-xs bg-muted/10"
        >
          <span className="text-muted-foreground tracking-widest">
            {cutCount} PROGRAMS TARGETED IN VIEW &nbsp;//&nbsp; {cuts.size} TOTAL
          </span>
        </motion.div>
      )}

      {/* Table */}
      <div className="border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-bold tracking-widest text-muted-foreground uppercase whitespace-nowrap"
                  style={{ fontFamily: "var(--font-orbitron)" }}>
                  <button onClick={() => handleSort("name")} className="hover:text-primary transition-colors">
                    PROGRAM{sortIcon("name")}
                  </button>
                </th>
                <th className="text-left px-3 py-3 font-bold tracking-widest text-muted-foreground uppercase whitespace-nowrap hidden md:table-cell"
                  style={{ fontFamily: "var(--font-orbitron)" }}>
                  TYPE
                </th>
                <th className="text-left px-3 py-3 font-bold tracking-widest text-muted-foreground uppercase hidden lg:table-cell"
                  style={{ fontFamily: "var(--font-orbitron)" }}>
                  WHAT IT DOES
                </th>
                <th className="text-right px-3 py-3 font-bold tracking-widest text-muted-foreground uppercase whitespace-nowrap"
                  style={{ fontFamily: "var(--font-orbitron)" }}>
                  <button onClick={() => handleSort("budget_billions")} className="hover:text-primary transition-colors">
                    ANNUAL{sortIcon("budget_billions")}
                  </button>
                </th>
                <th className="px-3 py-3 font-bold tracking-widest text-muted-foreground uppercase text-center whitespace-nowrap"
                  style={{ fontFamily: "var(--font-orbitron)" }}>
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item) => {
                const cut = getCut(item.id);
                const isKilled = cut === "kill";
                const isSlimmed = cut === "slim";
                const isChild = item.parent !== null;

                return (
                  <motion.tr
                    key={item.id}
                    layout
                    className={`transition-colors ${
                      isKilled
                        ? "bg-destructive/8"
                        : isSlimmed
                        ? "bg-orange-500/5"
                        : "hover:bg-muted/15"
                    } ${isChild ? "opacity-60" : ""}`}
                  >
                    {/* Name */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {isChild && (
                          <span className="text-muted-foreground/30 shrink-0">└─</span>
                        )}
                        <p
                          className={`font-bold tracking-wide ${
                            isKilled
                              ? "line-through text-muted-foreground/40"
                              : isSlimmed
                              ? "text-orange-400/80"
                              : "text-foreground"
                          }`}
                        >
                          {isSlimmed && <span className="text-orange-400 mr-1">~</span>}
                          {item.name}
                        </p>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-3 py-3 hidden md:table-cell whitespace-nowrap">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 border tracking-widest ${TYPE_TAG_COLOR[item.type]}`}
                        style={{ fontFamily: "var(--font-orbitron)" }}
                      >
                        {TYPE_LABELS[item.type].toUpperCase()}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="px-3 py-3 hidden lg:table-cell text-muted-foreground/60 max-w-xs">
                      <span className="line-clamp-2 leading-relaxed">{item.description}</span>
                    </td>

                    {/* Budget */}
                    <td className="px-3 py-3 text-right font-mono font-bold tabular-nums whitespace-nowrap">
                      {isSlimmed ? (
                        <>
                          <span className="text-orange-400 line-through mr-1 opacity-50">
                            ~${item.budget_billions >= 100
                              ? Math.round(item.budget_billions)
                              : item.budget_billions.toFixed(1)}B
                          </span>
                          <span className="text-orange-400">
                            ~${item.budget_billions >= 100
                              ? Math.round(item.budget_billions / 2)
                              : (item.budget_billions / 2).toFixed(1)}B
                          </span>
                        </>
                      ) : (
                        <span className={isKilled ? "line-through text-muted-foreground/40" : ""}>
                          ~${item.budget_billions >= 100
                            ? Math.round(item.budget_billions)
                            : item.budget_billions.toFixed(1)}B
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-3 py-3">
                      <div className="flex gap-1 justify-center">
                        <button
                          onClick={() => handleCutClick(item.id, "kill")}
                          className={`px-2 py-1 text-xs font-bold tracking-widest border transition-all terminal-glow whitespace-nowrap ${
                            isKilled
                              ? "border-destructive bg-destructive/20 text-destructive"
                              : "border-destructive/30 text-destructive/60 hover:border-destructive hover:text-destructive hover:bg-destructive/10"
                          }`}
                          style={{ fontFamily: "var(--font-orbitron)" }}
                        >
                          {isKilled ? "KILLED ✕" : "KILL IT"}
                        </button>
                        <button
                          onClick={() => handleCutClick(item.id, "slim")}
                          className={`px-2 py-1 text-xs font-bold tracking-widest border transition-all terminal-glow whitespace-nowrap ${
                            isSlimmed
                              ? "border-orange-500 bg-orange-500/15 text-orange-400"
                              : "border-orange-500/30 text-orange-500/50 hover:border-orange-500/70 hover:text-orange-400 hover:bg-orange-500/5"
                          }`}
                          style={{ fontFamily: "var(--font-orbitron)" }}
                        >
                          {isSlimmed ? "SLIMMED ~" : "SLIM IT"}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-muted-foreground/30 mt-3 text-right tracking-widest">
        // FY2026 · CBO · 50% OF SAVINGS TO 335M AMERICANS
      </p>
    </div>
  );
}
