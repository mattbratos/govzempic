"use client";

import { useCountry, COUNTRIES, CURRENCIES } from "@/context/country-context";

export function CountrySelector() {
  const { countryId, setCountryId, currencyCode, setCurrencyCode } = useCountry();

  return (
    <div className="flex items-center gap-2">
      <select
        value={countryId}
        onChange={(e) => setCountryId(e.target.value)}
        className="bg-background border border-border text-foreground text-xs px-2 py-1.5 tracking-widest cursor-pointer hover:border-primary/60 transition-colors"
        style={{ fontFamily: "var(--font-orbitron)" }}
      >
        {COUNTRIES.map((c) => (
          <option key={c.id} value={c.id}>
            {c.flag} {c.name.toUpperCase()}
          </option>
        ))}
      </select>

      <select
        value={currencyCode}
        onChange={(e) => setCurrencyCode(e.target.value)}
        className="bg-background border border-border text-foreground text-xs px-2 py-1.5 tracking-widest cursor-pointer hover:border-primary/60 transition-colors"
        style={{ fontFamily: "var(--font-orbitron)" }}
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.symbol} {c.code}
          </option>
        ))}
      </select>
    </div>
  );
}
