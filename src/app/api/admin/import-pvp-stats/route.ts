import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { importPvpStats, type PvpStatsInput } from "@/lib/builds/pvpBuildStatsService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Expected array of PvP stat entries" }, { status: 400 });
    }

    const results = [];
    for (const entry of body) {
      const result = await importPvpStats(prisma, entry as PvpStatsInput);
      results.push(result);
    }

    return NextResponse.json({
      success: true,
      imported: results.length,
      newBuilds: results.filter((r) => r.isNew).length,
      updated: results.filter((r) => !r.isNew).length,
      results,
    });
  } catch (error) {
    console.error("Failed to import PvP stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
