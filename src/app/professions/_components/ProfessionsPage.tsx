"use client";

import { useState, useMemo } from "react";
import { Axe, Pickaxe, Hammer, Swords, Shield, CookingPot, FlaskConical, Bird } from "lucide-react";

interface Guide {
  id: number;
  profession: string;
  professionType: string;
  resource: string | null;
  recommendedTool: string | null;
  recommendedBiome: string | null;
  recommendedZone: string | null;
  riskLevel: string | null;
  profitNotes: string | null;
  tips: string | null;
}

const TYPES = [
  { id: "gathering", label: "Gathering", icon: Pickaxe },
  { id: "refining", label: "Refining", icon: Hammer },
  { id: "crafting", label: "Crafting", icon: Swords },
  { id: "farming", label: "Farming", icon: Bird },
];

const TYPE_ICONS: Record<string, typeof Pickaxe> = {
  gathering: Pickaxe,
  refining: Hammer,
  crafting: Swords,
  farming: Bird,
};

export function ProfessionsPage({ guides }: { guides: Guide[] }) {
  const [type, setType] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return type ? guides.filter((g) => g.professionType === type) : guides;
  }, [guides, type]);

  return (
    <div className="min-h-screen text-foreground">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Axe className="w-7 h-7 text-gold" />
            <h2 className="font-display text-3xl text-gold">Professions</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Complete guides for all professions in Albion Online — gathering, refining,
            crafting, and farming.
          </p>
        </div>

        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Type</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setType(null)}
              className={`px-4 py-2 rounded-lg border text-sm transition ${
                type === null
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border hover:border-gold/40 text-foreground"
              }`}
            >
              All
            </button>
            {TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id === type ? null : t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition ${
                  type === t.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border hover:border-gold/40 text-foreground"
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          {filtered.map((g) => {
            const Icon = TYPE_ICONS[g.professionType] ?? Axe;
            return (
              <div
                key={g.id}
                className="bg-card border border-border rounded-xl p-5 space-y-3 hover:border-gold/40 transition"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-gold" />
                  <div>
                    <h3 className="font-display text-xl text-gold">{g.profession}</h3>
                    <p className="text-xs text-muted-foreground capitalize">{g.professionType}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground">Resource</span>
                    <p>{g.resource}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Tool</span>
                    <p>{g.recommendedTool}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Biome</span>
                    <p>{g.recommendedBiome}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Zone</span>
                    <p>{g.recommendedZone}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Risk</span>
                    <p className="capitalize">{g.riskLevel}</p>
                  </div>
                </div>
                <div className="text-sm">
                  <p><span className="text-gold">Profit:</span> {g.profitNotes}</p>
                  <p className="mt-1"><span className="text-gold">Tip:</span> {g.tips}</p>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="bg-card border border-border rounded-xl p-10 text-center text-muted-foreground">
              No profession guides match the current filter.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
