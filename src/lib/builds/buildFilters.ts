import { CONTENT_TYPES, ROLES, WEAPON_LINES, BUDGET_LEVELS, DIFFICULTIES, STATUSES, SOURCE_TYPES } from "./config";

export interface BuildFilters {
  contentType?: string;
  role?: string;
  weaponLine?: string;
  budget?: string;
  difficulty?: string;
  status?: string;
  sourceType?: string;
  minIp?: number;
  tier?: number;
  search?: string;
  recommended?: boolean;
  popular?: boolean;
  cheap?: boolean;
  outdated?: boolean;
  active?: boolean;
  beginner?: boolean;
}

export interface BuildWithMeta {
  id: string;
  title: string;
  slug: string;
  contentType: string;
  role: string;
  weaponLine: string;
  mainHand: string;
  budgetLevel: string;
  difficulty: string;
  status: string;
  sourceType: string;
  ipMin: number | null;
  tierRecommended: number | null;
  isRecommended: boolean;
  isPopular: boolean;
  isCheap: boolean;
  isOutdated: boolean;
  lastVerifiedAt: Date | null;
  patchVersion: string | null;
  costSnapshots?: { totalCost: number | null; city: string; dataFreshness: string | null; createdAt: Date }[];
  stats?: { usages: number; winRate: number | null; sampleSize: number; lastSyncedAt: Date | null }[];
}

export function filterBuilds(builds: BuildWithMeta[], filters: BuildFilters): BuildWithMeta[] {
  return builds.filter((b) => {
    if (filters.contentType && b.contentType !== filters.contentType) return false;
    if (filters.role && b.role !== filters.role) return false;
    if (filters.weaponLine && b.weaponLine !== filters.weaponLine) return false;
    if (filters.budget && b.budgetLevel !== filters.budget) return false;
    if (filters.difficulty && b.difficulty !== filters.difficulty) return false;
    if (filters.status && b.status !== filters.status) return false;
    if (filters.sourceType && b.sourceType !== filters.sourceType) return false;
    if (filters.minIp !== undefined && (b.ipMin === null || b.ipMin < filters.minIp)) return false;
    if (filters.tier !== undefined && (b.tierRecommended === null || b.tierRecommended < filters.tier)) return false;
    if (filters.recommended && !b.isRecommended) return false;
    if (filters.popular && !b.isPopular) return false;
    if (filters.cheap && !b.isCheap) return false;
    if (filters.outdated && !b.isOutdated) return false;
    if (filters.active && b.status !== "active") return false;
    if (filters.beginner && b.difficulty !== "easy") return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match = [b.title, b.mainHand, b.weaponLine, b.role, b.contentType].some((s) =>
        s.toLowerCase().includes(q),
      );
      if (!match) return false;
    }
    return true;
  });
}

export function sortBuilds(builds: BuildWithMeta[], sort: string): BuildWithMeta[] {
  const sorted = [...builds];
  switch (sort) {
    case "recommended":
      return sorted.sort((a, b) => (a.isRecommended === b.isRecommended ? 0 : a.isRecommended ? -1 : 1));
    case "popular":
      return sorted.sort((a, b) => {
        const aUsage = a.stats?.[0]?.usages ?? 0;
        const bUsage = b.stats?.[0]?.usages ?? 0;
        return bUsage - aUsage;
      });
    case "cheap":
      return sorted.sort((a, b) => {
        const aCost = a.costSnapshots?.[0]?.totalCost ?? Infinity;
        const bCost = b.costSnapshots?.[0]?.totalCost ?? Infinity;
        return aCost - bCost;
      });
    case "newest":
      return sorted.sort((a, b) => {
        const aDate = a.lastVerifiedAt?.getTime() ?? 0;
        const bDate = b.lastVerifiedAt?.getTime() ?? 0;
        return bDate - aDate;
      });
    case "oldest":
      return sorted.sort((a, b) => {
        const aDate = a.lastVerifiedAt?.getTime() ?? 0;
        const bDate = b.lastVerifiedAt?.getTime() ?? 0;
        return aDate - bDate;
      });
    default:
      return sorted;
  }
}

export const FILTER_OPTIONS = {
  contentTypes: Object.entries(CONTENT_TYPES).map(([id, label]) => ({ id, label })),
  roles: ROLES.map((r) => ({ id: r, label: r })),
  weaponLines: WEAPON_LINES.map((w) => ({ id: w, label: w })),
  budgets: BUDGET_LEVELS.map((b) => ({ id: b, label: b.charAt(0).toUpperCase() + b.slice(1) })),
  difficulties: DIFFICULTIES.map((d) => ({ id: d, label: d.charAt(0).toUpperCase() + d.slice(1) })),
  statuses: STATUSES.map((s) => ({ id: s, label: s.charAt(0).toUpperCase() + s.slice(1) })),
  sourceTypes: SOURCE_TYPES.map((s) => ({ id: s, label: s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) })),
};
