import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { QueryProvider } from "./providers";
import { Header } from "@/components/Header";
import { ForgeNav } from "@/components/ForgeNav";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://albionforge.online";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Albion Forge — Theorycrafting, Builds & Market for Albion Online",
    template: "%s — Albion Forge",
  },
  description:
    "Real-time Albion Online market prices, item search, crafting recipes, and PvP build theorycrafting. Search weapons, armor, and resources across all servers.",
  keywords: [
    "Albion Online",
    "Albion market",
    "Albion builds",
    "Albion theorycrafting",
    "Albion prices",
    "Albion gold",
    "MMO market tool",
    "Albion crafting",
    "Albion PvP builds",
    "Albion Online tools",
  ],
  authors: [{ name: "Albion Forge", url: SITE_URL }],
  creator: "Albion Forge",
  publisher: "Albion Forge",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Albion Forge — Theorycrafting, Builds & Market",
    description:
      "Real-time Albion Online market prices, item search, crafting recipes, and PvP build theorycrafting. Search weapons, armor, and resources across all servers.",
    type: "website",
    locale: "en_US",
    siteName: "Albion Forge",
    url: SITE_URL,
    images: [
      {
        url: "/albionForge.png",
        width: 1200,
        height: 630,
        alt: "Albion Forge",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Albion Forge — Theorycrafting, Builds & Market",
    description:
      "Real-time Albion Online market prices, item search, recipes, and PvP build theorycrafting.",
    images: ["/albionForge.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  appleWebApp: {
    title: "Albion Forge",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "google-site-verification": "ca-pub-8322554866454465",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const _log=console.log,_warn=console.warn,_error=console.error,_info=console.info;
              console.log=console.warn=console.info=()=>{};
              console.error=(...a)=>{if(a[0]&&typeof a[0]==='string'&&a[0].includes('hydration'))return;_error(...a)};
            `,
          }}
        />
        <meta name="google-adsense-account" content="ca-pub-8322554866454465" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Albion Forge",
              url: SITE_URL,
              description:
                "Real-time Albion Online market prices, item search, crafting recipes, and PvP build theorycrafting.",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${SITE_URL}/market?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Albion Forge",
              url: SITE_URL,
              logo: `${SITE_URL}/albionForge.png`,
              description:
                "Albion Online theorycrafting, market analysis, and build guides.",
            }),
          }}
        />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:px-4 focus:py-2 focus:bg-gold focus:text-black focus:text-sm focus:font-medium"
        >
          Skip to main content
        </a>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8322554866454465"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        <QueryProvider>
          <Header />
          <ForgeNav />
          <div className="flex justify-center">
            <aside className="hidden lg:block w-[160px] shrink-0 sticky top-[73px] h-[calc(100vh-73px)]">
              <div className="p-2 flex justify-center">
                <ins
                  className="adsbygoogle"
                  style={{ display: "block" }}
                  data-ad-client="ca-pub-8322554866454465"
                  data-ad-slot="0000000000"
                  data-ad-format="auto"
                  data-full-width-responsive="true"
                />
              </div>
            </aside>
            <main id="main-content" className="flex-1 min-w-0">
              {children}
            </main>
            <aside className="hidden lg:block w-[160px] shrink-0 sticky top-[73px] h-[calc(100vh-73px)]">
              <div className="p-2 flex justify-center">
                <ins
                  className="adsbygoogle"
                  style={{ display: "block" }}
                  data-ad-client="ca-pub-8322554866454465"
                  data-ad-slot="0000000000"
                  data-ad-format="auto"
                  data-full-width-responsive="true"
                />
              </div>
            </aside>
          </div>
          <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
            Data provided by{" "}
            <a
              href="https://www.albion-online-data.com"
              className="text-gold hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Albion Online Data Project
            </a>
            . Not affiliated with Sandbox Interactive.
          </footer>
          <Analytics />
        </QueryProvider>
      </body>
    </html>
  );
}
