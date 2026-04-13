"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BudgetItem, ItemType, TYPE_LABELS } from "@/lib/budget";
import { useCuts } from "@/context/cuts-context";

type SortKey = "budget_billions" | "ubi_per_month" | "name";
type SortDir = "asc" | "desc";
type Filter = ItemType | "all" | "cuttable";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "ALL" },
  { key: "mandatory", label: "MANDATORY" },
  { key: "discretionary_defense", label: "DEFENSE" },
  { key: "discretionary_nondefense", label: "DISCRETIONARY" },
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
  const { toggleCut, isCut, cuts } = useCuts();
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

  const cutCount = filtered.filter((i) => isCut(i.id)).length;

  return (
    <div
      className="px-4 py-6 max-w-7xl mx-auto"
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

        <button
          onClick={() => setShowChildren((v) => !v)}
          className="ml-auto px-3 py-1 text-xs font-bold tracking-widest border border-border text-muted-foreground hover:border-primary/60 hover:text-primary transition-all terminal-glow"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          {showChildren ? "– SUB-AGENCIES" : "+ SUB-AGENCIES"}
        </button>
      </div>

      {/* Status line */}
      {cuts.size > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-4 px-4 py-2 border border-destructive/30 bg-destructive/5 flex items-center gap-4 text-xs"
        >
          <span className="text-destructive tracking-widest">
            AXED: {cutCount} IN VIEW
          </span>
          <span className="text-muted-foreground">
            // {cuts.size} TOTAL &nbsp;·&nbsp; SEE HEADER FOR DIVIDEND
          </span>
        </motion.div>
      )}

      {/* Table */}
      <div className="border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-bold tracking-widest text-muted-foreground w-full uppercase">
                  <button
                    onClick={() => handleSort("name")}
                    className="hover:text-primary transition-colors"
                    style={{ fontFamily: "var(--font-orbitron)" }}
                  >
                    PROGRAM{sortIcon("name")}
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-bold tracking-widest text-muted-foreground uppercase whitespace-nowrap hidden md:table-cell"
                  style={{ fontFamily: "var(--font-orbitron)" }}>
                  TYPE
                </th>
                <th className="text-right px-4 py-3 font-bold tracking-widest text-muted-foreground uppercase whitespace-nowrap">
                  <button
                    onClick={() => handleSort("budget_billions")}
                    className="hover:text-primary transition-colors"
                    style={{ fontFamily: "var(--font-orbitron)" }}
                  >
                    BUDGET{sortIcon("budget_billions")}
                  </button>
                </th>
                <th className="text-right px-4 py-3 font-bold tracking-widest text-muted-foreground uppercase whitespace-nowrap hidden sm:table-cell">
                  <button
                    onClick={() => handleSort("ubi_per_month")}
                    className="hover:text-primary transition-colors"
                    style={{ fontFamily: "var(--font-orbitron)" }}
                  >
                    UBI/MO{sortIcon("ubi_per_month")}
                  </button>
                </th>
                <th className="text-right px-4 py-3 font-bold tracking-widest text-muted-foreground uppercase whitespace-nowrap hidden lg:table-cell"
                  style={{ fontFamily: "var(--font-orbitron)" }}>
                  UBI/YR
                </th>
                <th className="px-4 py-3 font-bold tracking-widest text-muted-foreground uppercase text-center whitespace-nowrap"
                  style={{ fontFamily: "var(--font-orbitron)" }}>
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item) => {
                const cut = isCut(item.id);
                const isChild = item.parent !== null;
                return (
                  <motion.tr
                    key={item.id}
                    layout
                    className={`transition-colors group ${
                      cut ? "bg-destructive/5" : "hover:bg-muted/20"
                    } ${isChild ? "opacity-60" : ""}`}
                  >
                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        {isChild && (
                          <span className="text-muted-foreground/30 shrink-0">
                            └─
                          </span>
                        )}
                        <div>
                          <p
                            className={`font-bold tracking-wide ${
                              cut
                                ? "line-through text-muted-foreground/50"
                                : "text-foreground"
                            }`}
                          >
                            {item.name}
                          </p>
                          <p className="text-muted-foreground/60 hidden md:block mt-0.5 line-clamp-1 max-w-xs text-xs">
                            // {item.description.slice(0, 72)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 border tracking-widest ${TYPE_TAG_COLOR[item.type]}`}
                        style={{ fontFamily: "var(--font-orbitron)" }}
                      >
                        {TYPE_LABELS[item.type].toUpperCase()}
                      </span>
                    </td>

                    {/* Budget */}
                    <td className="px-4 py-3 text-right font-mono font-bold tabular-nums whitespace-nowrap">
                      $
                      {item.budget_billions >= 100
                        ? Math.round(item.budget_billions)
                        : item.budget_billions.toFixed(1)}
                      B
                    </td>

                    {/* UBI/mo */}
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-primary whitespace-nowrap hidden sm:table-cell">
                      +${item.ubi_per_month.toFixed(2)}
                    </td>

                    {/* UBI/yr */}
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-muted-foreground whitespace-nowrap hidden lg:table-cell">
                      +${item.ubi_per_year.toFixed(0)}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3 text-center">
                      {item.cuttable ? (
                        <button
                          onClick={() => toggleCut(item.id)}
                          className={`px-3 py-1 text-xs font-bold tracking-widest border transition-all terminal-glow ${
                            cut
                              ? "border-destructive/50 text-destructive bg-destructive/10 hover:bg-transparent hover:text-muted-foreground hover:border-border"
                              : "border-border text-muted-foreground hover:border-destructive/60 hover:text-destructive hover:bg-destructive/5"
                          }`}
                          style={{ fontFamily: "var(--font-orbitron)" }}
                        >
                          {cut ? "AXED ✕" : "AXE IT"}
                        </button>
                      ) : (
                        <span
                          className="text-muted-foreground/30 tracking-widest cursor-help"
                          title={item.cut_note ?? ""}
                          style={{ fontFamily: "var(--font-orbitron)" }}
                        >
                          LOCKED
                        </span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-muted-foreground/40 mt-3 text-right tracking-widest">
        // FY2026 · CBO PROJECTIONS · 50% OF SAVINGS TO 335M AMERICANS
      </p>
    </div>
  );
}
