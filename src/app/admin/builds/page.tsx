import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { isBuildOutdated, getOutdatedReason } from "@/lib/builds/buildOutdatedService";
import { AdminBuildsClient } from "./AdminBuildsClient";

export const metadata: Metadata = {
  title: "Admin — Builds",
  description: "Manage all builds in the database.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminBuildsPage() {
  const builds = await prisma.build.findMany({
    include: { costSnapshots: { orderBy: { createdAt: "desc" }, take: 1 }, stats: { take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  const buildsWithMeta = builds.map((b) => ({
    ...b,
    isOutdated: isBuildOutdated(b),
    outdatedReason: getOutdatedReason(b),
  }));

  return <AdminBuildsClient builds={buildsWithMeta} />;
}
