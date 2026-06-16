"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Shield, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Build {
  id: string;
  title: string;
  contentType: string;
  partySize: string | null;
  role: string;
  weaponLine: string;
  mainHand: string;
  budgetLevel: string;
  difficulty: string;
  status: string;
}

const CONTENT_TYPES = [
  "solo_mists",
  "solo_open_world",
  "corrupted_dungeons",
  "crystal_arena_5v5",
  "zvz",
  "solo_gathering",
];

const CONTENT_LABELS: Record<string, string> = {
  solo_mists: "Solo Mists",
  solo_open_world: "Solo Open World",
  corrupted_dungeons: "Corrupted Dungeons",
  crystal_arena_5v5: "Crystal Arena 5v5",
  zvz: "ZvZ",
  solo_gathering: "Solo Gathering",
};

const ROLES = [
  "Mobility build",
  "Sustain DPS",
  "Kite DPS",
  "Healer",
  "Engage Tank",
  "Clap DPS",
  "Escape gatherer",
];

const BUDGET_LEVELS = ["Cheap", "Medium", "Expensive"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export function BuildsPage({ builds: allBuilds }: { builds: Build[] }) {
  const [contentType, setContentType] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return allBuilds.filter((b) => {
      if (contentType && b.contentType !== contentType) return false;
      if (role && b.role !== role) return false;
      if (budget && b.budgetLevel !== budget) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const match = [b.title, b.mainHand, b.weaponLine, b.role, b.contentType].some((s) =>
          s.toLowerCase().includes(q),
        );
        if (!match) return false;
      }
      return true;
    });
  }, [allBuilds, contentType, role, budget, query]);

  return (
    <div className="min-h-screen text-foreground">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-7 h-7 text-gold" />
            <h2 className="font-display text-3xl text-gold">Builds</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Curated builds for every content type in Albion Online. Filter by role,
            budget, or search for a specific weapon.
          </p>
        </div>

        <section>
          <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Search
          </label>
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search builds by name, weapon, or role..."
              className="pl-9 pr-9"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Content</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setContentType(null)}
              className={`px-4 py-2 rounded-lg border text-sm transition ${
                contentType === null
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border hover:border-gold/40 text-foreground"
              }`}
            >
              All
            </button>
            {CONTENT_TYPES.map((ct) => (
              <button
                key={ct}
                onClick={() => setContentType(ct === contentType ? null : ct)}
                className={`px-4 py-2 rounded-lg border text-sm transition ${
                  contentType === ct
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border hover:border-gold/40 text-foreground"
                }`}
              >
                {CONTENT_LABELS[ct] ?? ct}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Role</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setRole(null)}
              className={`px-4 py-2 rounded-lg border text-sm transition ${
                role === null
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border hover:border-gold/40 text-foreground"
              }`}
            >
              All
            </button>
            {ROLES.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r === role ? null : r)}
                className={`px-4 py-2 rounded-lg border text-sm transition ${
                  role === r
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border hover:border-gold/40 text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Budget</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setBudget(null)}
              className={`px-4 py-2 rounded-lg border text-sm transition ${
                budget === null
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border hover:border-gold/40 text-foreground"
              }`}
            >
              All
            </button>
            {BUDGET_LEVELS.map((b) => (
              <button
                key={b}
                onClick={() => setBudget(b === budget ? null : b)}
                className={`px-4 py-2 rounded-lg border text-sm transition ${
                  budget === b
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border hover:border-gold/40 text-foreground"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((b) => (
            <Link
              key={b.id}
              href={`/builds/${b.id}`}
              className="bg-card border border-border rounded-xl p-5 space-y-3 hover:border-gold/40 transition group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-xl text-gold group-hover:text-gold/80 transition">
                    {b.title}
                  </h3>
                  <p className="text-xs text-muted-foreground capitalize">
                    {CONTENT_LABELS[b.contentType] ?? b.contentType}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full capitalize ${
                    b.status === "active"
                      ? "bg-green-900/40 text-green-400"
                      : "bg-yellow-900/40 text-yellow-400"
                  }`}
                >
                  {b.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-background/60 px-2 py-1 rounded border border-border/60">
                  {b.role}
                </span>
                <span className="text-xs bg-background/60 px-2 py-1 rounded border border-border/60">
                  {b.weaponLine}
                </span>
                <span className="text-xs bg-background/60 px-2 py-1 rounded border border-border/60">
                  {b.mainHand}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded border ${
                    b.budgetLevel === "Cheap"
                      ? "border-green-800/60 text-green-400"
                      : b.budgetLevel === "Expensive"
                        ? "border-red-800/60 text-red-400"
                        : "border-yellow-800/60 text-yellow-400"
                  }`}
                >
                  {b.budgetLevel}
                </span>
                <span className="text-xs bg-background/60 px-2 py-1 rounded border border-border/60">
                  {b.difficulty}
                </span>
              </div>
                <p className="text-xs text-muted-foreground">
                    Party size: {b.partySize ?? "N/A"}
                </p>
            </Link>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full bg-card border border-border rounded-xl p-10 text-center text-muted-foreground">
              No builds match the current filters.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
