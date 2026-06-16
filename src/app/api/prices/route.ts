import { NextRequest, NextResponse } from "next/server";
import { SERVERS, CITIES } from "@/lib/albion-api";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const itemId = String(searchParams.get("itemId") ?? "").slice(0, 128);
  const region = (searchParams.get("region") ?? "west") as keyof typeof SERVERS;
  const qualities = String(searchParams.get("qualities") ?? "").replace(/[^0-9,]/g, "").slice(0, 16);

  if (!itemId) {
    return NextResponse.json({ error: "itemId is required" }, { status: 400 });
  }
  if (!(region in SERVERS)) {
    return NextResponse.json({ error: "Invalid region" }, { status: 400 });
  }

  try {
    const qParam = qualities ? `&qualities=${qualities}` : "";
    const url = `${SERVERS[region]}/api/v2/stats/prices/${encodeURIComponent(
      itemId,
    )}.json?locations=${CITIES.join(",")}${qParam}`;
    const res = await fetch(url, { headers: { "accept-encoding": "gzip" } });
    if (!res.ok) throw new Error(`Price API error ${res.status}`);
    const rows = await res.json();
    return NextResponse.json({ rows });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Prices fetch failed" },
      { status: 500 },
    );
  }
}
