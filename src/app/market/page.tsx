import type { Metadata } from "next";
import { MarketPage } from "./_components/MarketPage";

export const metadata: Metadata = {
  title: "Market",
  description: "Search Albion Online item prices across all cities and servers.",
  openGraph: {
    title: "Albion Forge — Market",
    description: "Live item prices from all Albion Online cities and servers.",
  },
};

export default function Page() {
  return <MarketPage />;
}
