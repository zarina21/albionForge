"use client";

import Link from "next/link";
import { Shield, ArrowLeft, Swords, DollarSign, Trophy, AlertTriangle, ChevronRight } from "lucide-react";

interface Build {
  id: string;
  title: string;
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
  food: string | null;
  potion: string | null;
  bag: string | null;
  mount: string | null;
  budgetLevel: string;
  difficulty: string;
  status: string;
  pros: string | null;
  cons: string | null;
  combo: string | null;
  strongAgainst: string | null;
  weakAgainst: string | null;
  notes: string | null;
}

function SlotCard({ label, name }: { label: string; name: string | null }) {
  if (!name) return null;
  const uid = encodeURIComponent(name);
  return (
    <div className="flex flex-col items-center gap-2 bg-background/40 border border-border/60 rounded-lg p-3">
      <img
        src={`https://render.albiononline.com/v1/item/${uid}.png?quality=4&size=128`}
        alt={name}
        className="w-16 h-16"
        loading="lazy"
      />
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-xs text-center text-foreground font-medium leading-tight">{name}</span>
    </div>
  );
}

export function BuildDetailPage({ build }: { build: Build }) {
  const slots: { key: string; label: string; name: string | null }[] = [
    { key: "mainHand", label: "Main Hand", name: build.mainHand },
    ...(build.offHand ? [{ key: "offHand", label: "Off Hand", name: build.offHand }] : []),
    { key: "head", label: "Head", name: build.head },
    { key: "chest", label: "Chest", name: build.chest },
    { key: "shoes", label: "Shoes", name: build.shoes },
    { key: "cape", label: "Cape", name: build.cape },
    ...(build.bag ? [{ key: "bag", label: "Bag", name: build.bag }] : []),
    ...(build.mount ? [{ key: "mount", label: "Mount", name: build.mount }] : []),
  ];

  return (
    <div className="min-h-screen text-foreground">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <Link
          href="/builds"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Builds
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-7 h-7 text-gold" />
              <h2 className="font-display text-3xl text-gold">{build.title}</h2>
            </div>
            <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
              <span className="capitalize">{build.contentType.replace(/_/g, " ")}</span>
              <ChevronRight className="w-3 h-3" />
              <span>{build.role}</span>
              <ChevronRight className="w-3 h-3" />
              <span>{build.weaponLine}</span>
            </div>
          </div>
          <span
            className={`text-xs px-3 py-1 rounded-full capitalize ${
              build.status === "active"
                ? "bg-green-900/40 text-green-400"
                : "bg-yellow-900/40 text-yellow-400"
            }`}
          >
            {build.status}
          </span>
        </div>

        <section>
          <h3 className="font-display text-lg text-gold mb-4 flex items-center gap-2">
            <Swords className="w-5 h-5" /> Equipment
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {slots.map((s) => (
              <SlotCard key={s.key} label={s.label} name={s.name} />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {build.food && (
              <div className="bg-background/40 border border-border/60 rounded-lg p-3">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Food</span>
                <p className="text-sm font-medium mt-1">{build.food}</p>
              </div>
            )}
            {build.potion && (
              <div className="bg-background/40 border border-border/60 rounded-lg p-3">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Potion</span>
                <p className="text-sm font-medium mt-1">{build.potion}</p>
              </div>
            )}
            <div className="bg-background/40 border border-border/60 rounded-lg p-3">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Budget</span>
              <p className="text-sm font-medium mt-1">{build.budgetLevel}</p>
            </div>
            <div className="bg-background/40 border border-border/60 rounded-lg p-3">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Difficulty</span>
              <p className="text-sm font-medium mt-1">{build.difficulty}</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-xl p-5 space-y-2">
            <h4 className="font-display text-gold flex items-center gap-2">
              <Trophy className="w-4 h-4" /> Pros
            </h4>
            <p className="text-sm text-foreground/80">{build.pros}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 space-y-2">
            <h4 className="font-display text-amber-500 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Cons
            </h4>
            <p className="text-sm text-foreground/80">{build.cons}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 space-y-2">
            <h4 className="font-display text-gold flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Combo
            </h4>
            <p className="text-sm text-foreground/80">{build.combo}</p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-5 space-y-2">
            <h4 className="font-display text-green-400">Strong Against</h4>
            <p className="text-sm text-foreground/80">{build.strongAgainst}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 space-y-2">
            <h4 className="font-display text-red-400">Weak Against</h4>
            <p className="text-sm text-foreground/80">{build.weakAgainst}</p>
          </div>
        </section>

        {build.notes && (
          <section className="bg-card border border-border rounded-xl p-5 space-y-2">
            <h4 className="font-display text-gold">Notes</h4>
            <p className="text-sm text-foreground/80">{build.notes}</p>
          </section>
        )}

        <div className="text-xs text-muted-foreground text-center">
          Party size: {build.partySize ?? "N/A"}
        </div>
      </main>
    </div>
  );
}
