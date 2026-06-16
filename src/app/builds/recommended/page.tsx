import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { isBuildOutdated } from "@/lib/builds/buildOutdatedService";
import { BuildPageClient } from "../BuildPageClient";

export const metadata: Metadata = {
  title: "Recommended Builds",
  description: "Manually curated builds recommended by experts for every content type in Albion Online.",
};

export default async function RecommendedPage() {
  const builds = await prisma.build.findMany({
    where: { isRecommended: true },
    include: { costSnapshots: { orderBy: { createdAt: "desc" }, take: 1 }, stats: { take: 1 } },
    orderBy: [{ status: "asc" }, { lastVerifiedAt: { sort: "desc", nulls: "last" } }, { contentType: "asc" }, { weaponLine: "asc" }],
  });

  return <BuildPageClient builds={builds.map((b) => ({ ...b, isOutdated: isBuildOutdated(b) }))} />;
}
