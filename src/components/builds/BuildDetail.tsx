"use client";

import Link from "next/link";
import {
  Shield, ArrowLeft, Swords, DollarSign, Trophy, AlertTriangle, ChevronRight,
  Crosshair, TrendingUp, Clock, Star, Skull, Heart, Users, Sword,
} from "lucide-react";
import { BuildStatusBadge, BuildSourceBadge, BuildBudgetBadge, BuildFreshnessBadge, BuildFeatureBadge } from "@/components/builds/Badges";

interface BuildDetail {
  id: string;
  title: string;
  description: string | null;
  contentType: string;
  partySize: string | null;
  role: string;
  weaponLine: string;
  mainHand: string;
  offHand: string | null;
  head: string;
  chest: string;
  shoes: string;
  cape: string | null;
  bag: string | null;
  mount: string | null;
  food: string | null;
  potion: string | null;
  tierRecommended: number | null;
  enchantRecommended: number | null;
  ipMin: number | null;
  budgetLevel: string;
  difficulty: string;
  patchVersion: string | null;
  lastVerifiedAt: Date | null;
  status: string;
  sourceType: string;
  isRecommended: boolean;
  isPopular: boolean;
  isCheap: boolean;
  isOutdated: boolean;
  pros: string | null;
  cons: string | null;
  combo: string | null;
  strongAgainst: string | null;
  weakAgainst: string | null;
  notes: string | null;
  items: { slot: string; itemName: string; itemUniqueName: string; tier: number | null; enchantment: number | null }[];
  stats: { usages: number; kills: number; deaths: number; assists: number; winRate: number | null; fameRatio: number | null; averageIp: number | null; sampleSize: number; dateRange: string | null; source: string | null; lastSyncedAt: Date | null }[];
  costSnapshots: { totalCost: number | null; mainHandCost: number | null; offHandCost: number | null; headCost: number | null; chestCost: number | null; shoesCost: number | null; capeCost: number | null; bagCost: number | null; mountCost: number | null; foodCost: number | null; potionCost: number | null; server: string; city: string; dataFreshness: string | null; createdAt: Date }[];
}

function SlotIcon({ itemName }: { itemName: string }) {
  return (
    <img
      src={`https://render.albiononline.com/v1/item/${encodeURIComponent(itemName)}.png?quality=4&size=128`}
      alt={itemName}
      className="w-12 h-12"
      loading="lazy"
    />
  );
}

function formatSilver(cost: number | null | undefined): string {
  if (cost === null || cost === undefined) return "—";
  if (cost >= 1_000_000) return `${(cost / 1_000_000).toFixed(1)}M`;
  if (cost >= 1_000) return `${(cost / 1_000).toFixed(0)}K`;
  return cost.toFixed(0);
}

