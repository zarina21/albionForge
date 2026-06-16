"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, ArrowLeft, Save, Trash2 } from "lucide-react";
import Link from "next/link";

interface BuildItem {
  id?: number;
  buildId?: string;
  slot: string;
  itemName: string;
  itemUniqueName: string;
  tier: number | null;
  enchantment: number | null;
  quality: number;
}

interface BuildData {
  id: string;
  title: string;
  slug: string;
  description: string | null;
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
  bag: string | null;
  mount: string | null;
  food: string | null;
  potion: string | null;
  budgetLevel: string;
  difficulty: string;
  status: string;
  sourceType: string;
  isRecommended: boolean;
  isPopular: boolean;
  isCheap: boolean;
  ipMin: number | null;
  tierRecommended: number | null;
  enchantRecommended: number | null;
  pros: string | null;
  cons: string | null;
  combo: string | null;
  strongAgainst: string | null;
  weakAgainst: string | null;
  notes: string | null;
  items: BuildItem[];
}

export function EditBuildClient({ build: initial }: { build: BuildData }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/builds/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      router.push("/admin/builds");
    } catch (err) {
      console.error(err);
      alert("Failed to update build");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this build permanently?")) return;
    try {
      await fetch(`/api/admin/builds/${form.id}`, { method: "DELETE" });
      router.push("/admin/builds");
    } catch (err) {
      console.error(err);
      alert("Failed to delete build");
    }
  }

  async function handleRecalculateCost() {
    const res = await fetch(`/api/admin/builds/${form.id}?action=recalculate-cost`, { method: "POST" });
    if (!res.ok) { alert("Failed"); return; }
    alert("Cost recalculated!");
  }

  async function handleMarkReviewed() {
    const res = await fetch(`/api/admin/builds/${form.id}?action=mark-reviewed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patchVersion: "latest", statusAfterReview: "active" }),
    });
    if (!res.ok) { alert("Failed"); return; }
    alert("Marked as reviewed!");
    router.refresh();
  }

  return (
    <div className="min-h-screen text-foreground">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <Link href="/admin/builds" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition">
          <ArrowLeft className="w-4 h-4" /> Back to Admin
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-7 h-7 text-gold" />
            <h2 className="font-display text-3xl text-gold">Edit Build</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={handleRecalculateCost} className="px-3 py-2 rounded-lg border border-border bg-card text-xs text-muted-foreground hover:text-gold transition">
              Recalculate Cost
            </button>
            <button onClick={handleMarkReviewed} className="px-3 py-2 rounded-lg border border-border bg-card text-xs text-muted-foreground hover:text-green-400 transition">
              Mark Reviewed
            </button>
            <button onClick={handleDelete} className="px-3 py-2 rounded-lg border border-red-800/40 bg-card text-xs text-red-400 hover:bg-red-900/40 transition">
              <Trash2 className="w-3.5 h-3.5 inline mr-1" />
              Delete
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="font-display text-gold">Basic Info</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm opacity-60" disabled />
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
            <h3 className="font-display text-gold">Status & Metadata</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
                  {["active", "experimental", "outdated", "archived"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Source</label>
                <select value={form.sourceType} onChange={(e) => setForm({ ...form, sourceType: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
                  {["manual", "pvp_stats", "market_calculated", "hybrid"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Budget</label>
                <select value={form.budgetLevel} onChange={(e) => setForm({ ...form, budgetLevel: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
                  {["cheap", "medium", "expensive", "luxury"].map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Difficulty</label>
                <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
                  {["easy", "medium", "hard", "expert"].map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs block text-muted-foreground">Content Type</label>
                <input value={form.contentType} onChange={(e) => setForm({ ...form, contentType: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs block text-muted-foreground">Role</label>
                <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs block text-muted-foreground">Weapon Line</label>
                <input value={form.weaponLine} onChange={(e) => setForm({ ...form, weaponLine: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs block text-muted-foreground">Main Hand</label>
                <input value={form.mainHand} onChange={(e) => setForm({ ...form, mainHand: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
          </section>

          <section className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="font-display text-gold">Equipment</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {form.items.map((item, idx) => (
                <div key={item.slot}>
                  <label className="text-xs text-muted-foreground block mb-1">{item.slot.replace(/_/g, " ")}</label>
                  <input
                    value={item.itemName}
                    onChange={(e) => {
                      const next = [...form.items];
                      next[idx] = { ...next[idx], itemName: e.target.value, itemUniqueName: e.target.value };
                      setForm({ ...form, items: next });
                    }}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="font-display text-gold">Guide</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(["pros", "cons", "combo", "strongAgainst", "weakAgainst", "notes"] as const).map((field) => (
                <div key={field} className={field === "notes" ? "sm:col-span-2" : ""}>
                  <label className="text-xs text-muted-foreground block mb-1 capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
                  <textarea
                    value={(form[field] as string | null) ?? ""}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    rows={3}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              ))}
            </div>
          </section>

          <div className="flex justify-end gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
