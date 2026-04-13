"use client";

import { useCountry } from "@/context/country-context";
import { CutsProvider } from "@/context/cuts-context";
import { TableMode } from "./table-mode";
import { UBIPanel, UBIBar } from "./ubi-panel";

export function AppContent() {
  const { countryId, currentBudget } = useCountry();
  const { items, meta } = currentBudget;

  return (
    <CutsProvider key={countryId} items={items} population={meta.population}>
      {/* Mobile: compact bar above table */}
      <div className="lg:hidden px-4 pt-4">
        <UBIBar />
      </div>

      <div className="w-full">
        <div className="lg:flex lg:gap-0 min-h-[calc(100vh-3.5rem)]">

          {/* Table */}
          <div className="w-full lg:min-w-0 lg:flex-1">
            <TableMode items={items} />
          </div>

          {/* Sticky UBI panel */}
          <div className="hidden lg:block w-96 shrink-0 border-l border-border sticky top-14 self-start h-[calc(100vh-3.5rem)] overflow-y-auto">
            <UBIPanel />
          </div>

        </div>
      </div>
    </CutsProvider>
  );
}
