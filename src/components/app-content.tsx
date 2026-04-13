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

      {/* Centred container with max width */}
      <div className="mx-auto w-full max-w-4xl px-4 py-6 lg:max-w-none lg:px-0 lg:py-0">
        {/* Desktop: table (max-w-4xl) + sticky UBI panel side by side */}
        <div className="lg:flex lg:justify-center lg:gap-0 min-h-[calc(100vh-3.5rem)]">

          {/* Table — capped at 6xl */}
          <div className="w-full lg:max-w-3xl lg:min-w-0 lg:flex-shrink-0">
            <TableMode items={items} />
          </div>

          {/* Sticky UBI panel */}
          <div className="hidden lg:block w-72 shrink-0 border-l border-border sticky top-14 self-start h-[calc(100vh-3.5rem)] overflow-y-auto">
            <UBIPanel />
          </div>

        </div>
      </div>
    </>
  );
}
