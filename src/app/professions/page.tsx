import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProfessionsPage } from "./_components/ProfessionsPage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://albionforge.online";

export const metadata: Metadata = {
  title: "Professions — Gathering, Crafting & Refining Guide",
  description:
    "Complete Albion Online profession guides for gathering, refining, crafting, and farming. Learn optimal tools, locations, and setups.",
  keywords: [
    "Albion professions",
    "Albion gathering guide",
    "Albion crafting guide",
    "Albion refining guide",
    "Albion farming guide",
    "Albion profession leveling",
  ],
  alternates: {
    canonical: `${SITE_URL}/professions`,
  },
  openGraph: {
    title: "Albion Forge — Professions & Guides",
    description: "Complete Albion Online profession guides for gathering, refining, crafting, and farming.",
    url: `${SITE_URL}/professions`,
  },
  twitter: {
    title: "Albion Forge — Professions & Guides",
    description: "Complete Albion Online profession guides for gathering, refining, crafting, and farming.",
  },
};

export default async function Page() {
  const guides = await prisma.professionGuide.findMany({ orderBy: [{ professionType: "asc" }, { profession: "asc" }] });
  return <ProfessionsPage guides={guides} />;
}
