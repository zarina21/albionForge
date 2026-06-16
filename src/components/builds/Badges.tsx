import { Shield, Star, TrendingUp, DollarSign, AlertTriangle, Archive, FlaskConical, Crosshair } from "lucide-react";

const STATUS_CONFIG = {
  active: { icon: Shield, color: "bg-green-900/40 text-green-400 border-green-800/60", label: "Active" },
  experimental: { icon: FlaskConical, color: "bg-yellow-900/40 text-yellow-400 border-yellow-800/60", label: "Experimental" },
  outdated: { icon: AlertTriangle, color: "bg-red-900/40 text-red-400 border-red-800/60", label: "Outdated" },
  archived: { icon: Archive, color: "bg-gray-800/40 text-gray-400 border-gray-700/60", label: "Archived" },
} as const;

export function BuildStatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.archived;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

const SOURCE_CONFIG = {
  manual: { color: "bg-amber-900/40 text-amber-400 border-amber-800/60", label: "Expert Recommended" },
  pvp_stats: { color: "bg-blue-900/40 text-blue-400 border-blue-800/60", label: "Popular PvP Data" },
  market_calculated: { color: "bg-emerald-900/40 text-emerald-400 border-emerald-800/60", label: "Market Calculated" },
  hybrid: { color: "bg-purple-900/40 text-purple-400 border-purple-800/60", label: "Hybrid" },
} as const;

export function BuildSourceBadge({ sourceType }: { sourceType: string }) {
  const cfg = SOURCE_CONFIG[sourceType as keyof typeof SOURCE_CONFIG] ?? SOURCE_CONFIG.manual;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${cfg.color}`}>
      <Star className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

const BUDGET_CONFIG = {
  cheap: { color: "bg-emerald-900/40 text-emerald-400 border-emerald-800/60" },
  medium: { color: "bg-blue-900/40 text-blue-400 border-blue-800/60" },
  expensive: { color: "bg-orange-900/40 text-orange-400 border-orange-800/60" },
  luxury: { color: "bg-purple-900/40 text-purple-400 border-purple-800/60" },
} as const;

export function BuildBudgetBadge({ budgetLevel }: { budgetLevel: string }) {
  const cfg = BUDGET_CONFIG[budgetLevel as keyof typeof BUDGET_CONFIG] ?? BUDGET_CONFIG.medium;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${cfg.color}`}>
      <DollarSign className="w-3 h-3" />
      {budgetLevel.charAt(0).toUpperCase() + budgetLevel.slice(1)}
    </span>
  );
}

const FRESHNESS_CONFIG = {
  fresh: { icon: TrendingUp, color: "bg-green-900/40 text-green-400 border-green-800/60", label: "Fresh" },
  acceptable: { icon: TrendingUp, color: "bg-yellow-900/40 text-yellow-400 border-yellow-800/60", label: "Acceptable" },
  old: { icon: AlertTriangle, color: "bg-orange-900/40 text-orange-400 border-orange-800/60", label: "Old" },
  very_old: { icon: AlertTriangle, color: "bg-red-900/40 text-red-400 border-red-800/60", label: "Very Old" },
} as const;

export function BuildFreshnessBadge({ freshness }: { freshness: string }) {
  const cfg = FRESHNESS_CONFIG[freshness as keyof typeof FRESHNESS_CONFIG] ?? FRESHNESS_CONFIG.very_old;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

export function BuildFeatureBadge({ type }: { type: "recommended" | "popular" | "cheap" | "outdated" }) {
  const config = {
    recommended: { icon: Star, color: "bg-amber-900/40 text-amber-400 border-amber-800/60", label: "Recommended" },
    popular: { icon: TrendingUp, color: "bg-blue-900/40 text-blue-400 border-blue-800/60", label: "Popular PvP" },
    cheap: { icon: DollarSign, color: "bg-emerald-900/40 text-emerald-400 border-emerald-800/60", label: "Cheap" },
    outdated: { icon: AlertTriangle, color: "bg-red-900/40 text-red-400 border-red-800/60", label: "Needs Review" },
  }[type];

  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border ${config.color}`}>
      <Icon className="w-2.5 h-2.5" />
      {config.label}
    </span>
  );
}