export function BuildDetailPage({ build }: { build: BuildDetail }) {
  const latestCost = build.costSnapshots[0];
  const latestStats = build.stats[0];

  const slotOrder = ["main_hand", "off_hand", "head", "chest", "shoes", "cape", "bag", "mount", "food", "potion"];
  const slotLabels: Record<string, string> = {
    main_hand: "Main Hand", off_hand: "Off Hand", head: "Head", chest: "Chest",
    shoes: "Shoes", cape: "Cape", bag: "Bag", mount: "Mount", food: "Food", potion: "Potion",
  };

  return (
    <div className="min-h-screen text-foreground">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <Link
          href="/builds"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Builds
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Shield className="w-7 h-7 text-gold shrink-0" />
              <h2 className="font-display text-3xl text-gold">{build.title}</h2>
            </div>
            <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
              <span className="capitalize">{build.contentType.replace(/_/g, " ")}</span>
              <ChevronRight className="w-3 h-3" />
              <span>{build.role}</span>
              <ChevronRight className="w-3 h-3" />
              <span>{build.weaponLine}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <BuildStatusBadge status={build.status} />
              <BuildSourceBadge sourceType={build.sourceType} />
              <BuildBudgetBadge budgetLevel={build.budgetLevel} />
              {build.isRecommended && <BuildFeatureBadge type="recommended" />}
              {build.isPopular && <BuildFeatureBadge type="popular" />}
              {build.isCheap && <BuildFeatureBadge type="cheap" />}
              {build.isOutdated && <BuildFeatureBadge type="outdated" />}
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              {build.patchVersion && <span>Patch: {build.patchVersion}</span>}
              {build.lastVerifiedAt && <span>Last verified: {new Date(build.lastVerifiedAt).toLocaleDateString()}</span>}
              {build.tierRecommended && <span>Recommended tier: T{build.tierRecommended}</span>}
              {build.ipMin && <span>Min IP: {build.ipMin.toLocaleString()}</span>}
              <span className="capitalize">Difficulty: {build.difficulty}</span>
              {build.partySize && <span>Party: {build.partySize}</span>}
            </div>
          </div>
        </div>

        <section>
          <h3 className="font-display text-lg text-gold mb-4 flex items-center gap-2">
            <Swords className="w-5 h-5" /> Equipment
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {slotOrder.map((slot) => {
              const item = build.items.find((i) => i.slot === slot);
              if (!item) return null;
              return (
                <div key={slot} className="flex flex-col items-center gap-2 bg-background/40 border border-border/60 rounded-lg p-3">
                  <SlotIcon itemName={item.itemUniqueName} />
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {slotLabels[slot] ?? slot}
                  </span>
                  <span className="text-xs text-center text-foreground font-medium leading-tight line-clamp-2">
                    {item.itemName}
                  </span>
                  {(item.tier || item.enchantment) && (
                    <span className="text-[10px] text-muted-foreground">
                      T{item.tier}.{item.enchantment ?? 0}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {latestCost && (
          <section className="bg-card border border-border rounded-xl p-5 space-y-3">
            <h3 className="font-display text-lg text-gold flex items-center gap-2">
              <DollarSign className="w-5 h-5" /> Estimated Cost
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              {latestCost.totalCost !== null && (
                <div>
                  <span className="text-xs text-muted-foreground">Total cost</span>
                  <p className="font-semibold text-gold">{formatSilver(latestCost.totalCost)} silver</p>
                </div>
              )}
              <div>
                <span className="text-xs text-muted-foreground">City</span>
                <p>{latestCost.city}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Server</span>
                <p className="uppercase">{latestCost.server}</p>
              </div>
              {latestCost.dataFreshness && (
                <div>
                  <span className="text-xs text-muted-foreground">Data freshness</span>
                  <div className="mt-0.5">
                    <BuildFreshnessBadge freshness={latestCost.dataFreshness} />
                  </div>
                </div>
              )}
            </div>
            {latestCost.dataFreshness === "old" || latestCost.dataFreshness === "very_old" ? (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Price data is old. Verify in-game before buying.
              </p>
            ) : null}
          </section>
        )}

        {latestStats && (
          <section className="bg-card border border-border rounded-xl p-5 space-y-3">
            <h3 className="font-display text-lg text-gold flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /> PvP Statistics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div>
                <span className="text-xs text-muted-foreground">Usages</span>
                <p className="font-medium">{latestStats.usages.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Kills</span>
                <p className="font-medium">{latestStats.kills.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Deaths</span>
                <p className="font-medium">{latestStats.deaths.toLocaleString()}</p>
              </div>
              {latestStats.winRate !== null && (
                <div>
                  <span className="text-xs text-muted-foreground">Win rate</span>
                  <p className="font-medium">{latestStats.winRate.toFixed(1)}%</p>
                </div>
              )}
              <div>
                <span className="text-xs text-muted-foreground">Sample size</span>
                <p>{latestStats.sampleSize.toLocaleString()}</p>
              </div>
              {latestStats.fameRatio !== null && (
                <div>
                  <span className="text-xs text-muted-foreground">Fame ratio</span>
                  <p>{latestStats.fameRatio.toFixed(2)}</p>
                </div>
              )}
              {latestStats.averageIp !== null && (
                <div>
                  <span className="text-xs text-muted-foreground">Avg IP</span>
                  <p>{latestStats.averageIp.toFixed(0)}</p>
                </div>
              )}
              {latestStats.source && (
                <div>
                  <span className="text-xs text-muted-foreground">Source</span>
                  <p>{latestStats.source}</p>
                </div>
              )}
            </div>
            {latestStats.dateRange && (
              <p className="text-xs text-muted-foreground">Date range: {latestStats.dateRange}</p>
            )}
            {latestStats.lastSyncedAt && (
              <p className="text-xs text-muted-foreground">
                Last synced: {new Date(latestStats.lastSyncedAt).toLocaleDateString()}
              </p>
            )}
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {build.pros && (
            <section className="bg-card border border-border rounded-xl p-5 space-y-2">
              <h4 className="font-display text-gold flex items-center gap-2">
                <Trophy className="w-4 h-4" /> Pros
              </h4>
              <p className="text-sm text-foreground/80">{build.pros}</p>
            </section>
          )}
          {build.cons && (
            <section className="bg-card border border-border rounded-xl p-5 space-y-2">
              <h4 className="font-display text-amber-500 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Cons
              </h4>
              <p className="text-sm text-foreground/80">{build.cons}</p>
            </section>
          )}
        </div>

        {build.combo && (
          <section className="bg-card border border-border rounded-xl p-5 space-y-2">
            <h4 className="font-display text-gold flex items-center gap-2">
              <Sword className="w-4 h-4" /> Basic Combo
            </h4>
            <p className="text-sm text-foreground/80">{build.combo}</p>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {build.strongAgainst && (
            <section className="bg-card border border-border rounded-xl p-5 space-y-2">
              <h4 className="font-display text-green-400">Strong Against</h4>
              <p className="text-sm text-foreground/80">{build.strongAgainst}</p>
            </section>
          )}
          {build.weakAgainst && (
            <section className="bg-card border border-border rounded-xl p-5 space-y-2">
              <h4 className="font-display text-red-400">Weak Against</h4>
              <p className="text-sm text-foreground/80">{build.weakAgainst}</p>
            </section>
          )}
        </div>

        {build.notes && (
          <section className="bg-card border border-border rounded-xl p-5 space-y-2">
            <h4 className="font-display text-gold">Notes</h4>
            <p className="text-sm text-foreground/80">{build.notes}</p>
          </section>
        )}

        <div className="bg-amber-900/20 border border-amber-800/40 rounded-lg px-4 py-3 text-xs text-amber-300 text-center">
          <AlertTriangle className="inline-block w-3 h-3 mr-1 -mt-0.5" />
          Albion Online changes constantly. Check the date of the last update before investing silver in this build.
        </div>
      </main>
    </div>
  );
}
