import { NextRequest, NextResponse } from "next/server";
import { SERVERS } from "@/lib/albion-api";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const region = (searchParams.get("region") ?? "west") as keyof typeof SERVERS;
  const count = Math.min(Math.max(Number(searchParams.get("count")) || 48, 1), 200);

  if (!(region in SERVERS)) {
    return NextResponse.json({ error: "Invalid region" }, { status: 400 });
  }

  try {
    const url = `${SERVERS[region]}/api/v2/stats/gold.json?count=${count}`;
    const res = await fetch(url, { headers: { "accept-encoding": "gzip" } });
    if (!res.ok) throw new Error(`Gold API error ${res.status}`);
    const points = await res.json();
    return NextResponse.json({ points });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gold fetch failed" },
      { status: 500 },
    );
  }
}
