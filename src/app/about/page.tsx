import { Header } from "@/components/header";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-6 py-12">
        <h1
          className="text-3xl font-black tracking-widest mb-8"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          ABOUT
        </h1>

        <div className="flex flex-col gap-6 text-base leading-relaxed text-foreground/80">
          <p>
            GovZempic is a thought experiment: what if cutting government spending
            wasn&apos;t just an abstract political debate — but something you could feel
            in your wallet every month?
          </p>
          <p>
            The premise is simple. Take 50% of any savings from cuts to the federal budget
            and distribute it equally to every American as a monthly dividend. The other
            50% goes toward deficit reduction.
          </p>
          <p>
            This isn&apos;t a partisan project. It&apos;s a tool to make the numbers
            tangible — to turn trillion-dollar abstractions into a concrete answer to the
            question: &quot;what&apos;s in it for me?&quot;
          </p>
          <p>
            Budget figures are based on CBO projections and enacted appropriations for
            FY2026. All calculations assume equal per-capita distribution across the
            full US population of ~335 million people.
          </p>

          <div
            className="border-t border-border pt-6 text-xs text-muted-foreground tracking-widest"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            {"// BUILT WITH NEXT.JS · DATA FROM CBO · NOT AFFILIATED WITH ANY GOVERNMENT AGENCY"}
          </div>
        </div>
      </main>
    </>
  );
}
