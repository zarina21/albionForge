import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { isBuildOutdated } from "@/lib/builds/buildOutdatedService";
import { BuildPageClient } from "../BuildPageClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://albionforge.online";

export const metadata: Metadata = {
  title: "Popular PvP Builds",
  description:
    "The most popular Albion Online PvP builds detected from recent PvP data. Discover what top players are using in the current meta.",
  keywords: [
    "popular Albion builds",
    "meta Albion builds",
    "top PvP builds Albion",
    "Albion meta builds",
    "most used Albion builds",
    "Albion PvP meta",
  ],
  alternates: {
    canonical: `${SITE_URL}/builds/popular`,
  },
  openGraph: {
    title: "Albion Forge — Popular PvP Builds",
    description: "The most popular Albion Online PvP builds detected from recent PvP killboard data.",
    url: `${SITE_URL}/builds/popular`,
  },
  twitter: {
    title: "Albion Forge — Popular PvP Builds",
    description: "The most popular Albion Online PvP builds detected from recent PvP killboard data.",
  },
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
