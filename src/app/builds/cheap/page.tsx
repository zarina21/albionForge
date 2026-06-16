import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { isBuildOutdated } from "@/lib/builds/buildOutdatedService";
import { BuildPageClient } from "../BuildPageClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://albionforge.online";

export const metadata: Metadata = {
  title: "Cheap & Budget Builds",
  description:
    "Affordable Albion Online builds calculated with current market prices. Find budget-friendly PvP and PvE builds optimized for cost efficiency.",
  keywords: [
    "cheap Albion builds",
    "budget Albion builds",
    "affordable Albion builds",
    "low cost PvP Albion",
    "Albion builds cheap silver",
  ],
  alternates: {
    canonical: `${SITE_URL}/builds/cheap`,
  },
  openGraph: {
    title: "Albion Forge — Cheap & Budget Builds",
    description: "Affordable Albion Online builds with market-calculated costs for budget-conscious players.",
    url: `${SITE_URL}/builds/cheap`,
  },
  twitter: {
    title: "Albion Forge — Cheap & Budget Builds",
    description: "Affordable Albion Online builds with market-calculated costs for budget-conscious players.",
  },
};

export default async function CheapPage() {
  const builds = await prisma.build.findMany({
    where: { isCheap: true },
    include: { costSnapshots: { orderBy: { createdAt: "desc" }, take: 1 }, stats: { take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  builds.sort((a, b) => {
    const aCost = a.costSnapshots[0]?.totalCost ?? Infinity;
    const bCost = b.costSnapshots[0]?.totalCost ?? Infinity;
    return aCost - bCost;
  });

  return <BuildPageClient builds={builds.map((b) => ({ ...b, isOutdated: isBuildOutdated(b) }))} />;
}
