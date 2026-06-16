export const SERVERS = {
  west: "https://west.albion-online-data.com",
  east: "https://east.albion-online-data.com",
  europe: "https://europe.albion-online-data.com",
} as const;

export type ServerRegion = keyof typeof SERVERS;

export const CITIES = [
  "Caerleon",
  "Bridgewatch",
  "Martlock",
  "Lymhurst",
  "Fort Sterling",
  "Thetford",
  "Brecilien",
  "Black Market",
] as const;

export interface AlbionItem {
  UniqueName: string;
  LocalizedNames?: Record<string, string> | null;
  LocalizedDescriptions?: Record<string, string> | null;
  Index?: string;
}

export interface PriceRow {
  item_id: string;
  city: string;
  quality: number;
  sell_price_min: number;
  sell_price_min_date: string;
  sell_price_max: number;
  buy_price_max: number;
  buy_price_max_date: string;
}

export interface HistoryPoint {
  timestamp: string;
  item_count: number;
  avg_price: number;
}

export interface HistorySeries {
  location: string;
  item_id: string;
  quality: number;
  data: HistoryPoint[];
}

let itemsCache: { data: AlbionItem[]; ts: number } | null = null;
const ITEMS_TTL = 1000 * 60 * 60 * 6;

export async function loadItems(): Promise<AlbionItem[]> {
  if (itemsCache && Date.now() - itemsCache.ts < ITEMS_TTL) return itemsCache.data;
  const res = await fetch(
    "https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/formatted/items.json",
    { headers: { "accept-encoding": "gzip" } },
  );
  if (!res.ok) throw new Error("Failed to fetch items database");
  const json = (await res.json()) as AlbionItem[];
  itemsCache = { data: json, ts: Date.now() };
  return json;
}

export function isWeaponOrArmor(uid: string): boolean {
  const u = uid.toUpperCase();
  if (u.includes("TOOL")) return false;
  if (u.includes("MOUNT")) return false;
  if (u.includes("BAG")) return false;
  if (u.includes("POTION")) return false;
  if (u.includes("MEAL")) return false;
  if (u.includes("BANNER")) return false;
  if (u.includes("LABORER")) return false;
  if (u.includes("FURNITURE")) return false;
  if (u.includes("QUESTITEM")) return false;
  if (u.includes("TRASH")) return false;
  if (u.includes("ARTEFACT")) return false;
  if (u.includes("RUNE")) return false;
  if (u.includes("SOUL")) return false;
  if (u.includes("RELIC")) return false;
  if (u.includes("_MAIN_") || u.includes("_2H_") || u.includes("_OFF_")) return true;
  if (u.includes("HEAD_") || u.includes("ARMOR_") || u.includes("SHOES_")) return true;
  if (u.includes("CAPEITEM_") || u.includes("CAPE_")) return true;
  return false;
}
