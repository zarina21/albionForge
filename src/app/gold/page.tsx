import type { Metadata } from "next";
import { GoldPage } from "./_components/GoldPage";

export const metadata: Metadata = {
  title: "Precio del Oro",
  description: "Precio histórico del oro en Albion Online. Cotización en vivo del gold en los servidores Americas, Europe y Asia.",
  openGraph: {
    title: "Albion Forge — Precio del Oro",
    description: "Cotización y tendencia histórica del oro en Albion Online.",
  },
};

export default function Page() {
  return <GoldPage />;
}
