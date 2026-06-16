"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Shield, Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BuildCard } from "@/components/builds/BuildCard";
import { FILTER_OPTIONS, filterBuilds, sortBuilds, type BuildFilters, type BuildWithMeta } from "@/lib/builds/buildFilters";

type Tab = "all" | "recommended" | "popular" | "cheap" | "outdated";

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All Builds" },
  { id: "recommended", label: "Recommended" },
  { id: "popular", label: "Popular PvP" },
  { id: "cheap", label: "Cheap" },
  { id: "outdated", label: "Outdated" },
];

export function BuildPageClient({ builds }: { builds: BuildWithMeta[] }) {
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<BuildFilters>({});

  const activeFilterCount = Object.values(filters).filter((v) => v !== undefined && v !== "").length;

  const filtered = useMemo(() => {
    let result = [...builds];

    if (tab === "recommended") result = result.filter((b) => b.isRecommended);
    else if (tab === "popular") result = result.filter((b) => b.isPopular);
    else if (tab === "cheap") result = result.filter((b) => b.isCheap);
    else if (tab === "outdated") result = result.filter((b) => b.isOutdated);

    result = filterBuilds(result, { ...filters, search: search || undefined });
    result = sortBuilds(result, "newest");

    return result;
  }, [builds, tab, filters, search]);

  function setFilter<K extends keyof BuildFilters>(key: K, value: BuildFilters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="min-h-screen text-foreground">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-7 h-7 text-gold" />
          <div>
            <h2 className="font-display text-3xl text-gold">Builds</h2>
            <p className="text-muted-foreground text-sm max-w-2xl">
              Curated builds for every content type. Recommended, popular PvP data, market-calculated cheap builds, and more.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg border text-sm transition ${
                tab === t.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border hover:border-gold/40 text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search builds by name, weapon, or role..."
              className="pl-9 pr-9"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition ${
              showFilters ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-gold/40 text-foreground"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters{activeFilterCount > 0 && ` (${activeFilterCount})`}
          </button>
          <Link
            href="/builds/recommended"
            className="px-4 py-2 rounded-lg border border-border bg-card text-sm text-muted-foreground hover:text-gold hover:border-gold/40 transition"
          >
            Recommended
          </Link>
          <Link
            href="/builds/popular"
            className="px-4 py-2 rounded-lg border border-border bg-card text-sm text-muted-foreground hover:text-gold hover:border-gold/40 transition"
          >
            Popular PvP
          </Link>
          <Link
            href="/builds/cheap"
            className="px-4 py-2 rounded-lg border border-border bg-card text-sm text-muted-foreground hover:text-gold hover:border-gold/40 transition"
          >
            Cheap
          </Link>
        </div>

        {showFilters && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Content Type</label>
                <select
                  value={filters.contentType ?? ""}
                  onChange={(e) => setFilter("contentType", e.target.value || undefined)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">All</option>
                  {FILTER_OPTIONS.contentTypes.map((ct) => (
                    <option key={ct.id} value={ct.id}>{ct.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Role</label>
                <select
                  value={filters.role ?? ""}
                  onChange={(e) => setFilter("role", e.target.value || undefined)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">All</option>
                  {FILTER_OPTIONS.roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Weapon Line</label>
                <select
                  value={filters.weaponLine ?? ""}
                  onChange={(e) => setFilter("weaponLine", e.target.value || undefined)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">All</option>
                  {FILTER_OPTIONS.weaponLines.map((w) => (
                    <option key={w.id} value={w.id}>{w.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Budget</label>
                <select
                  value={filters.budget ?? ""}
                  onChange={(e) => setFilter("budget", e.target.value || undefined)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">All</option>
                  {FILTER_OPTIONS.budgets.map((b) => (
                    <option key={b.id} value={b.id}>{b.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Difficulty</label>
                <select
                  value={filters.difficulty ?? ""}
                  onChange={(e) => setFilter("difficulty", e.target.value || undefined)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">All</option>
                  {FILTER_OPTIONS.difficulties.map((d) => (
                    <option key={d.id} value={d.id}>{d.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Source</label>
                <select
                  value={filters.sourceType ?? ""}
                  onChange={(e) => setFilter("sourceType", e.target.value || undefined)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">All</option>
                  {FILTER_OPTIONS.sourceTypes.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={filters.active ?? false} onChange={(e) => setFilter("active", e.target.checked || undefined)} className="rounded" />
                Active only
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={filters.beginner ?? false} onChange={(e) => setFilter("beginner", e.target.checked || undefined)} className="rounded" />
                Beginner friendly
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Min IP:</span>
                <input
                  type="number"
                  value={filters.minIp ?? ""}
                  onChange={(e) => setFilter("minIp", e.target.value ? Number(e.target.value) : undefined)}
                  className="w-20 bg-background border border-border rounded px-2 py-1 text-sm"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        )}

        {tab === "recommended" && (
          <div className="bg-amber-900/20 border border-amber-800/40 rounded-lg px-4 py-3 text-sm text-amber-300">
            Builds curated manually. Recommended according to content, role, and gameplay experience.
          </div>
        )}
        {tab === "popular" && (
          <div className="bg-blue-900/20 border border-blue-800/40 rounded-lg px-4 py-3 text-sm text-blue-300">
            These builds appear in recent PvP data. Popular does not always mean better.
          </div>
        )}
        {tab === "cheap" && (
          <div className="bg-emerald-900/20 border border-emerald-800/40 rounded-lg px-4 py-3 text-sm text-emerald-300">
            Cost is calculated with current market prices. Verify prices in-game before buying.
          </div>
        )}
        {tab === "outdated" && (
          <div className="bg-red-900/20 border border-red-800/40 rounded-lg px-4 py-3 text-sm text-red-300">
            These builds need review. They may have been affected by balance changes or recent patches.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((b) => (
            <BuildCard key={b.id} build={b} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full bg-card border border-border rounded-xl p-10 text-center text-muted-foreground">
              No builds match the current filters.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
