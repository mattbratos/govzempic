"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BudgetItem, ItemType, TYPE_LABELS, TYPE_COLORS } from "@/lib/budget";
import { useCuts } from "@/context/cuts-context";

type SortKey = "budget_billions" | "ubi_per_month" | "name";
type SortDir = "asc" | "desc";
type Filter = ItemType | "all" | "cuttable";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "mandatory", label: "Mandatory" },
  { key: "discretionary_defense", label: "Defense" },
  { key: "discretionary_nondefense", label: "Discretionary" },
  { key: "interest", label: "Debt" },
  { key: "cuttable", label: "Cuttable only" },
];

export function TableMode({ items }: { items: BudgetItem[] }) {
  const { toggleCut, isCut, cuts } = useCuts();
  const [sortKey, setSortKey] = useState<SortKey>("budget_billions");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filter, setFilter] = useState<Filter>("all");
  const [showChildren, setShowChildren] = useState(false);

  const filtered = items
    .filter((i) => !showChildren ? i.parent === null : true)
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
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sortIcon = (key: SortKey) =>
    sortKey === key ? (sortDir === "desc" ? " ↓" : " ↑") : "";

  const cutCount = filtered.filter((i) => isCut(i.id)).length;

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                filter === key
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:border-foreground/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowChildren((v) => !v)}
          className="ml-auto px-3 py-1.5 rounded-full text-xs font-medium border border-border text-muted-foreground hover:border-foreground/50 transition-all"
        >
          {showChildren ? "Hide sub-agencies" : "+ Sub-agencies"}
        </button>
      </div>

      {/* Stats row */}
      {cuts.size > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-4 p-3 bg-red-500/5 border border-red-500/20 rounded-xl flex items-center gap-3 text-sm"
        >
          <span className="text-red-400 font-medium">
            {cutCount} axed in this view
          </span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">
            {cuts.size} total cuts across all categories
          </span>
        </motion.div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground w-full">
                  <button
                    onClick={() => handleSort("name")}
                    className="hover:text-foreground transition-colors"
                  >
                    Program / Agency{sortIcon("name")}
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap hidden md:table-cell">
                  Type
                </th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                  <button
                    onClick={() => handleSort("budget_billions")}
                    className="hover:text-foreground transition-colors"
                  >
                    Budget{sortIcon("budget_billions")}
                  </button>
                </th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground whitespace-nowrap hidden sm:table-cell">
                  <button
                    onClick={() => handleSort("ubi_per_month")}
                    className="hover:text-foreground transition-colors"
                  >
                    UBI / mo{sortIcon("ubi_per_month")}
                  </button>
                </th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground whitespace-nowrap hidden lg:table-cell">
                  UBI / yr
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-center whitespace-nowrap">
                  Action
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
                    className={`transition-colors ${
                      cut
                        ? "bg-red-500/5"
                        : "hover:bg-muted/20"
                    } ${isChild ? "opacity-70" : ""}`}
                  >
                    {/* Name + description */}
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        {isChild && (
                          <span className="text-muted-foreground/40 mt-0.5 shrink-0">
                            └
                          </span>
                        )}
                        <div>
                          <p
                            className={`font-medium ${
                              cut
                                ? "line-through text-muted-foreground"
                                : "text-foreground"
                            }`}
                          >
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground hidden md:block mt-0.5 line-clamp-1 max-w-xs">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Type badge */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full border ${TYPE_COLORS[item.type]}`}
                      >
                        {TYPE_LABELS[item.type]}
                      </span>
                    </td>

                    {/* Budget */}
                    <td className="px-4 py-3 text-right font-mono font-semibold whitespace-nowrap">
                      ${item.budget_billions >= 100
                        ? Math.round(item.budget_billions)
                        : item.budget_billions.toFixed(1)}
                      B
                    </td>

                    {/* UBI / mo */}
                    <td className="px-4 py-3 text-right font-mono text-emerald-400 whitespace-nowrap hidden sm:table-cell">
                      +${item.ubi_per_month.toFixed(2)}
                    </td>

                    {/* UBI / yr */}
                    <td className="px-4 py-3 text-right font-mono text-muted-foreground whitespace-nowrap hidden lg:table-cell">
                      +${item.ubi_per_year.toFixed(0)}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3 text-center">
                      {item.cuttable ? (
                        <button
                          onClick={() => toggleCut(item.id)}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                            cut
                              ? "bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-transparent hover:text-muted-foreground hover:border-border"
                              : "border border-border text-muted-foreground hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/5"
                          }`}
                        >
                          {cut ? "Axed 🪓" : "Axe it"}
                        </button>
                      ) : (
                        <span
                          className="text-xs text-muted-foreground/40 cursor-help"
                          title={item.cut_note ?? ""}
                        >
                          Protected
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

      <p className="text-xs text-muted-foreground mt-3 text-right">
        FY2026 · CBO projections · UBI assumes 50% of savings to 335M Americans
      </p>
    </div>
  );
}
