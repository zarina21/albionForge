import type { Metadata } from "next";
import { ForgePage } from "./_components/ForgePage";

export const metadata: Metadata = {
  title: "Market & Auction House",
  description:
    "Live prices for all Albion Online items. Search weapons, armor, resources and more with market history.",
  openGraph: {
    title: "Albion Forge — Market & Auction House",
    description: "Live prices, history and analysis for Albion Online items.",
  },
};

export default function Page() {
  return <ForgePage />;
}
