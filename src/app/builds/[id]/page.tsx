import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isBuildOutdated } from "@/lib/builds/buildOutdatedService";
import { BuildDetailPage } from "@/components/builds/BuildDetail";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const builds = await prisma.build.findMany({ select: { id: true } });
  return builds.map((b) => ({ id: b.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const build = await prisma.build.findUnique({ where: { id } });
  if (!build) return { title: "Build Not Found" };
  return {
    title: build.title,
    description: build.description ?? `${build.contentType} build using ${build.mainHand} — ${build.role}.`,
    openGraph: {
      title: `Albion Forge — ${build.title}`,
      description: build.description ?? `${build.role} build for ${build.contentType}. Budget: ${build.budgetLevel}.`,
    },
  };
}

export default async function BuildDetail({ params }: Props) {
  const { id } = await params;
  const build = await prisma.build.findUnique({
    where: { id },
    include: {
      items: true,
      stats: { orderBy: { lastSyncedAt: "desc" }, take: 1 },
      costSnapshots: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  if (!build) notFound();

  const buildWithOutdated = {
    ...build,
    isOutdated: isBuildOutdated(build),
  };

  return <BuildDetailPage build={buildWithOutdated} />;
}
