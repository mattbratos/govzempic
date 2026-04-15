import { readFileSync } from "fs";
import { join } from "path";
import ReactMarkdown from "react-markdown";
import { Header } from "@/components/header";

export default function AboutPage() {
  const readme = readFileSync(join(process.cwd(), "README.md"), "utf-8");

  return (
    <>
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-6 py-12">
        <article className="prose prose-neutral dark:prose-invert max-w-none flex flex-col gap-4 text-foreground/80 leading-relaxed">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1
                  className="text-3xl font-black tracking-widest mb-2 text-foreground"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2
                  className="text-lg font-black tracking-widest mt-8 mb-3 text-foreground"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  {children}
                </h2>
              ),
              p: ({ children }) => (
                <p className="text-base leading-relaxed text-foreground/80">
                  {children}
                </p>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-foreground underline underline-offset-2 hover:text-foreground/70"
                  target={href?.startsWith("http") ? "_blank" : undefined}
                  rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {children}
                </a>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-foreground">{children}</strong>
              ),
              code: ({ children }) => (
                <code
                  className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground/70"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre
                  className="bg-muted rounded-md p-4 overflow-x-auto text-xs text-foreground/70"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  {children}
                </pre>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-1 text-foreground/80">
                  {children}
                </ul>
              ),
            }}
          >
            {readme}
          </ReactMarkdown>
        </article>
      </main>
    </>
  );
}
