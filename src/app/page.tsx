import type { Metadata } from "next";
import { ForgePage } from "./_components/ForgePage";

export const metadata: Metadata = {
  title: "Mercado y Subasta",
  description:
    "Consulta precios en vivo de todos los items de Albion Online. Busca armas, armaduras, recursos y más con historial de mercado.",
  openGraph: {
    title: "Albion Forge — Mercado y Subasta",
    description: "Precios en vivo, historial y análisis de items de Albion Online.",
  },
};

export default function Page() {
  return <ForgePage />;
}
