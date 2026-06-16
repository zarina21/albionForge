import type { Metadata } from "next";
import Script from "next/script";
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
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Albion Forge — Theorycrafting & Market",
    description:
      "Search items, view live prices across cities and chart history.",
    type: "website",
    images: ["/albionForge.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/albionForge.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" translate="no" suppressHydrationWarning>
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
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
        />
      </head>
      <body>
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
            <main className="flex-1 min-w-0">
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
        </QueryProvider>
      </body>
    </html>
  );
}
