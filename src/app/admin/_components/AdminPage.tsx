"use client";

import { useState } from "react";
import { Shield, Pickaxe, BookOpen } from "lucide-react";

interface Build {
  id: string;
  title: string;
  contentType: string;
  role: string;
  weaponLine: string;
  status: string;
}

interface ResourceItem {
  id: number;
  resourceType: string;
  tier: number | null;
  biome: string | null;
  primaryCity: string | null;
  riskZone: string | null;
}

interface GuideItem {
  id: number;
  profession: string;
  professionType: string;
  resource: string | null;
  recommendedTool: string | null;
  recommendedZone: string | null;
}

type Tab = "builds" | "resources" | "professions";

export function AdminPage({
  builds,
  resources,
  guides,
}: {
  builds: Build[];
  resources: ResourceItem[];
  guides: GuideItem[];
}) {
  const [tab, setTab] = useState<Tab>("builds");

  const tabs: { id: Tab; label: string; icon: typeof Shield; count: number }[] = [
    { id: "builds", label: "Builds", icon: Shield, count: builds.length },
    { id: "resources", label: "Resources", icon: Pickaxe, count: resources.length },
    { id: "professions", label: "Professions", icon: BookOpen, count: guides.length },
  ];

  return (
    <div className="min-h-screen text-foreground">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div>
          <h2 className="font-display text-3xl text-gold">Admin</h2>
          <p className="text-muted-foreground max-w-2xl">
            Database overview. View all seeded records across tables.
          </p>
        </div>

        <section>
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition ${
                  tab === t.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border hover:border-gold/40 text-foreground"
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
                <span className="text-xs ml-1 opacity-70">({t.count})</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          {tab === "builds" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="pb-2 pr-4">Title</th>
                    <th className="pb-2 pr-4">Content</th>
                    <th className="pb-2 pr-4">Role</th>
                    <th className="pb-2 pr-4">Weapon</th>
                    <th className="pb-2 pr-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {builds.map((b) => (
                    <tr key={b.id} className="border-b border-border/60 hover:bg-card/60 transition">
                      <td className="py-2 pr-4 font-medium">{b.title}</td>
                      <td className="py-2 pr-4 capitalize text-muted-foreground">{b.contentType.replace(/_/g, " ")}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{b.role}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{b.weaponLine}</td>
                      <td className="py-2 pr-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          b.status === "active" ? "bg-green-900/40 text-green-400" : "bg-yellow-900/40 text-yellow-400"
                        }`}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "resources" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="pb-2 pr-4">Type</th>
                    <th className="pb-2 pr-4">Tier</th>
                    <th className="pb-2 pr-4">Biome</th>
                    <th className="pb-2 pr-4">City</th>
                    <th className="pb-2 pr-4">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {resources.map((r) => (
                    <tr key={r.id} className="border-b border-border/60 hover:bg-card/60 transition">
                      <td className="py-2 pr-4 font-medium">{r.resourceType}</td>
                      <td className="py-2 pr-4">T{r.tier}</td>
                      <td className="py-2 pr-4 capitalize text-muted-foreground">{r.biome}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{r.primaryCity}</td>
                      <td className="py-2 pr-4 capitalize text-muted-foreground">{r.riskZone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "professions" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="pb-2 pr-4">Profession</th>
                    <th className="pb-2 pr-4">Type</th>
                    <th className="pb-2 pr-4">Resource</th>
                    <th className="pb-2 pr-4">Tool</th>
                    <th className="pb-2 pr-4">Zone</th>
                  </tr>
                </thead>
                <tbody>
                  {guides.map((g) => (
                    <tr key={g.id} className="border-b border-border/60 hover:bg-card/60 transition">
                      <td className="py-2 pr-4 font-medium">{g.profession}</td>
                      <td className="py-2 pr-4 capitalize text-muted-foreground">{g.professionType}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{g.resource}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{g.recommendedTool}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{g.recommendedZone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
