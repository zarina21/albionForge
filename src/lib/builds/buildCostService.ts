import { DEFAULT_CITY, DEFAULT_SERVER, MIN_POPULAR_SAMPLE_SIZE, MIN_POPULAR_USAGES, MIN_POPULAR_WIN_RATE, MAX_POPULAR_DATA_AGE_DAYS } from "./config";
import { fetchPrices } from "@/lib/albion/marketApi";
import type { PrismaClient } from "@/generated/prisma/client";

export async function calculateBuildCost(
  prisma: PrismaClient,
  buildId: string,
  options?: { server?: string; city?: string },
) {
  const server = options?.server ?? DEFAULT_SERVER;
  const city = options?.city ?? DEFAULT_CITY;

  const buildItems = await prisma.buildItem.findMany({ where: { buildId } });
  if (buildItems.length === 0) return null;

  const itemIds = buildItems.map((i) => i.itemUniqueName);
  const prices = await fetchPrices(itemIds, {
    server: server as any,
    locations: city,
    qualities: "1",
  });

  const costMap: Record<string, number> = {};
  for (const item of buildItems) {
    const priceEntry = prices.find(
      (p) => p.item_id === item.itemUniqueName && p.city === city,
    );
    costMap[item.itemUniqueName] = priceEntry?.sell_price_min ?? 0;
  }

  const slotCostMap: Record<string, number | null> = {};
  let totalCost = 0;
  for (const item of buildItems) {
    const cost = costMap[item.itemUniqueName] ?? null;
    const slotKey = `${item.slot}Cost` as keyof typeof slotCostMap;
    (slotCostMap as any)[slotKey] = cost;
    if (cost !== null && !isNaN(cost)) totalCost += cost;
  }

  const freshnessMinutes = prices.length > 0
    ? (Date.now() - new Date(prices[0].sell_price_min_date).getTime()) / 60000
    : Infinity;

  const dataFreshness =
    freshnessMinutes < 30 ? "fresh"
    : freshnessMinutes < 120 ? "acceptable"
    : freshnessMinutes < 720 ? "old"
    : "very_old";

  return prisma.buildCostSnapshot.create({
    data: {
      buildId,
      server,
      city,
      totalCost: isNaN(totalCost) ? null : totalCost,
      mainHandCost: null,
      offHandCost: null,
      headCost: null,
      chestCost: null,
      shoesCost: null,
      capeCost: null,
      bagCost: null,
      mountCost: null,
      foodCost: null,
      potionCost: null,
      dataFreshness,
    },
  });
}

export function determineIsPopular(stats: {
  usages: number;
  sampleSize: number;
  winRate: number | null;
  lastSyncedAt: Date | null;
}): boolean {
  if (stats.usages < MIN_POPULAR_USAGES) return false;
  if (stats.sampleSize < MIN_POPULAR_SAMPLE_SIZE) return false;
  if (stats.winRate !== null && stats.winRate < MIN_POPULAR_WIN_RATE) return false;
  if (stats.lastSyncedAt) {
    const daysSinceSync = (Date.now() - new Date(stats.lastSyncedAt).getTime()) / 86400000;
    if (daysSinceSync > MAX_POPULAR_DATA_AGE_DAYS) return false;
  }
  return true;
}
