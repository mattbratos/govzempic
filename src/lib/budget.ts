export type ItemType =
  | "mandatory"
  | "discretionary_defense"
  | "discretionary_nondefense"
  | "interest";

export interface BudgetItem {
  id: string;
  name: string;
  type: ItemType;
  agency: string;
  parent: string | null;
  budget_billions: number;
  ubi_per_year: number;
  ubi_per_month: number;
  ubi_per_week: number;
  description: string;
  cuttable: boolean;
  no_kill?: boolean;
  no_slim?: boolean;
  cut_note: string | null;
}

export interface BudgetMeta {
  fiscal_year: number;
  total_outlays_billions: number;
  us_population: number;
  ubi_share: number;
  sources: string[];
  notes: string;
}

export interface BudgetData {
  meta: BudgetMeta;
  items: BudgetItem[];
}

export const TYPE_LABELS: Record<ItemType, string> = {
  mandatory: "Mandatory",
  discretionary_defense: "Defense",
  discretionary_nondefense: "Discretionary",
  interest: "Debt Interest",
};

export const TYPE_COLORS: Record<ItemType, string> = {
  mandatory: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  discretionary_defense: "bg-red-500/10 text-red-400 border-red-500/20",
  discretionary_nondefense:
    "bg-purple-500/10 text-purple-400 border-purple-500/20",
  interest: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

export function calcUBIFromBillions(
  billions: number,
  population = 335_000_000,
  share = 0.5
) {
  const perYear = (billions * 1e9 * share) / population;
  return {
    year: perYear,
    month: perYear / 12,
    week: perYear / 52,
  };
}

export function fmt$(n: number, decimals = 2) {
  return "$" + n.toFixed(decimals);
}
