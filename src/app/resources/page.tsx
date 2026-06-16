import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ResourcesPage } from "./_components/ResourcesPage";

export const metadata: Metadata = {
  title: "Resources",
  description: "Browse Albion Online resources by biome, tier, and risk zone.",
  openGraph: {
    title: "Albion Forge — Resources",
    description: "Resource locations and gathering data for Albion Online.",
  },
};

export default async function Page() {
  const resources = await prisma.resource.findMany({ orderBy: [{ resourceType: "asc" }, { tier: "asc" }] });
  return <ResourcesPage resources={resources} />;
}
