import Link from "next/link";
import { BuildStatusBadge, BuildSourceBadge, BuildBudgetBadge, BuildFeatureBadge } from "@/components/builds/Badges";

interface BuildCardData {
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
  costSnapshots?: { totalCost: number | null; dataFreshness: string | null; createdAt: Date }[];
}

const CONTENT_LABEL: Record<string, string> = {
  solo_mists: "Solo Mists",
  solo_open_world: "Solo Open World",
  corrupted_dungeons: "Corrupted Dungeons",
  crystal_arena_5v5: "Crystal Arena 5v5",
  zvz: "ZvZ",
  solo_gathering: "Solo Gathering",
  ganking: "Ganking",
};

function formatSilver(cost: number | null): string {
  if (cost === null || cost === 0) return "—";
  if (cost >= 1_000_000) return `${(cost / 1_000_000).toFixed(1)}M`;
  if (cost >= 1_000) return `${(cost / 1_000).toFixed(0)}K`;
  return cost.toFixed(0);
}

export function BuildCard({ build }: { build: BuildCardData }) {
  const latestCost = build.costSnapshots?.[0];
  const hasFeatureBadge = build.isRecommended || build.isPopular || build.isCheap || build.isOutdated;

  return (
    <Link
      href={`/builds/${build.id}`}
      className="bg-card border border-border rounded-xl p-5 space-y-3 hover:border-gold/40 transition group block"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-display text-lg text-gold group-hover:text-gold/80 transition truncate">
            {build.title}
          </h3>
          <p className="text-xs text-muted-foreground capitalize">
            {CONTENT_LABEL[build.contentType] ?? build.contentType.replace(/_/g, " ")}
          </p>
        </div>
        <div className="flex flex-wrap gap-1 shrink-0">
          <BuildStatusBadge status={build.status} />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <BuildSourceBadge sourceType={build.sourceType} />
        <BuildBudgetBadge budgetLevel={build.budgetLevel} />
        <span className="text-xs bg-background/60 px-2 py-0.5 rounded border border-border/60">
          {build.role}
        </span>
        <span className="text-xs bg-background/60 px-2 py-0.5 rounded border border-border/60">
          {build.weaponLine}
        </span>
      </div>

      {hasFeatureBadge && (
        <div className="flex flex-wrap gap-1">
          {build.isRecommended && <BuildFeatureBadge type="recommended" />}
          {build.isPopular && <BuildFeatureBadge type="popular" />}
          {build.isCheap && <BuildFeatureBadge type="cheap" />}
          {build.isOutdated && <BuildFeatureBadge type="outdated" />}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Main hand:</span>{" "}
          <span className="text-foreground">{build.mainHand}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Difficulty:</span>{" "}
          <span className="capitalize">{build.difficulty}</span>
        </div>
        {build.ipMin && (
          <div>
            <span className="text-muted-foreground">Min IP:</span>{" "}
            <span>{build.ipMin.toLocaleString()}</span>
          </div>
        )}
        {latestCost?.totalCost && (
          <div>
            <span className="text-muted-foreground">Est. cost:</span>{" "}
            <span>{formatSilver(latestCost.totalCost)} silver</span>
          </div>
        )}
      </div>

      {build.lastVerifiedAt && (
        <p className="text-[10px] text-muted-foreground">
          Last verified: {new Date(build.lastVerifiedAt).toLocaleDateString()}
          {build.patchVersion && ` (patch: ${build.patchVersion})`}
        </p>
      )}
    </Link>
  );
}
