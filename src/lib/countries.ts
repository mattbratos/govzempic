export interface CountryConfig {
  id: string;
  name: string;
  flag: string;
  avgGrowthRate: number; // 10-year average real GDP growth %
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  decimals: number;
  rateFromUSD: number; // 1 USD = X of this currency
}

export const COUNTRIES: CountryConfig[] = [
  { id: "us", name: "United States", flag: "🇺🇸", avgGrowthRate: 2.5 }, // ~2.5% avg real GDP growth 2014-2024
  { id: "pl", name: "Poland",        flag: "🇵🇱", avgGrowthRate: 3.5 }, // ~3.5% avg real GDP growth 2014-2024
  { id: "jp", name: "Japan",         flag: "🇯🇵", avgGrowthRate: 0.8 }, // ~0.8% avg real GDP growth 2014-2024
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
