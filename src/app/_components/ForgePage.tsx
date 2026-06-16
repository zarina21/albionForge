"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Search,
  Hammer,
  Sparkles,
  Loader2,
  MapPin,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  CITIES,
  type ServerRegion,
  type AlbionItem,
  type PriceRow,
  type HistorySeries,
} from "@/lib/albion-api";

const REGIONS: { id: ServerRegion; label: string }[] = [
  { id: "west", label: "Americas" },
  { id: "europe", label: "Europe" },
  { id: "east", label: "Asia" },
];

const TIER_LABELS = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

function parseTier(uid: string): { tier: number; enchant: number } {
  const m = uid.match(/^T(\d)/);
  const e = uid.match(/@(\d)/);
  return { tier: m ? Number(m[1]) : 0, enchant: e ? Number(e[1]) : 0 };
}

function itemIconUrl(uid: string) {
  return `https://render.albiononline.com/v1/item/${encodeURIComponent(uid)}.png?quality=1&size=128`;
}

function getName(it: AlbionItem) {
  return it.LocalizedNames?.["EN-US"] || it.LocalizedNames?.["ES-ES"] || it.UniqueName;
}

function formatSilver(n: number) {
  if (!n) return "—";
  return n.toLocaleString("en-US");
}

const QUICK_PICKS: { uid: string; label: string }[] = [
  { uid: "T4_BAG", label: "Bag T4" },
  { uid: "T6_2H_NATURESTAFF_KEEPER", label: "Wild Staff T6" },
  { uid: "T5_MAIN_SWORD", label: "Sword T5" },
  { uid: "T4_POTION_HEAL", label: "Heal Potion T4" },
  { uid: "T6_MEAL_OMELETTE", label: "Omelette T6" },
  { uid: "T8_MOUNT_HORSE", label: "Horse T8" },
];

const QUALITIES = [
  { id: 1, label: "Normal" },
  { id: 2, label: "Good" },
  { id: 3, label: "Outstanding" },
  { id: 4, label: "Excellent" },
  { id: 5, label: "Masterpiece" },
];

