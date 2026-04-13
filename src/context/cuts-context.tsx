"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { BudgetItem } from "@/lib/budget";

export type CutType = "kill" | "slim";

interface CutsContextType {
  cuts: Map<string, CutType>;
  setCut: (id: string, type: CutType) => void;
  removeCut: (id: string) => void;
  getCut: (id: string) => CutType | null;
  killCount: number;
  slimCount: number;
  totalCutBillions: number;
  ubiPerYear: number;
  ubiPerMonth: number;
  ubiPerWeek: number;
}

const CutsContext = createContext<CutsContextType | null>(null);

export function CutsProvider({
  children,
  items,
}: {
  children: React.ReactNode;
  items: BudgetItem[];
}) {
  const [cuts, setCuts] = useState<Map<string, CutType>>(new Map());

  const setCut = useCallback((id: string, type: CutType) => {
    setCuts((prev) => new Map(prev).set(id, type));
  }, []);

  const removeCut = useCallback((id: string) => {
    setCuts((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const getCut = useCallback(
    (id: string): CutType | null => cuts.get(id) ?? null,
    [cuts]
  );

  const { totalCutBillions, ubiPerYear, ubiPerMonth, ubiPerWeek, killCount, slimCount } =
    useMemo(() => {
      let total = 0;
      let kills = 0;
      let slims = 0;

      for (const item of items) {
        const type = cuts.get(item.id);
        if (!type) continue;
        // skip if parent is also cut (avoid double-counting)
        if (item.parent && cuts.has(item.parent)) continue;
        const pct = type === "kill" ? 1.0 : 0.5;
        total += item.budget_billions * pct;
        if (type === "kill") kills++;
        else slims++;
      }

      const perYear = (total * 1e9 * 0.5) / 335_000_000;
      return {
        killCount: kills,
        slimCount: slims,
        totalCutBillions: total,
        ubiPerYear: perYear,
        ubiPerMonth: perYear / 12,
        ubiPerWeek: perYear / 52,
      };
    }, [cuts, items]);

  return (
    <CutsContext.Provider
      value={{
        cuts,
        setCut,
        removeCut,
        getCut,
        killCount,
        slimCount,
        totalCutBillions,
        ubiPerYear,
        ubiPerMonth,
        ubiPerWeek,
      }}
    >
      {children}
    </CutsContext.Provider>
  );
}

export function useCuts() {
  const ctx = useContext(CutsContext);
  if (!ctx) throw new Error("useCuts must be within CutsProvider");
  return ctx;
}
