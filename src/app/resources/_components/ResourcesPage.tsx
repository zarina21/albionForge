"use client";

import { useState, useMemo } from "react";
import { Pickaxe, TreePine, Trees, Mountain, Droplets, Shield } from "lucide-react";

interface Resource {
  id: number;
  resourceType: string;
  tier: number | null;
  biome: string | null;
  primaryCity: string | null;
  riskZone: string | null;
  difficulty: string | null;
}

const BIOMES = [
  { id: "forest", label: "Forest", icon: TreePine, city: "Lymhurst" },
  { id: "mountain", label: "Mountain", icon: Mountain, city: "Fort Sterling" },
  { id: "steppe", label: "Steppe", icon: Trees, city: "Bridgewatch" },
  { id: "swamp", label: "Swamp", icon: Droplets, city: "Thetford" },
  { id: "highland", label: "Highland", icon: Mountain, city: "Martlock" },
];

const TIERS = [4, 5, 6, 7, 8];

const RESOURCE_TYPES = [
  { id: "Wood", icon: TreePine, color: "text-amber-600" },
  { id: "Ore", icon: Mountain, color: "text-slate-400" },
  { id: "Hide", icon: Pickaxe, color: "text-amber-800" },
  { id: "Fiber", icon: Droplets, color: "text-green-400" },
  { id: "Stone", icon: Shield, color: "text-slate-500" },
];

export function ResourcesPage({ resources }: { resources: Resource[] }) {
  const [biome, setBiome] = useState<string | null>(null);
  const [tier, setTier] = useState<number | null>(null);
  const [riskZone, setRiskZone] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      if (biome && r.biome !== biome) return false;
      if (tier && r.tier !== tier) return false;
      if (riskZone && r.riskZone !== riskZone) return false;
      return true;
    });
  }, [resources, biome, tier, riskZone]);

  const riskZones = useMemo(() => {
    const zones = new Set(resources.map((r) => r.riskZone));
    return Array.from(zones).sort();
  }, [resources]);

  return (
    <div className="min-h-screen text-foreground">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Pickaxe className="w-7 h-7 text-gold" />
            <h2 className="font-display text-3xl text-gold">Resources</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Gathering resources by biome, tier, and risk zone. Each resource type is
            concentrated in a specific biome and exported from a nearby royal city.
          </p>
        </div>

        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Biome</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setBiome(null)}
              className={`px-4 py-2 rounded-lg border text-sm transition ${
                biome === null
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border hover:border-gold/40 text-foreground"
              }`}
            >
              All
            </button>
            {BIOMES.map((b) => (
              <button
                key={b.id}
                onClick={() => setBiome(b.id === biome ? null : b.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition ${
                  biome === b.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border hover:border-gold/40 text-foreground"
                }`}
              >
                <b.icon className="w-4 h-4" />
                {b.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Tier</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTier(null)}
              className={`px-4 py-2 rounded-lg border text-sm transition ${
                tier === null
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border hover:border-gold/40 text-foreground"
              }`}
            >
              All
            </button>
            {TIERS.map((t) => (
              <button
                key={t}
                onClick={() => setTier(t === tier ? null : t)}
                className={`px-4 py-2 rounded-lg border text-sm transition ${
                  tier === t
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border hover:border-gold/40 text-foreground"
                }`}
              >
                T{t}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Risk Zone</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setRiskZone(null)}
              className={`px-4 py-2 rounded-lg border text-sm transition ${
                riskZone === null
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border hover:border-gold/40 text-foreground"
              }`}
            >
              All
            </button>
            {riskZones.map((z) => (
              <button
                key={z}
                onClick={() => setRiskZone(z === riskZone ? null : z)}
                className={`px-4 py-2 rounded-lg border text-sm capitalize transition ${
                  riskZone === z
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border hover:border-gold/40 text-foreground"
                }`}
              >
                {z}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((r) => {
              const rt = RESOURCE_TYPES.find((t) => t.id === r.resourceType);
              const bio = BIOMES.find((b) => b.id === r.biome);
              return (
                <div
                  key={r.id}
                  className="bg-card border border-border rounded-xl p-4 space-y-2 hover:border-gold/40 transition"
                >
                  <div className="flex items-center gap-2">
                    {rt && <rt.icon className={`w-5 h-5 ${rt.color}`} />}
                    <span className="font-semibold text-gold">
                      T{r.tier} {r.resourceType}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-xs text-muted-foreground">Biome</span>
                      <p className="capitalize">{bio?.label ?? r.biome}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">City</span>
                      <p>{r.primaryCity}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Risk</span>
                      <p className="capitalize">{r.riskZone}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Difficulty</span>
                      <p className="capitalize">{r.difficulty}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="bg-card border border-border rounded-xl p-10 text-center text-muted-foreground">
              No resources match the current filters.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
