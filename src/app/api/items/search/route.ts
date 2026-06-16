import { NextRequest, NextResponse } from "next/server";
import { loadItems, isWeaponOrArmor, type AlbionItem } from "@/lib/albion-api";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").slice(0, 64);
  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 30, 1), 60);
  const category = searchParams.get("category") === "equipment" ? "equipment" : "all";

  try {
    const items = await loadItems();
    const query = q.trim().toLowerCase();
    if (!query) return NextResponse.json({ items: [] as AlbionItem[] });

    const matches: AlbionItem[] = [];
    for (const it of items) {
      const en = it.LocalizedNames?.["EN-US"]?.toLowerCase() ?? "";
      const es = it.LocalizedNames?.["ES-ES"]?.toLowerCase() ?? "";
      const uid = it.UniqueName.toLowerCase();
      if (en.includes(query) || es.includes(query) || uid.includes(query)) {
        if (category === "equipment" && !isWeaponOrArmor(it.UniqueName)) continue;
        matches.push({
          UniqueName: it.UniqueName,
          LocalizedNames: it.LocalizedNames ?? null,
        });
        if (matches.length >= limit) break;
      }
    }
    return NextResponse.json({ items: matches });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Search failed" },
      { status: 500 },
    );
  }
}
