export function calculateDataAge(isoDate: string | undefined | null): number {
  if (!isoDate) return Infinity;
  const d = new Date(isoDate + (isoDate.endsWith("Z") ? "" : "Z")).getTime();
  if (Number.isNaN(d)) return Infinity;
  return Math.floor((Date.now() - d) / 60000);
}

export function getFreshnessStatus(minutes: number): "fresh" | "acceptable" | "old" | "very_old" {
  if (minutes < 30) return "fresh";
  if (minutes < 120) return "acceptable";
  if (minutes < 720) return "old";
  return "very_old";
}

export function getFreshnessColor(status: string): string {
  switch (status) {
    case "fresh": return "text-emerald-400";
    case "acceptable": return "text-yellow-400";
    case "old": return "text-orange-400";
    case "very_old": return "text-red-400";
    default: return "text-muted-foreground";
  }
}

export function formatSilver(value: number | null | undefined): string {
  if (!value || value === 0) return "—";
  return value.toLocaleString("en-US");
}

export function calculateMarketSpread(buyPrice: number, sellPrice: number): number {
  if (!buyPrice || !sellPrice) return 0;
  return sellPrice - buyPrice;
}

export function calculateEstimatedProfit(
  buyPrice: number,
  sellPrice: number,
  taxRate = 0.06,
): number {
  if (!buyPrice || !sellPrice) return 0;
  const revenue = sellPrice * (1 - taxRate);
  return revenue - buyPrice;
}

export function parseItemTier(uniqueName: string): number {
  const m = uniqueName.match(/^T(\d)/);
  return m ? Number(m[1]) : 0;
}

export function parseItemEnchantment(uniqueName: string): number {
  const m = uniqueName.match(/@(\d)/);
  return m ? Number(m[1]) : 0;
}

export function getItemIconUrl(uid: string, quality = 1): string {
  return `https://render.albiononline.com/v1/item/${encodeURIComponent(uid)}.png?quality=${quality}&size=128`;
}

export function formatTimeAgo(iso?: string): string {
  const mins = calculateDataAge(iso);
  if (mins === Infinity) return "—";
  if (mins < 1) return "ahora";
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}
