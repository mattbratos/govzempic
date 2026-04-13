"use client";

import { useCuts } from "@/context/cuts-context";
import { TinderMode } from "./tinder-mode";
import { TableMode } from "./table-mode";
import { BudgetItem } from "@/lib/budget";

export function AppContent({ items }: { items: BudgetItem[] }) {
  const { mode } = useCuts();
  return mode === "tinder" ? (
    <TinderMode items={items} />
  ) : (
    <TableMode items={items} />
  );
}
