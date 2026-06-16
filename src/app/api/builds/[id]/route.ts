import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isBuildOutdated } from "@/lib/builds/buildOutdatedService";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const build = await prisma.build.findUnique({
    where: { id },
    include: {
      items: true,
      stats: { orderBy: { lastSyncedAt: "desc" } },
      costSnapshots: { orderBy: { createdAt: "desc" }, take: 10 },
      reviews: { orderBy: { verifiedAt: "desc" } },
    },
  });

  if (!build) {
    return NextResponse.json({ error: "Build not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...build,
    isOutdated: isBuildOutdated(build),
  });
}
