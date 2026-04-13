import budgetData from "@/data/budget.json";
import { BudgetData } from "@/lib/budget";
import { CutsProvider } from "@/context/cuts-context";
import { Header } from "@/components/header";
import { AppContent } from "@/components/app-content";

const data = budgetData as unknown as BudgetData;

export default function Page() {
  return (
    <CutsProvider items={data.items}>
      <Header />
      <main className="flex-1">
        <AppContent items={data.items} />
      </main>
    </CutsProvider>
  );
}
