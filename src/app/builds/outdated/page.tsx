import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { isBuildOutdated, getOutdatedReason } from "@/lib/builds/buildOutdatedService";
import Link from "next/link";
import { AlertTriangle, Clock, Shield } from "lucide-react";
import { BuildStatusBadge } from "@/components/builds/Badges";

export const metadata: Metadata = {
  title: "Outdated Builds",
  description: "Builds that need review — affected by balance changes or recent patches.",
};

export default async function OutdatedPage() {
  const builds = await prisma.build.findMany({
    include: { costSnapshots: { orderBy: { createdAt: "desc" }, take: 1 } },
    orderBy: { lastVerifiedAt: { sort: "asc", nulls: "first" } },
  });

  const outdated = builds.filter((b) => isBuildOutdated(b));

  return (
    <div className="min-h-screen text-foreground">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-7 h-7 text-gold" />
          <div>
            <h2 className="font-display text-3xl text-gold">Outdated Builds</h2>
            <p className="text-muted-foreground text-sm max-w-2xl">
              These builds need review. They may have been affected by balance changes or recent patches.
            </p>
          </div>
        </div>

        <div className="bg-red-900/20 border border-red-800/40 rounded-lg px-4 py-3 text-sm text-red-300">
          <AlertTriangle className="inline-block w-4 h-4 mr-2 -mt-0.5" />
          This build needs revision. It may have been affected by balance changes or recent patches. Check the last updated date before investing silver in this build.
        </div>

        <div className="space-y-4">
          {outdated.map((b) => (
            <Link
              key={b.id}
              href={`/builds/${b.id}`}
              className="bg-card border border-red-800/40 rounded-xl p-5 space-y-3 hover:border-red-500/60 transition block"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-lg text-gold">{b.title}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{b.contentType.replace(/_/g, " ")}</p>
                </div>
                <BuildStatusBadge status={b.status} />
              </div>
              <div className="flex items-center gap-2 text-sm text-red-400">
                <Clock className="w-4 h-4" />
                <span>{getOutdatedReason(b)}</span>
              </div>
              {b.lastVerifiedAt && (
                <p className="text-xs text-muted-foreground">
                  Last verified: {new Date(b.lastVerifiedAt).toLocaleDateString()}
                  {b.patchVersion && ` (patch: ${b.patchVersion})`}
                </p>
              )}
            </Link>
          ))}
          {outdated.length === 0 && (
            <div className="bg-card border border-border rounded-xl p-10 text-center text-muted-foreground">
              No outdated builds found.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
