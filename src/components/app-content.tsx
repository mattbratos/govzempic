"use client";

import { TableMode } from "./table-mode";
import { UBIPanel, UBIBar } from "./ubi-panel";
import { BudgetItem } from "@/lib/budget";

export function AppContent({ items }: { items: BudgetItem[] }) {
  return (
    <>
      {/* Mobile: compact bar above table */}
      <div className="lg:hidden px-4 pt-4">
        <UBIBar />
      </div>

      {/* Desktop: table + sticky side panel */}
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        <div className="flex-1 min-w-0 overflow-hidden">
          <TableMode items={items} />
        </div>

        {/* Sticky UBI panel */}
        <div className="hidden lg:block w-64 shrink-0 border-l border-border sticky top-14 self-start h-[calc(100vh-3.5rem)] overflow-y-auto">
          <UBIPanel />
        </div>
      </div>
    </>
  );
}
