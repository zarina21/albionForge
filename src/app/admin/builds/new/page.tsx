"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { CONTENT_TYPES, ROLES, WEAPON_LINES, BUDGET_LEVELS, DIFFICULTIES, STATUSES, SOURCE_TYPES, SLOTS } from "@/lib/builds/config";

export default function NewBuildPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "", description: "", contentType: "solo_open_world", partySize: "1",
    role: "Melee DPS", weaponLine: "Sword",
    mainHand: "", offHand: "", head: "", chest: "", shoes: "", cape: "", bag: "", mount: "", food: "", potion: "",
    budgetLevel: "medium", difficulty: "medium", status: "active", sourceType: "manual",
    isRecommended: false, isPopular: false, isCheap: false,
    tierRecommended: 4, enchantRecommended: 0, ipMin: 700,
    pros: "", cons: "", combo: "", strongAgainst: "", weakAgainst: "", notes: "",
  });

  const [items, setItems] = useState<{ slot: string; itemName: string; itemUniqueName: string }[]>(
    SLOTS.map((s) => ({ slot: s, itemName: "", itemUniqueName: "" })),
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/builds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.filter((i) => i.itemName && i.itemUniqueName),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const build = await res.json();
      router.push(`/admin/builds`);
    } catch (err) {
      console.error(err);
      alert("Failed to create build");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen text-foreground">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <Link href="/admin/builds" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition">
          <ArrowLeft className="w-4 h-4" /> Back to Admin
        </Link>

        <div className="flex items-center gap-3">
          <Shield className="w-7 h-7 text-gold" />
          <h2 className="font-display text-3xl text-gold">New Build</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="font-display text-gold">Basic Info</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Title *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Content Type *</label>
                <select value={form.contentType} onChange={(e) => setForm({ ...form, contentType: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
                  {Object.entries(CONTENT_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Party Size</label>
                <input value={form.partySize} onChange={(e) => setForm({ ...form, partySize: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Role *</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Weapon Line *</label>
                <select value={form.weaponLine} onChange={(e) => setForm({ ...form, weaponLine: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
                  {WEAPON_LINES.map((w) => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
            </div>
          </section>

          <section className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="font-display text-gold">Equipment Slots</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((item, idx) => (
                <div key={item.slot}>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                    {item.slot.replace(/_/g, " ")} {["main_hand", "head", "chest", "shoes"].includes(item.slot) ? "*" : ""}
                  </label>
                  <input
                    value={item.itemName}
                    onChange={(e) => {
                      const next = [...items];
                      next[idx] = { ...next[idx], itemName: e.target.value, itemUniqueName: e.target.value };
                      setItems(next);
                    }}
                    placeholder="Item name"
                    required={["main_hand", "head", "chest", "shoes"].includes(item.slot)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="font-display text-gold">Configuration</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Budget</label>
                <select value={form.budgetLevel} onChange={(e) => setForm({ ...form, budgetLevel: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
                  {BUDGET_LEVELS.map((b) => <option key={b} value={b}>{b.charAt(0).toUpperCase() + b.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Difficulty</label>
                <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
                  {DIFFICULTIES.map((d) => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
                  {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Source</label>
                <select value={form.sourceType} onChange={(e) => setForm({ ...form, sourceType: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
                  {SOURCE_TYPES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Tier</label>
                <input type="number" value={form.tierRecommended} onChange={(e) => setForm({ ...form, tierRecommended: Number(e.target.value) })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Enchant</label>
                <input type="number" value={form.enchantRecommended} onChange={(e) => setForm({ ...form, enchantRecommended: Number(e.target.value) })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Min IP</label>
                <input type="number" value={form.ipMin} onChange={(e) => setForm({ ...form, ipMin: Number(e.target.value) })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isRecommended} onChange={(e) => setForm({ ...form, isRecommended: e.target.checked })} className="rounded" />
                Recommended
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isPopular} onChange={(e) => setForm({ ...form, isPopular: e.target.checked })} className="rounded" />
                Popular
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isCheap} onChange={(e) => setForm({ ...form, isCheap: e.target.checked })} className="rounded" />
                Cheap
              </label>
            </div>
          </section>

          <section className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="font-display text-gold">Guide</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Pros</label>
                <textarea value={form.pros} onChange={(e) => setForm({ ...form, pros: e.target.value })} rows={3} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Cons</label>
                <textarea value={form.cons} onChange={(e) => setForm({ ...form, cons: e.target.value })} rows={3} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Combo</label>
                <textarea value={form.combo} onChange={(e) => setForm({ ...form, combo: e.target.value })} rows={2} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Strong Against</label>
                <textarea value={form.strongAgainst} onChange={(e) => setForm({ ...form, strongAgainst: e.target.value })} rows={2} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Weak Against</label>
                <textarea value={form.weakAgainst} onChange={(e) => setForm({ ...form, weakAgainst: e.target.value })} rows={2} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Create Build"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
