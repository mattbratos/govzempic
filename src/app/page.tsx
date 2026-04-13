import budgetUS from "@/data/budget.json";
import budgetPL from "@/data/budget-pl.json";
import budgetJP from "@/data/budget-jp.json";
import { BudgetData } from "@/lib/budget";
import { CountryProvider } from "@/context/country-context";
import { Header } from "@/components/header";
import { AppContent } from "@/components/app-content";

const allBudgets: Record<string, BudgetData> = {
  us: budgetUS as unknown as BudgetData,
  pl: budgetPL as unknown as BudgetData,
  jp: budgetJP as unknown as BudgetData,
};

export default function Page() {
  return (
    <CountryProvider allBudgets={allBudgets}>
      <Header />
      <main className="flex-1">
        <AppContent />
      </main>
    </CountryProvider>
  );
}
