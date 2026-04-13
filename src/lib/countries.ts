export interface CountryConfig {
  id: string;
  name: string;
  flag: string;
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  decimals: number;
  rateFromUSD: number; // 1 USD = X of this currency
}

export const COUNTRIES: CountryConfig[] = [
  { id: "us", name: "United States", flag: "🇺🇸" },
  { id: "pl", name: "Poland",        flag: "🇵🇱" },
  { id: "jp", name: "Japan",         flag: "🇯🇵" },
];

export const CURRENCIES: CurrencyConfig[] = [
  { code: "USD", symbol: "$",  decimals: 2, rateFromUSD: 1     },
  { code: "EUR", symbol: "€",  decimals: 2, rateFromUSD: 0.92  },
  { code: "PLN", symbol: "zł", decimals: 2, rateFromUSD: 4.0   },
  { code: "JPY", symbol: "¥",  decimals: 0, rateFromUSD: 150   },
];

export function getCurrency(code: string): CurrencyConfig {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

export function formatCurrency(usdValue: number, currency: CurrencyConfig): string {
  const converted = usdValue * currency.rateFromUSD;
  return `${currency.symbol}${converted.toFixed(currency.decimals)}`;
}
