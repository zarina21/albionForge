import type { Metadata } from "next";
import { MarketPage } from "./_components/MarketPage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://albionforge.online";

export const metadata: Metadata = {
  title: "Market — Albion Online Item Prices",
  description:
    "Real-time Albion Online market prices for all items. Check sell and buy orders across all cities. Compare prices between servers and track market trends.",
  keywords: [
    "Albion market",
    "Albion item prices",
    "Albion sell order",
    "Albion buy order",
    "Albion market search",
    "Albion Online auction house",
  ],
  alternates: {
    canonical: `${SITE_URL}/market`,
  },
  openGraph: {
    title: "Albion Forge — Market & Item Prices",
    description: "Real-time Albion Online market prices for all items across all cities and servers.",
    url: `${SITE_URL}/market`,
  },
  twitter: {
    title: "Albion Forge — Market & Item Prices",
    description: "Real-time Albion Online market prices for all items across all cities and servers.",
  },
};

export default function Page() {
  return <MarketPage />;
}
