"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Plus, Search, X, CheckCircle, AlertCircle, Edit3, Trash2, Copy, DollarSign, RefreshCw } from "lucide-react";
import { BuildStatusBadge, BuildSourceBadge, BuildBudgetBadge, BuildFeatureBadge } from "@/components/builds/Badges";

interface AdminBuild {
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
  isRecommended: boolean;
  isPopular: boolean;
  isCheap: boolean;
  isOutdated: boolean;
  ipMin: number | null;
  patchVersion: string | null;
  lastVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  outdatedReason: string;
  costSnapshots: { totalCost: number | null }[];
}

export function AdminBuildsClient({ builds }: { builds: AdminBuild[] }) {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const filtered = builds.filter((b) => {
    if (selectedStatus && b.status !== selectedStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return [b.title, b.mainHand, b.weaponLine, b.role, b.contentType, b.id].some((s) =>
        s.toLowerCase().includes(q),
      );
    }
    return true;
  });

  const statusSummary = {
    total: builds.length,
    active: builds.filter((b) => b.status === "active").length,
    experimental: builds.filter((b) => b.status === "experimental").length,
    outdated: builds.filter((b) => b.isOutdated).length,
    recommended: builds.filter((b) => b.isRecommended).length,
    popular: builds.filter((b) => b.isPopular).length,
    cheap: builds.filter((b) => b.isCheap).length,
  };

  return (
    <div className="min-h-screen text-foreground">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-7 h-7 text-gold" />
            <div>
              <h2 className="font-display text-3xl text-gold">Admin — Builds</h2>
              <p className="text-muted-foreground text-sm">Manage all builds in the database.</p>
            </div>
          </div>
          <Link
            href="/admin/builds/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 transition"
          >
            <Plus className="w-4 h-4" />
            New Build
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-gold">{statusSummary.total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-400">{statusSummary.active}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-yellow-400">{statusSummary.experimental}</p>
            <p className="text-xs text-muted-foreground">Experimental</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-red-400">{statusSummary.outdated}</p>
            <p className="text-xs text-muted-foreground">Outdated</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-amber-400">{statusSummary.recommended}</p>
            <p className="text-xs text-muted-foreground">Recommended</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-blue-400">{statusSummary.popular}</p>
            <p className="text-xs text-muted-foreground">Popular</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-emerald-400">{statusSummary.cheap}</p>
            <p className="text-xs text-muted-foreground">Cheap</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search builds..."
              className="w-full bg-background border border-border rounded-lg pl-9 pr-9 py-2 text-sm"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-background border border-border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="experimental">Experimental</option>
            <option value="outdated">Outdated</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="pb-2 pr-3">Title</th>
                <th className="pb-2 pr-3">Status</th>
                <th className="pb-2 pr-3">Source</th>
                <th className="pb-2 pr-3">Flags</th>
                <th className="pb-2 pr-3">Content</th>
                <th className="pb-2 pr-3">Role</th>
                <th className="pb-2 pr-3">Weapon</th>
                <th className="pb-2 pr-3">Patch</th>
                <th className="pb-2 pr-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-b border-border/60 hover:bg-card/60 transition">
                  <td className="py-2 pr-3">
                    <Link href={`/builds/${b.id}`} className="text-gold hover:underline font-medium">
                      {b.title}
                    </Link>
                  </td>
                  <td className="py-2 pr-3">
                    <BuildStatusBadge status={b.status} />
                  </td>
                  <td className="py-2 pr-3">
                    <BuildSourceBadge sourceType={b.sourceType} />
                  </td>
                  <td className="py-2 pr-3">
                    <div className="flex gap-1">
                      {b.isRecommended && <BuildFeatureBadge type="recommended" />}
                      {b.isPopular && <BuildFeatureBadge type="popular" />}
                      {b.isCheap && <BuildFeatureBadge type="cheap" />}
                      {b.isOutdated && <BuildFeatureBadge type="outdated" />}
                    </div>
                  </td>
                  <td className="py-2 pr-3 text-muted-foreground capitalize max-w-[120px] truncate">
                    {b.contentType.replace(/_/g, " ")}
                  </td>
                  <td className="py-2 pr-3 text-muted-foreground max-w-[100px] truncate">{b.role}</td>
                  <td className="py-2 pr-3 text-muted-foreground">{b.weaponLine}</td>
                  <td className="py-2 pr-3 text-muted-foreground">{b.patchVersion ?? "—"}</td>
                  <td className="py-2 pr-3">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/builds/${b.id}`}
                        className="p-1.5 text-muted-foreground hover:text-gold transition rounded hover:bg-background/60"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/builds/${b.id}`}
                        className="p-1.5 text-muted-foreground hover:text-blue-400 transition rounded hover:bg-background/60"
                        title="View"
                      >
                        <Shield className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="bg-card border border-border rounded-xl p-10 text-center text-muted-foreground mt-4">
              No builds found.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
