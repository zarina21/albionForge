import { NextRequest, NextResponse } from "next/server";
import { SERVERS, CITIES } from "@/lib/albion-api";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const itemId = String(searchParams.get("itemId") ?? "").slice(0, 128);
  const region = (searchParams.get("region") ?? "west") as keyof typeof SERVERS;
  const timeScale = [1, 6, 24].includes(Number(searchParams.get("timeScale")))
    ? Number(searchParams.get("timeScale"))
    : 24;
  const quality = [1, 2, 3, 4, 5].includes(Number(searchParams.get("quality")))
    ? Number(searchParams.get("quality"))
    : 0;

  if (!itemId) {
    return NextResponse.json({ error: "itemId is required" }, { status: 400 });
  }
  if (!(region in SERVERS)) {
    return NextResponse.json({ error: "Invalid region" }, { status: 400 });
  }

  try {
    const qParam = quality ? `&qualities=${quality}` : "";
    const url = `${SERVERS[region]}/api/v2/stats/history/${encodeURIComponent(
      itemId,
    )}.json?locations=${CITIES.slice(0, 6).join(",")}&time-scale=${timeScale}${qParam}`;
    const res = await fetch(url, { headers: { "accept-encoding": "gzip" } });
    if (!res.ok) throw new Error(`History API error ${res.status}`);
    const series = await res.json();
    return NextResponse.json({ series });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "History fetch failed" },
      { status: 500 },
    );
  }
}
