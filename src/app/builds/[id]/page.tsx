import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isBuildOutdated } from "@/lib/builds/buildOutdatedService";
import { BuildDetailPage } from "@/components/builds/BuildDetail";
import Script from "next/script";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://albionforge.online";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const builds = await prisma.build.findMany({ select: { slug: true } });
    return builds.map((b) => ({ id: b.slug }));
  } catch {
    console.warn("DB not available during build — skipping static generation for builds/[id]");
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  let build;
  try {
    build = await prisma.build.findUnique({ where: { slug: id } });
  } catch {
    return { title: "Build Not Found" };
  }
  if (!build) return { title: "Build Not Found" };
  const contentLabel = build.contentType.replace(/_/g, " ");
  return {
    title: `${build.title} — ${build.role} ${contentLabel} Build`,
    description:
      build.description ??
      `Albion Online ${contentLabel} build using ${build.mainHand} — ${build.role}. Budget: ${build.budgetLevel}. Last verified ${new Date(build.lastVerifiedAt ?? new Date()).toLocaleDateString()}.`,
    keywords: [
      `Albion ${build.title}`,
      `${build.weaponLine} build Albion`,
      `${contentLabel} build`,
      `Albion ${build.role}`,
      `${build.mainHand} Albion`,
      `Albion ${build.budgetLevel} build`,
    ],
    alternates: {
      canonical: `${SITE_URL}/builds/${build.slug}`,
    },
    openGraph: {
      title: `Albion Forge — ${build.title}`,
      description:
        build.description ??
        `${build.role} build for ${contentLabel}. Budget: ${build.budgetLevel}. Weapon: ${build.mainHand}.`,
      url: `${SITE_URL}/builds/${build.slug}`,
    },
    twitter: {
      title: `Albion Forge — ${build.title}`,
      description:
        build.description ??
        `${build.role} build for ${contentLabel}. Budget: ${build.budgetLevel}. Weapon: ${build.mainHand}.`,
    },
  };
}

export default async function BuildDetail({ params }: Props) {
  const slug = (await params).id;
  let build;
  try {
    build = await prisma.build.findUnique({
      where: { slug },
      include: {
        items: true,
        stats: { orderBy: { lastSyncedAt: "desc" }, take: 1 },
        costSnapshots: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });
  } catch {
    notFound();
  }

  if (!build) notFound();

  const buildWithOutdated = {
    ...build,
    isOutdated: isBuildOutdated(build),
  };

  return (
    <>
      <Script
        id="build-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: build.title,
            description: build.description ?? `${build.role} build for ${build.contentType.replace(/_/g, " ")}.`,
            author: {
              "@type": "Organization",
              name: "Albion Forge",
              url: SITE_URL,
            },
            datePublished: build.createdAt.toISOString(),
            dateModified: build.updatedAt.toISOString(),
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${SITE_URL}/builds/${build.slug}`,
            },
            image: `${SITE_URL}/albionForge.png`,
          }),
        }}
      />
      <BuildDetailPage build={buildWithOutdated} />
    </>
  );
}
