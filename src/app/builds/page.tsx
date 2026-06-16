import { prisma } from "@/lib/prisma";
import { isBuildOutdated } from "@/lib/builds/buildOutdatedService";
import { BuildPageClient } from "./BuildPageClient";

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
