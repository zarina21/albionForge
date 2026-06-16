import type { PrismaClient } from "@/generated/prisma/client";
import { MIN_POPULAR_SAMPLE_SIZE, MIN_POPULAR_USAGES } from "./config";

export interface PvpStatsInput {
  mainHand: string;
  offHand?: string;
  head: string;
  chest: string;
  shoes: string;
  cape?: string;
  food?: string;
  potion?: string;
  contentType: string;
  usages: number;
  kills: number;
  deaths: number;
  assists: number;
  winRate: number;
  fameRatio: number;
  averageIp: number;
  sampleSize: number;
  dateRange: string;
  source: string;
}

export async function importPvpStats(
  prisma: PrismaClient,
  data: PvpStatsInput,
): Promise<{ buildId: string; isNew: boolean }> {
  const builds = await prisma.build.findMany({
    include: { items: true, stats: true },
  });

  const inputItems = [
    { slot: "main_hand", itemUniqueName: data.mainHand },
    ...(data.offHand ? [{ slot: "off_hand", itemUniqueName: data.offHand }] : []),
    { slot: "head", itemUniqueName: data.head },
    { slot: "chest", itemUniqueName: data.chest },
    { slot: "shoes", itemUniqueName: data.shoes },
    ...(data.cape ? [{ slot: "cape", itemUniqueName: data.cape }] : []),
    ...(data.food ? [{ slot: "food", itemUniqueName: data.food }] : []),
    ...(data.potion ? [{ slot: "potion", itemUniqueName: data.potion }] : []),
  ];

  const inputFingerprint = inputItems
    .map((i) => `${i.slot}:${i.itemUniqueName}`)
    .sort()
    .join("|");

  let matchedBuild = builds.find((b) => {
    const buildFp = b.items
      .map((i) => `${i.slot}:${i.itemUniqueName}`)
      .sort()
      .join("|");
    return buildFp === inputFingerprint;
  });

  if (matchedBuild) {
    const existingStats = matchedBuild.stats.find((s) => s.source === data.source);
    if (existingStats) {
      await prisma.buildStats.update({
        where: { id: existingStats.id },
        data: {
          usages: data.usages,
          kills: data.kills,
          deaths: data.deaths,
          assists: data.assists,
          winRate: data.winRate,
          fameRatio: data.fameRatio,
          averageIp: data.averageIp,
          sampleSize: data.sampleSize,
          dateRange: data.dateRange,
          lastSyncedAt: new Date(),
        },
      });
    } else {
      await prisma.buildStats.create({
        data: {
          buildId: matchedBuild.id,
          source: data.source,
          contentType: data.contentType,
          usages: data.usages,
          kills: data.kills,
          deaths: data.deaths,
          assists: data.assists,
          winRate: data.winRate,
          fameRatio: data.fameRatio,
          averageIp: data.averageIp,
          sampleSize: data.sampleSize,
          dateRange: data.dateRange,
          lastSyncedAt: new Date(),
        },
      });
    }

    const isPopular =
      data.usages >= MIN_POPULAR_USAGES &&
      data.sampleSize >= MIN_POPULAR_SAMPLE_SIZE &&
      data.winRate >= 50;

    if (isPopular && !matchedBuild.isPopular) {
      await prisma.build.update({
        where: { id: matchedBuild.id },
        data: { isPopular: true, sourceType: matchedBuild.sourceType === "manual" ? "hybrid" : "pvp_stats" },
      });
    }

    return { buildId: matchedBuild.id, isNew: false };
  }

  const newBuild = await prisma.build.create({
    data: {
      title: `Popular ${data.contentType} Build`,
      slug: `popular-${data.mainHand.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      contentType: data.contentType,
      role: "Melee DPS",
      weaponLine: "Sword",
      mainHand: data.mainHand,
      offHand: data.offHand,
      head: data.head,
      chest: data.chest,
      shoes: data.shoes,
      cape: data.cape,
      food: data.food,
      potion: data.potion,
      budgetLevel: "medium",
      difficulty: "medium",
      status: "experimental",
      sourceType: "pvp_stats",
      isPopular: data.usages >= MIN_POPULAR_USAGES && data.sampleSize >= MIN_POPULAR_SAMPLE_SIZE,
    },
  });

  const slotMap: Record<string, string> = {
    main_hand: data.mainHand,
    head: data.head,
    chest: data.chest,
    shoes: data.shoes,
  };
  if (data.offHand) slotMap.off_hand = data.offHand;
  if (data.cape) slotMap.cape = data.cape;
  if (data.food) slotMap.food = data.food;
  if (data.potion) slotMap.potion = data.potion;

  await prisma.buildItem.createMany({
    data: Object.entries(slotMap).map(([slot, itemUniqueName]) => ({
      buildId: newBuild.id,
      slot,
      itemName: itemUniqueName,
      itemUniqueName,
    })),
  });

  await prisma.buildStats.create({
    data: {
      buildId: newBuild.id,
      source: data.source,
      contentType: data.contentType,
      usages: data.usages,
      kills: data.kills,
      deaths: data.deaths,
      assists: data.assists,
      winRate: data.winRate,
      fameRatio: data.fameRatio,
      averageIp: data.averageIp,
      sampleSize: data.sampleSize,
      dateRange: data.dateRange,
      lastSyncedAt: new Date(),
    },
  });

  return { buildId: newBuild.id, isNew: true };
}
