"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BudgetItem } from "@/lib/budget";
import { useCuts, CutType } from "@/context/cuts-context";

type SortKey = "budget_billions" | "name";
type SortDir = "asc" | "desc";

export function TableMode({ items }: { items: BudgetItem[] }) {
  const { getCut, setCut, setCutBulk, removeCut, resetCuts, cuts } = useCuts();
  const [sortKey, setSortKey] = useState<SortKey>("budget_billions");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [showChildren, setShowChildren] = useState(false);

  const filtered = items
    .filter((i) => (!showChildren ? i.parent === null : true))
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
    if (current === type) removeCut(id);
    else setCut(id, type);
  };

  return (
    <div className="px-4 py-5" style={{ fontFamily: "var(--font-geist-mono)" }}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 mb-4 justify-end">
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

      {/* Table */}
      <div className="border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-lg">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-bold tracking-widest text-muted-foreground uppercase whitespace-nowrap"
                  style={{ fontFamily: "var(--font-orbitron)" }}>
                  <button onClick={() => handleSort("name")} className="hover:text-primary transition-colors">
                    PROGRAM{sortIcon("name")}
                  </button>
                </th>
                <th className="text-right px-3 py-3 font-bold tracking-widest text-muted-foreground uppercase whitespace-nowrap"
                  style={{ fontFamily: "var(--font-orbitron)" }}>
                  <button onClick={() => handleSort("budget_billions")} className="hover:text-primary transition-colors">
                    ANNUAL{sortIcon("budget_billions")}
                  </button>
                </th>
                <th className="text-right px-3 py-3 font-bold tracking-widest text-muted-foreground uppercase whitespace-nowrap"
                  style={{ fontFamily: "var(--font-orbitron)" }}>
                  UBI/MO
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
                const killDisabled = !!item.no_kill;
                const slimDisabled = !!item.no_slim;

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
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {isChild && (
                          <span className="text-muted-foreground/30 shrink-0">└─</span>
                        )}
                        <p
                          className={`tracking-wide ${
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

                    {/* Budget */}
                    <td className="px-3 py-4 text-right font-mono tabular-nums whitespace-nowrap">
                      {isSlimmed ? (
                        <>
                          <span className="text-orange-400 line-through mr-1 opacity-50">
                            ${item.budget_billions >= 100
                              ? Math.round(item.budget_billions)
                              : item.budget_billions.toFixed(1)}B
                          </span>
                          <span className="text-orange-400">
                            ${item.budget_billions >= 100
                              ? Math.round(item.budget_billions / 2)
                              : (item.budget_billions / 2).toFixed(1)}B
                          </span>
                        </>
                      ) : (
                        <span className={isKilled ? "line-through text-muted-foreground/40" : ""}>
                          ${item.budget_billions >= 100
                            ? Math.round(item.budget_billions)
                            : item.budget_billions.toFixed(1)}B
                        </span>
                      )}
                    </td>

                    {/* UBI/mo */}
                    <td className="px-3 py-4 text-right tabular-nums whitespace-nowrap text-muted-foreground">
                      +${isSlimmed
                        ? (item.ubi_per_month * 0.5).toFixed(2)
                        : item.ubi_per_month.toFixed(2)}
                    </td>

                    {/* Action */}
                    <td className="px-3 py-4">
                      <div className="flex gap-1 justify-center">
                        <button
                          onClick={() => !killDisabled && handleCutClick(item.id, "kill")}
                          disabled={killDisabled}
                          className={`px-2 py-1 text-xs font-bold tracking-widest border transition-all whitespace-nowrap ${
                            killDisabled
                              ? "border-border text-muted-foreground/25 cursor-not-allowed"
                              : isKilled
                              ? "border-destructive bg-destructive/20 text-destructive terminal-glow"
                              : "border-destructive/30 text-destructive/60 hover:border-destructive hover:text-destructive hover:bg-destructive/10 terminal-glow"
                          }`}
                          style={{ fontFamily: "var(--font-orbitron)" }}
                          title={killDisabled ? item.cut_note ?? undefined : undefined}
                        >
                          {isKilled ? "KILLED ✕" : "KILL IT"}
                        </button>
                        <button
                          onClick={() => !slimDisabled && handleCutClick(item.id, "slim")}
                          disabled={slimDisabled}
                          className={`px-2 py-1 text-xs font-bold tracking-widest border transition-all whitespace-nowrap ${
                            slimDisabled
                              ? "border-border text-muted-foreground/25 cursor-not-allowed"
                              : isSlimmed
                              ? "border-orange-500 bg-orange-500/15 text-orange-400 terminal-glow"
                              : "border-orange-500/30 text-orange-500/50 hover:border-orange-500/70 hover:text-orange-400 hover:bg-orange-500/5 terminal-glow"
                          }`}
                          style={{ fontFamily: "var(--font-orbitron)" }}
                          title={slimDisabled ? item.cut_note ?? undefined : undefined}
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
