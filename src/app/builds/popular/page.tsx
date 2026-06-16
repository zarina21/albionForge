import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { isBuildOutdated } from "@/lib/builds/buildOutdatedService";
import { BuildPageClient } from "../BuildPageClient";

export const metadata: Metadata = {
  title: "Popular PvP Builds",
  description: "Builds detected from recent PvP data — popular in the current meta.",
};

export default async function PopularPage() {
  const builds = await prisma.build.findMany({
    where: { isPopular: true },
    include: {
      costSnapshots: { orderBy: { createdAt: "desc" }, take: 1 },
      stats: { orderBy: { lastSyncedAt: "desc" }, take: 1 },
    },
    orderBy: [{ status: "asc" }],
  });

  builds.sort((a, b) => {
    const aUsage = a.stats[0]?.usages ?? 0;
    const bUsage = b.stats[0]?.usages ?? 0;
    return bUsage - aUsage;
  });

  return <BuildPageClient builds={builds.map((b) => ({ ...b, isOutdated: isBuildOutdated(b) }))} />;
}
