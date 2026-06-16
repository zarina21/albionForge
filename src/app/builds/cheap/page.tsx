import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { isBuildOutdated } from "@/lib/builds/buildOutdatedService";
import { BuildPageClient } from "../BuildPageClient";

export const metadata: Metadata = {
  title: "Cheap Builds",
  description: "Affordable builds calculated with current market prices from Albion Online.",
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
