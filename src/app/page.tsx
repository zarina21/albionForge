import type { Metadata } from "next";
import { ForgePage } from "./_components/ForgePage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://albionforge.online";

export const metadata: Metadata = {
  title: "Market & Auction House — Live Prices & Search",
  description:
    "Live prices for all Albion Online items. Search weapons, armor, resources and more with market history across Americas, Europe and Asia servers.",
  keywords: [
    "Albion Online prices",
    "Albion market search",
    "Albion auction house",
    "item prices Albion",
    "Albion market history",
    "Albion item search",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Albion Forge — Live Market & Auction House Prices",
    description: "Live prices, history and analysis for all Albion Online items across every city and server.",
    url: SITE_URL,
  },
  twitter: {
    title: "Albion Forge — Live Market & Auction House Prices",
    description: "Live prices, history and analysis for all Albion Online items across every city and server.",
  },
};

export default function Page() {
  return <ForgePage />;
}
