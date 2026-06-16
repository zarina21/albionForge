import type { Metadata } from "next";
import { GoldPage } from "./_components/GoldPage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://albionforge.online";

export const metadata: Metadata = {
  title: "Gold Price — Live & Historical Gold Chart",
  description:
    "Live gold prices for Albion Online. Track gold trends across Americas, Europe and Asia servers with historical charts and analysis.",
  keywords: [
    "Albion Online gold",
    "gold price Albion",
    "Albion gold chart",
    "Albion premium gold",
    "gold trend Albion",
    "buy gold Albion",
  ],
  alternates: {
    canonical: `${SITE_URL}/gold`,
  },
  openGraph: {
    title: "Albion Forge — Live Gold Prices & Chart",
    description:
      "Track gold prices and trends across all Albion Online servers with historical data.",
    url: `${SITE_URL}/gold`,
  },
  twitter: {
    title: "Albion Forge — Live Gold Prices & Chart",
    description:
      "Track gold prices and trends across all Albion Online servers with historical data.",
  },
};

export default function Page() {
  return <GoldPage />;
}