export function ForgePage() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [region, setRegion] = useState<ServerRegion>("west");
  const [selected, setSelected] = useState<AlbionItem | null>(null);
  const [quality, setQuality] = useState<number>(1);

  const searchQ = useQuery({
    queryKey: ["search", debounced],
    queryFn: () =>
      fetch(`/api/items/search?q=${encodeURIComponent(debounced)}`).then((r) => r.json()),
    enabled: debounced.length >= 2,
    staleTime: 60_000,
  });

  const pricesQ = useQuery({
    queryKey: ["prices", selected?.UniqueName, region],
    queryFn: () =>
      fetch(
        `/api/prices?itemId=${encodeURIComponent(selected!.UniqueName)}&region=${region}&qualities=1,2,3,4,5`,
      ).then((r) => r.json()),
    enabled: !!selected,
    refetchInterval: 60_000,
  });

  const historyQ = useQuery({
    queryKey: ["history", selected?.UniqueName, region, quality],
    queryFn: () =>
      fetch(
        `/api/history?itemId=${encodeURIComponent(selected!.UniqueName)}&region=${region}&timeScale=24&quality=${quality}`,
      ).then((r) => r.json()),
    enabled: !!selected,
  });

  const goldQ = useQuery({
    queryKey: ["gold", region],
    queryFn: () => fetch(`/api/gold?region=${region}&count=48`).then((r) => r.json()),
    refetchInterval: 5 * 60_000,
  });

  const chartData = useMemo(() => {
    const series: HistorySeries[] = historyQ.data?.series ?? [];
    if (!series.length) return [];
    const byTs = new Map<string, Record<string, number | string>>();
    for (const s of series) {
      for (const p of s.data) {
        const key = p.timestamp.slice(0, 10);
        const row = byTs.get(key) ?? { date: key };
        row[s.location] = p.avg_price;
        byTs.set(key, row);
      }
    }
    return Array.from(byTs.values()).sort((a, b) =>
      String(a.date).localeCompare(String(b.date)),
    );
  }, [historyQ.data]);

  const goldTrend = useMemo(() => {
    const pts = goldQ.data?.points ?? [];
    if (pts.length < 2) return 0;
    return pts[pts.length - 1].price - pts[0].price;
  }, [goldQ.data]);

  function handleSelect(it: AlbionItem) {
    setSelected(it);
    setQuery("");
  }

  return (
    <div className="min-h-screen text-foreground">
      <div className="ml-auto flex items-center gap-2 px-4 sm:px-6 py-3 max-w-7xl mx-auto justify-end">
        <div className="flex items-center gap-1 bg-card border border-border rounded-md p-1">
          {REGIONS.map((r) => (
            <button
              key={r.id}
              onClick={() => setRegion(r.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition ${
                region === r.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <GoldBadge price={goldQ.data?.points?.at(-1)?.price} trend={goldTrend} />
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="font-display text-4xl sm:text-5xl text-gold mb-3">
            Forge Your Perfect Build
          </h1>
          <p className="text-muted-foreground">
            Search any Albion item, check live prices across all cities and track
            market history.
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              const t = setTimeout(() => setDebounced(e.target.value.trim()), 300);
              return () => clearTimeout(t);
            }}
            placeholder="Search item: 'Bag', 'Sword', 'T5_MAIN_SWORD'..."
            className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-base placeholder:text-muted-foreground/70"
          />
          {searchQ.isFetching && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-spin" />
          )}
        </div>

        {debounced.length >= 2 && searchQ.data && (
          <div className="max-w-2xl mx-auto mt-3 bg-card border border-border rounded-xl overflow-hidden shadow-xl shadow-black/40 max-h-96 overflow-y-auto">
            {searchQ.data.items.length === 0 && (
              <div className="p-6 text-center text-muted-foreground text-sm">
                No results for &quot;{debounced}&quot;
              </div>
            )}
            {searchQ.data.items.map((it: AlbionItem) => {
              const { tier, enchant } = parseTier(it.UniqueName);
              return (
                <button
                  key={it.UniqueName}
                  onClick={() => handleSelect(it)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent/50 text-left transition border-b border-border/40 last:border-0"
                >
                  <img
                    src={itemIconUrl(it.UniqueName)}
                    alt=""
                    className="w-10 h-10 rounded bg-muted/40"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{getName(it)}</div>
                    <div className="text-xs text-muted-foreground truncate">{it.UniqueName}</div>
                  </div>
                  {tier > 0 && (
                    <span className="text-xs font-display text-gold border border-gold/40 rounded px-2 py-0.5">
                      {TIER_LABELS[tier]}
                      {enchant > 0 && `.${enchant}`}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 space-y-8">
        {!selected ? (
          <EmptyState onPick={(it: AlbionItem) => handleSelect(it)} />
        ) : (
          <>
            <ItemHeader item={selected} />
            <TierSelector item={selected} onSelect={(it: AlbionItem) => setSelected(it)} />
            <EnchantSelector item={selected} onSelect={(it: AlbionItem) => setSelected(it)} />
            <QualitySelector value={quality} onChange={setQuality} />
            <MarketGrid
              loading={pricesQ.isLoading}
              rows={pricesQ.data?.rows ?? []}
              quality={quality}
            />
            <HistoryChart loading={historyQ.isLoading} data={chartData} />
            <CraftRecipe item={selected} />
            <RelatedItems item={selected} onSelect={(it: AlbionItem) => setSelected(it)} />
          </>
        )}
      </main>
    </div>
  );
}

function GoldBadge({ price, trend }: { price?: number; trend: number }) {
  return (
    <div className="flex items-center gap-2 bg-card border border-border rounded-md px-3 py-1.5">
      <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      <div className="text-xs leading-tight">
        <div className="text-muted-foreground">Gold</div>
        <div className="font-semibold tabular-nums">
          {price ? formatSilver(price) : "..."}
          {trend !== 0 && (
            <span className={`ml-1 text-[10px] ${trend > 0 ? "text-emerald-400" : "text-destructive"}`}>
              {trend > 0 ? "▲" : "▼"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (i: AlbionItem) => void }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2 bg-card border border-border rounded-xl p-8">
        <Hammer className="w-8 h-8 text-gold mb-4" />
        <h3 className="font-display text-2xl text-gold mb-2">Start Your Analysis</h3>
        <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
          Search for an item above or pick one of the most popular. You&apos;ll see
          real-time prices across 8 cities, historical trends and crafting
          ingredients.
        </p>
        <div className="flex flex-wrap gap-2">
          {QUICK_PICKS.map((q) => (
            <button
              key={q.uid}
              onClick={() =>
                onPick({
                  UniqueName: q.uid,
                  LocalizedNames: { "ES-ES": q.label, "EN-US": q.label },
                })
              }
              className="flex items-center gap-2 px-3 py-2 bg-accent/40 hover:bg-accent border border-border rounded-lg text-sm transition"
            >
              <img src={itemIconUrl(q.uid)} alt="" className="w-7 h-7" />
              {q.label}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-gradient-to-br from-accent/60 to-card border border-border rounded-xl p-6">
        <Sparkles className="w-6 h-6 text-gold mb-3" />
        <h4 className="font-display text-lg text-gold mb-2">Forge Tip</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Always compare the price in <span className="text-gold">Caerleon</span>{" "}
          with your home city — the travel risk is usually worth a 15-30% margin.
        </p>
      </div>
    </div>
  );
}

function ItemHeader({ item }: { item: AlbionItem }) {
  const { tier, enchant } = parseTier(item.UniqueName);
  return (
    <div className="flex items-center gap-5 bg-card border border-border rounded-xl p-5">
      <img
        src={itemIconUrl(item.UniqueName)}
        alt=""
        className="w-20 h-20 rounded-lg bg-muted/40 border border-border"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-display text-2xl text-gold truncate">{getName(item)}</h3>
        <p className="text-sm text-muted-foreground truncate">{item.UniqueName}</p>
      </div>
      {tier > 0 && (
        <div className="text-right">
          <div className="font-display text-3xl text-gold">{TIER_LABELS[tier]}</div>
          {enchant > 0 && <div className="text-xs text-ember">Enchantment .{enchant}</div>}
        </div>
      )}
    </div>
  );
}

function TierSelector({
  item,
  onSelect,
}: {
  item: AlbionItem;
  onSelect: (i: AlbionItem) => void;
}) {
  const { tier, enchant } = parseTier(item.UniqueName);
  if (tier === 0) return null;
  const base = item.UniqueName.replace(/^T\d/, "").replace(/@\d/, "");
  const enchantSuffix = enchant > 0 ? `@${enchant}` : "";
  const tiers = [1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Change Tier</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {tiers.map((t) => {
          const uid = `T${t}${base}${enchantSuffix}`;
          const active = t === tier;
          return (
            <button
              key={t}
              onClick={() => onSelect({ UniqueName: uid, LocalizedNames: item.LocalizedNames })}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition ${
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border hover:border-gold/40 text-foreground"
              }`}
            >
              <img src={itemIconUrl(uid)} alt="" className="w-8 h-8" />
              <span className="font-display text-gold">{TIER_LABELS[t]}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

const ENCHANT_LABELS = ["Base", ".1", ".2", ".3", ".4"];

function EnchantSelector({
  item,
  onSelect,
}: {
  item: AlbionItem;
  onSelect: (i: AlbionItem) => void;
}) {
  const { tier, enchant } = parseTier(item.UniqueName);
  if (tier === 0) return null;
  const base = item.UniqueName.replace(/^T\d/, "").replace(/@\d/, "");
  const enchants = [0, 1, 2, 3, 4];
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Enchantment</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {enchants.map((e) => {
          const uid = `T${tier}${base}${e > 0 ? `@${e}` : ""}`;
          const active = e === enchant;
          return (
            <button
              key={e}
              onClick={() => onSelect({ UniqueName: uid, LocalizedNames: item.LocalizedNames })}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition ${
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border hover:border-gold/40 text-foreground"
              }`}
            >
              <img src={itemIconUrl(uid)} alt="" className="w-8 h-8" />
              <span className="font-display text-ember">{ENCHANT_LABELS[e]}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function QualitySelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (q: number) => void;
}) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Quality</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {QUALITIES.map((q) => {
          const active = q.id === value;
          return (
            <button
              key={q.id}
              onClick={() => onChange(q.id)}
              className={`px-3 py-2 rounded-lg border text-sm transition ${
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border hover:border-gold/40 text-foreground"
              }`}
            >
              <span className="font-display text-gold mr-2">{q.id}</span>
              {q.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function timeAgo(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso + (iso.endsWith("Z") ? "" : "Z")).getTime();
  if (Number.isNaN(d)) return "—";
  const diff = Date.now() - d;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

function MarketGrid({
  loading,
  rows,
  quality,
}: {
  loading: boolean;
  rows: PriceRow[];
  quality: number;
}) {
  const filtered = rows.filter((r) => r.quality === quality);
  const byCity = new Map<string, PriceRow>();
  for (const r of filtered) {
    byCity.set(r.city, r);
  }
  const orders = CITIES.map((city) => byCity.get(city)).filter(
    (r): r is NonNullable<typeof r> => !!r,
  );
  const sellPrices = orders.map((r) => r.sell_price_min).filter((n) => n > 0);
  const buyPrices = orders.map((r) => r.buy_price_max).filter((n) => n > 0);
  const bestSell = sellPrices.length ? Math.min(...sellPrices) : 0;
  const bestBuy = buyPrices.length ? Math.max(...buyPrices) : 0;

  return (
    <section>
      <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-gold" />
          <h3 className="font-display text-xl text-gold">Auction House</h3>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400/80" />
            <span className="text-muted-foreground">Best Sell</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-primary/80" />
            <span className="text-muted-foreground">Best Buy</span>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="grid grid-cols-[1.6fr_1fr_1fr_0.7fr] sm:grid-cols-[2fr_1.2fr_1.2fr_0.8fr] items-center gap-2 px-4 py-2.5 bg-gradient-to-b from-accent/70 to-accent/30 border-b border-gold/20 text-[10px] sm:text-xs uppercase tracking-wider text-gold/80 font-display">
          <span>Location</span>
          <span className="text-right">Sell Order</span>
          <span className="text-right">Buy Order</span>
          <span className="text-right">Updated</span>
        </div>

        {loading ? (
          <div className="py-12 flex items-center justify-center text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm">
            No market orders for this quality.
          </div>
        ) : (
          CITIES.map((city, i) => {
            const r = byCity.get(city);
            const isBM = city === "Black Market";
            const sell = r?.sell_price_min ?? 0;
            const buy = r?.buy_price_max ?? 0;
            const isBestSell = sell > 0 && sell === bestSell;
            const isBestBuy = buy > 0 && buy === bestBuy;
            return (
              <div
                key={city}
                className={`grid grid-cols-[1.6fr_1fr_1fr_0.7fr] sm:grid-cols-[2fr_1.2fr_1.2fr_0.8fr] items-center gap-2 px-4 py-3 border-b border-border/40 last:border-0 transition hover:bg-accent/30 ${
                  i % 2 ? "bg-background/20" : ""
                } ${isBM ? "bg-gradient-to-r from-ember/10 to-transparent" : ""}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-1.5 h-8 rounded-full shrink-0 ${isBM ? "bg-ember" : "bg-gold/40"}`} />
                  <span className={`text-sm font-medium truncate ${isBM ? "text-ember" : "text-foreground"}`}>
                    {city}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`tabular-nums font-semibold ${isBestSell ? "text-emerald-400" : sell > 0 ? "text-gold" : "text-muted-foreground/50"}`}>
                    {formatSilver(sell)}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`tabular-nums ${isBestBuy ? "text-primary font-semibold" : buy > 0 ? "text-foreground/80" : "text-muted-foreground/50"}`}>
                    {formatSilver(buy)}
                  </span>
                </div>
                <div className="text-right text-xs text-muted-foreground tabular-nums">
                  {timeAgo(r?.sell_price_min_date)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--ember)",
];

function HistoryChart({
  loading,
  data,
}: {
  loading: boolean;
  data: Record<string, number | string>[];
}) {
  const cities = useMemo(() => {
    const set = new Set<string>();
    for (const row of data) {
      for (const k of Object.keys(row)) if (k !== "date") set.add(k);
    }
    return Array.from(set);
  }, [data]);

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-gold" />
        <h3 className="font-display text-xl text-gold">Price History (Daily)</h3>
      </div>
      <div className="bg-card border border-border rounded-xl p-4 h-80">
        {loading ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            No historical data for this item.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.02 60)" />
              <XAxis dataKey="date" stroke="oklch(0.68 0.025 75)" fontSize={11} />
              <YAxis
                stroke="oklch(0.68 0.025 75)"
                fontSize={11}
                tickFormatter={(v: number) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.21 0.015 60)",
                  border: "1px solid oklch(0.3 0.02 60)",
                  borderRadius: 8,
                }}
                labelStyle={{ color: "oklch(0.82 0.16 82)" }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {cities.map((c, i) => (
                <Line
                  key={c}
                  type="monotone"
                  dataKey={c}
                  stroke={CHART_COLORS[i % CHART_COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}

function CraftRecipe({ item }: { item: AlbionItem }) {
  const { tier } = parseTier(item.UniqueName);
  if (tier === 0) return null;
  const base = item.UniqueName.replace(/@\d/, "");
  const ingredients: { uid: string; label: string; qty: number }[] = [];
  if (/SWORD|AXE|MACE|HAMMER|CROSSBOW|DAGGER|SPEAR/.test(base)) {
    ingredients.push({ uid: `T${tier}_METALBAR`, label: "Metal Bar", qty: 16 });
    ingredients.push({ uid: `T${tier}_PLANKS`, label: "Planks", qty: 8 });
  } else if (/BOW|STAFF/.test(base)) {
    ingredients.push({ uid: `T${tier}_PLANKS`, label: "Planks", qty: 16 });
    ingredients.push({ uid: `T${tier}_LEATHER`, label: "Leather", qty: 8 });
  } else if (/ARMOR|HELMET|SHOES|HEAD|HOOD/.test(base)) {
    ingredients.push({ uid: `T${tier}_CLOTH`, label: "Cloth", qty: 12 });
    ingredients.push({ uid: `T${tier}_LEATHER`, label: "Leather", qty: 8 });
  } else if (/BAG/.test(base)) {
    ingredients.push({ uid: `T${tier}_LEATHER`, label: "Leather", qty: 8 });
    ingredients.push({ uid: `T${tier}_CLOTH`, label: "Cloth", qty: 8 });
  } else {
    return null;
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Hammer className="w-5 h-5 text-gold" />
        <h3 className="font-display text-xl text-gold">Estimated Recipe</h3>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {ingredients.map((ing) => (
          <div key={ing.uid} className="flex items-center gap-3 bg-card border border-border rounded-xl p-4">
            <img src={itemIconUrl(ing.uid)} alt="" className="w-12 h-12 bg-muted/40 rounded" />
            <div className="flex-1">
              <div className="font-medium">{ing.label}</div>
              <div className="text-xs text-muted-foreground">{ing.uid}</div>
            </div>
            <div className="font-display text-2xl text-gold">×{ing.qty}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Base quantities without focus/station bonus. Adjust based on your crafting city returns.
      </p>
    </section>
  );
}

function RelatedItems({
  item,
  onSelect,
}: {
  item: AlbionItem;
  onSelect: (i: AlbionItem) => void;
}) {
  const { tier } = parseTier(item.UniqueName);
  const base = item.UniqueName.replace(/^T\d_/, "").replace(/@\d/, "");
  const tokens = base.split("_").filter((t) => t.length > 2);
  const keyword = tokens[tokens.length - 1] ?? base;

  const relQ = useQuery({
    queryKey: ["related", keyword],
    queryFn: () => fetch(`/api/items/search?q=${encodeURIComponent(keyword)}&limit=60`).then((r) => r.json()),
    enabled: tier > 0 && keyword.length >= 2,
    staleTime: 5 * 60_000,
  });

  const items = useMemo(() => {
    const list: AlbionItem[] = relQ.data?.items ?? [];
    const seen = new Set<string>();
    return list
      .filter((it) => {
        if (it.UniqueName === item.UniqueName) return false;
        const { tier: t, enchant: e } = parseTier(it.UniqueName);
        if (t !== tier || e !== 0) return false;
        const key = it.UniqueName.replace(/^T\d_/, "").replace(/@\d/, "");
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 12);
  }, [relQ.data, item.UniqueName, tier]);

  if (tier === 0) return null;
  if (!relQ.isLoading && items.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-gold" />
        <h3 className="font-display text-xl text-gold">Related Items</h3>
      </div>
      {relQ.isLoading ? (
        <div className="bg-card border border-border rounded-xl p-6 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((it) => (
            <button
              key={it.UniqueName}
              onClick={() => onSelect(it)}
              className="flex items-center gap-3 bg-card border border-border hover:border-gold/40 rounded-xl p-3 text-left transition"
            >
              <img src={itemIconUrl(it.UniqueName)} alt="" className="w-12 h-12 rounded bg-muted/40 flex-shrink-0" loading="lazy" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{getName(it)}</div>
                <div className="text-[10px] text-muted-foreground truncate">{it.UniqueName}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
