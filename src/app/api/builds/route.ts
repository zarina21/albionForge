import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isBuildOutdated } from "@/lib/builds/buildOutdatedService";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const contentType = searchParams.get("contentType");
  const role = searchParams.get("role");
  const weaponLine = searchParams.get("weaponLine");
  const budget = searchParams.get("budget");
  const status = searchParams.get("status");
  const sourceType = searchParams.get("sourceType");
  const recommended = searchParams.get("recommended");
  const popular = searchParams.get("popular");
  const cheap = searchParams.get("cheap");
  const search = searchParams.get("search");
  const limit = Math.min(Number(searchParams.get("limit") ?? "50"), 100);
  const offset = Number(searchParams.get("offset") ?? "0");

  const where: Record<string, unknown> = {};
  if (contentType) where.contentType = contentType;
  if (role) where.role = role;
  if (weaponLine) where.weaponLine = weaponLine;
  if (budget) where.budgetLevel = budget;
  if (status) where.status = status;
  if (sourceType) where.sourceType = sourceType;
  if (recommended === "true") where.isRecommended = true;
  if (popular === "true") where.isPopular = true;
  if (cheap === "true") where.isCheap = true;
  if (search) where.title = { contains: search };

  const [builds, total] = await Promise.all([
    prisma.build.findMany({
      where: where as any,
      include: {
        items: true,
        stats: { orderBy: { lastSyncedAt: "desc" }, take: 1 },
        costSnapshots: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      skip: offset,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.build.count({ where: where as any }),
  ]);

  const buildsWithMeta = builds.map((b) => ({
    ...b,
    isOutdated: isBuildOutdated(b),
  }));

  return NextResponse.json({ builds: buildsWithMeta, total, limit, offset });
}
