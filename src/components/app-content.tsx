"use client";

import { TableMode } from "./table-mode";
import { BudgetItem } from "@/lib/budget";

export function AppContent({ items }: { items: BudgetItem[] }) {
  return <TableMode items={items} />;
}
