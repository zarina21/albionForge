import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "./providers";
import { Header } from "@/components/Header";
import { ForgeNav } from "@/components/ForgeNav";

export const metadata: Metadata = {
  title: {
    default: "Albion Forge — Theorycrafting, Builds & Market",
    template: "%s — Albion Forge",
  },
  description:
    "Real-time Albion Online market prices, item search, recipes and build theorycrafting.",
  authors: [{ name: "Albion Forge" }],
  openGraph: {
    title: "Albion Forge — Theorycrafting & Market",
    description:
      "Search items, view live prices across cities and chart history.",
    type: "website",
  },
  twitter: {
    card: "summary",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" translate="no">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
        />
      </head>
      <body>
        <QueryProvider>
          <Header />
          <ForgeNav />
          {children}
          <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
            Datos proporcionados por{" "}
            <a
              href="https://www.albion-online-data.com"
              className="text-gold hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Albion Online Data Project
            </a>
            . No afiliado con Sandbox Interactive.
          </footer>
        </QueryProvider>
      </body>
    </html>
  );
}
