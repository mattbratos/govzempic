"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { BudgetItem } from "@/lib/budget";

interface CutsContextType {
  cuts: Set<string>;
  toggleCut: (id: string) => void;
  isCut: (id: string) => boolean;
  cutCount: number;
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
  const [cuts, setCuts] = useState<Set<string>>(new Set());

  const toggleCut = useCallback((id: string) => {
    setCuts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const isCut = useCallback((id: string) => cuts.has(id), [cuts]);

  const { totalCutBillions, ubiPerYear, ubiPerMonth, ubiPerWeek, cutCount } =
    useMemo(() => {
      const cutItems = items.filter((i) => {
        if (!cuts.has(i.id)) return false;
        if (i.parent && cuts.has(i.parent)) return false;
        return true;
      });
      const total = cutItems.reduce((s, i) => s + i.budget_billions, 0);
      const perYear = (total * 1e9 * 0.5) / 335_000_000;
      return {
        cutCount: cutItems.length,
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
        toggleCut,
        isCut,
        cutCount,
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
