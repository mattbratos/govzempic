"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { COUNTRIES, CURRENCIES, CountryConfig, CurrencyConfig, getCurrency } from "@/lib/countries";
import { BudgetData } from "@/lib/budget";

interface CountryContextType {
  countryId: string;
  setCountryId: (id: string) => void;
  currencyCode: string;
  setCurrencyCode: (code: string) => void;
  country: CountryConfig;
  currency: CurrencyConfig;
  currentBudget: BudgetData;
}

const CountryContext = createContext<CountryContextType | null>(null);

export function CountryProvider({
  children,
  allBudgets,
}: {
  children: ReactNode;
  allBudgets: Record<string, BudgetData>;
}) {
  const [countryId, setCountryId] = useState("us");
  const [currencyCode, setCurrencyCode] = useState("USD");

  const country = COUNTRIES.find((c) => c.id === countryId) ?? COUNTRIES[0];
  const currency = getCurrency(currencyCode);
  const currentBudget = allBudgets[countryId];

  return (
    <CountryContext.Provider
      value={{ countryId, setCountryId, currencyCode, setCurrencyCode, country, currency, currentBudget }}
    >
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const ctx = useContext(CountryContext);
  if (!ctx) throw new Error("useCountry must be within CountryProvider");
  return ctx;
}

export { COUNTRIES, CURRENCIES };
