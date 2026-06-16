import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ResourcesPage } from "./_components/ResourcesPage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://albionforge.online";

export const metadata: Metadata = {
  title: "Resources — Gathering & Farming Guide",
  description:
    "Browse Albion Online resources by biome, tier, and risk zone. Find where to gather ore, wood, fiber, hide, stone and more.",
  keywords: [
    "Albion resources",
    "Albion gathering",
    "Albion farming",
    "Albion ore",
    "Albion wood",
    "Albion fiber",
    "Albion hide",
    "Albion stone",
    "Albion gathering guide",
  ],
  alternates: {
    canonical: `${SITE_URL}/resources`,
  },
  openGraph: {
    title: "Albion Forge — Resources & Gathering",
    description: "Albion Online resource locations, biomes and gathering data for all materials.",
    url: `${SITE_URL}/resources`,
  },
  twitter: {
    title: "Albion Forge — Resources & Gathering",
    description: "Albion Online resource locations, biomes and gathering data for all materials.",
  },
};

export default async function Page() {
  const resources = await prisma.resource.findMany({ orderBy: [{ resourceType: "asc" }, { tier: "asc" }] });
  return <ResourcesPage resources={resources} />;
}
