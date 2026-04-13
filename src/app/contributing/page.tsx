import { Header } from "@/components/header";

export default function ContributingPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-6 py-12">
        <h1
          className="text-3xl font-black tracking-widest mb-8"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          CONTRIBUTING
        </h1>

        <div className="flex flex-col gap-6 text-base leading-relaxed text-foreground/80">
          <p>
            GovZempic is open source. Contributions are welcome — whether that&apos;s
            improving the budget data, adding new countries, fixing bugs, or improving
            the UI.
          </p>

          <div>
            <h2
              className="text-sm font-black tracking-widest mb-3 text-foreground"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              HOW TO CONTRIBUTE
            </h2>
            <ol className="flex flex-col gap-2 list-decimal list-inside text-sm">
              <li>Fork the repo on GitHub</li>
              <li>Create a branch for your change</li>
              <li>Make your edits</li>
              <li>Open a pull request with a clear description</li>
            </ol>
          </div>

          <div>
            <h2
              className="text-sm font-black tracking-widest mb-3 text-foreground"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              WHAT WE NEED
            </h2>
            <ul className="flex flex-col gap-2 list-disc list-inside text-sm">
              <li>More countries with accurate budget data</li>
              <li>Up-to-date spending figures as budgets are passed</li>
              <li>Better descriptions for each program</li>
              <li>UI improvements and mobile polish</li>
            </ul>
          </div>

          <a
            href="https://github.com/mattbratos/govzempic"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs font-bold tracking-widest text-foreground hover:border-primary/60 hover:text-primary transition-colors w-fit"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            VIEW ON GITHUB →
          </a>

          <div
            className="border-t border-border pt-6 text-xs text-muted-foreground tracking-widest"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            // ALL CONTRIBUTIONS LICENSED UNDER MIT
          </div>
        </div>
      </main>
    </>
  );
}
