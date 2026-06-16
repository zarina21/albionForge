import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { isBuildOutdated } from "@/lib/builds/buildOutdatedService";
import { BuildPageClient } from "./BuildPageClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://albionforge.online";

export const metadata: Metadata = {
  title: "All Builds",
  description:
    "Browse all Albion Online PvP and PvE builds. Filter by content type, role, weapon, budget and difficulty.",
  keywords: [
    "Albion builds",
    "Albion PvP builds",
    "Albion PvE builds",
    "Albion build guide",
    "Albion theorycrafting builds",
    "best Albion builds",
  ],
  alternates: {
    canonical: `${SITE_URL}/builds`,
  },
  openGraph: {
    title: "Albion Forge — All Builds",
    description:
      "Browse all Albion Online PvP and PvE builds. Filter by content type, role, weapon, budget and difficulty.",
    url: `${SITE_URL}/builds`,
  },
  twitter: {
    title: "Albion Forge — All Builds",
    description:
      "Browse all Albion Online PvP and PvE builds. Filter by content type, role, weapon, budget and difficulty.",
  },
};

export default async function BuildsPage() {
  const builds = await prisma.build.findMany({
    include: { costSnapshots: { orderBy: { createdAt: "desc" }, take: 1 }, stats: { take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  const buildsWithMeta = builds.map((b) => ({
    ...b,
    isOutdated: isBuildOutdated(b),
  }));

  return <BuildPageClient builds={buildsWithMeta} />;
}
