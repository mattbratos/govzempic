import type { Metadata } from "next";
import { Orbitron, Space_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "GovZempic — Trim the Federal Budget, Fund Your UBI",
  description:
    "An interactive tool to cut or slim government spending programs and see your resulting Universal Basic Income dividend. Supports USA, Poland, and Japan with real budget data.",
  openGraph: {
    title: "GovZempic — Trim the Federal Budget, Fund Your UBI",
    description:
      "Cut government programs. Watch your monthly UBI dividend go up. Real budget data for USA, Poland, and Japan.",
    url: "https://govzempic.com",
    siteName: "GovZempic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GovZempic — Trim the Federal Budget, Fund Your UBI",
    description:
      "Cut government programs. Watch your monthly UBI dividend go up. Real budget data for USA, Poland, and Japan.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Runs before hydration — sets dark/light class from localStorage (default: dark)
const themeScript = `(function(){try{var t=localStorage.getItem('theme');document.documentElement.classList.toggle('dark',t?t==='dark':true)}catch(e){document.documentElement.classList.add('dark')}})()`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GovZempic",
  url: "https://govzempic.com",
  description:
    "An interactive civic tool to cut or slim government spending programs and see the resulting Universal Basic Income dividend per citizen.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Person", name: "mattbratos" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${spaceMono.variable} ${GeistSans.variable} ${GeistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
