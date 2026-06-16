const API_BASE = {
  west: "https://west.albion-online-data.com",
  east: "https://east.albion-online-data.com",
  europe: "https://europe.albion-online-data.com",
} as const;

type Server = keyof typeof API_BASE;

export interface PriceEntry {
  item_id: string;
  city: string;
  quality: number;
  sell_price_min: number;
  sell_price_min_date: string;
  sell_price_max: number;
  buy_price_min: number;
  buy_price_max: number;
  buy_price_max_date: string;
}

export async function fetchPrices(
  itemIds: string[],
  options?: {
    server?: Server;
    locations?: string;
    qualities?: string;
  },
): Promise<PriceEntry[]> {
  const server = options?.server ?? "west";
  const locations = options?.locations ?? "Bridgewatch,Martlock,Thetford,Fort Sterling,Lymhurst,Caerleon,Brecilien";
  const qualities = options?.qualities ?? "1,2,3,4,5";

  if (itemIds.length === 0) return [];

  const ids = itemIds.map((id) => encodeURIComponent(id)).join(",");
  const url = `${API_BASE[server]}/api/v2/stats/prices/${ids}.json?locations=${encodeURIComponent(locations)}&qualities=${qualities}`;

  const res = await fetch(url, {
    headers: { "User-Agent": "AlbionForge/1.0" },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Albion API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function fetchGoldPrice(server?: Server): Promise<number> {
  const s = server ?? "west";
  const url = `${API_BASE[s]}/api/v2/stats/gold`;

  const res = await fetch(url, {
    headers: { "User-Agent": "AlbionForge/1.0" },
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`Gold API error: ${res.status}`);
  const data = await res.json();
  return data[0]?.price ?? 0;
}

export function getFreshnessLabel(minutes: number): string {
  if (minutes < 30) return "fresh";
  if (minutes < 120) return "acceptable";
  if (minutes < 720) return "old";
  return "very_old";
}

export function getFreshnessMinutes(dateStr: string | null | undefined): number {
  if (!dateStr) return Infinity;
  const date = new Date(dateStr);
  return (Date.now() - date.getTime()) / 60000;
}
