import type { Metadata } from "next";
import { BuildPage } from "./_components/BuildPage";

export const metadata: Metadata = {
  title: "Builds",
  description: "Explora builds populares por contenido y rol en Albion Online. Encuentra el set perfecto para PvE, PvP, ZvZ y más.",
  openGraph: {
    title: "Albion Forge — Builds",
    description: "Builds populares de Albion Online filtradas por contenido y rol.",
  },
};

export default function Page() {
  return <BuildPage />;
}
