"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { BudgetItem } from "@/lib/budget";

type Mode = "tinder" | "table";

interface CutsContextType {
  cuts: Set<string>;
  mode: Mode;
  setMode: (mode: Mode) => void;
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
  const [mode, setMode] = useState<Mode>("tinder");

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
      // Avoid double-counting: if both a parent and child are cut, only count parent
      const cutItems = items.filter((i) => {
        if (!cuts.has(i.id)) return false;
        if (i.parent && cuts.has(i.parent)) return false; // parent already counted
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
        mode,
        setMode,
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
