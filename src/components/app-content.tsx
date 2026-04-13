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

      <div className="mx-auto w-full max-w-4xl px-4 py-6 lg:max-w-none lg:px-0 lg:py-0">
        <div className="lg:flex lg:justify-center lg:gap-0 min-h-[calc(100vh-3.5rem)]">

          {/* Table */}
          <div className="w-full lg:max-w-6xl lg:min-w-0 lg:flex-shrink-0">
            <TableMode items={items} />
          </div>

          {/* Sticky UBI panel */}
          <div className="hidden lg:block w-72 shrink-0 border-l border-border sticky top-14 self-start h-[calc(100vh-3.5rem)] overflow-y-auto">
            <UBIPanel />
          </div>

        </div>
      </div>
    </CutsProvider>
  );
}
