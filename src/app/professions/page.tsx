import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProfessionsPage } from "./_components/ProfessionsPage";

export const metadata: Metadata = {
  title: "Professions",
  description: "Albion Online profession guides for gathering, refining, crafting, and farming.",
  openGraph: {
    title: "Albion Forge — Professions",
    description: "Complete profession guides for Albion Online.",
  },
};

export default async function Page() {
  const guides = await prisma.professionGuide.findMany({ orderBy: [{ professionType: "asc" }, { profession: "asc" }] });
  return <ProfessionsPage guides={guides} />;
}
