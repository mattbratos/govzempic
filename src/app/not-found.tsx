import Link from "next/link";
import { Header } from "@/components/header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
        <p
          className="text-7xl font-black text-destructive"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          404
        </p>
        <p className="text-sm text-muted-foreground tracking-widest">
          // PAGE_NOT_FOUND
        </p>
        <Link
          href="/"
          className="mt-4 text-xs font-bold tracking-widest border border-border px-4 py-2 hover:border-primary/60 hover:text-primary transition-colors"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          ← BACK TO BUDGET
        </Link>
      </main>
    </>
  );
}
