import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { isBuildOutdated } from "@/lib/builds/buildOutdatedService";
import { BuildPageClient } from "../BuildPageClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://albionforge.online";

export const metadata: Metadata = {
  title: "Recommended Builds",
  description:
    "Manually curated Albion Online builds recommended by experts for every content type. Hand-picked for performance, reliability and meta relevance.",
  keywords: [
    "recommended Albion builds",
    "curated Albion builds",
    "expert Albion builds",
    "best Albion builds recommended",
    "Albion build tier list",
  ],
  alternates: {
    canonical: `${SITE_URL}/builds/recommended`,
  },
  openGraph: {
    title: "Albion Forge — Recommended Builds",
    description: "Expert-curated Albion Online builds for every content type and playstyle.",
    url: `${SITE_URL}/builds/recommended`,
  },
  twitter: {
    title: "Albion Forge — Recommended Builds",
    description: "Expert-curated Albion Online builds for every content type and playstyle.",
  },
};

export default async function RecommendedPage() {
  const builds = await prisma.build.findMany({
    where: { isRecommended: true },
    include: { costSnapshots: { orderBy: { createdAt: "desc" }, take: 1 }, stats: { take: 1 } },
    orderBy: [{ status: "asc" }, { lastVerifiedAt: { sort: "desc", nulls: "last" } }, { contentType: "asc" }, { weaponLine: "asc" }],
  });

  return <BuildPageClient builds={builds.map((b) => ({ ...b, isOutdated: isBuildOutdated(b) }))} />;
}
