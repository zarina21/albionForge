"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Coins } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { ServerRegion } from "@/lib/albion-api";

const REGIONS: { id: ServerRegion; label: string }[] = [
  { id: "west", label: "Americas" },
  { id: "europe", label: "Europe" },
  { id: "east", label: "Asia" },
];

export function GoldPage() {
  const [region, setRegion] = useState<ServerRegion>("west");
  const goldQ = useQuery({
    queryKey: ["gold-page", region],
    queryFn: () => fetch(`/api/gold?region=${region}&count=200`).then((r) => r.json()),
    refetchInterval: 5 * 60_000,
  });

  const data =
    goldQ.data?.points?.map((p: { timestamp: string; price: number }) => ({
      date: p.timestamp.slice(5, 16).replace("T", " "),
      price: p.price,
    })) ?? [];
  const latest = goldQ.data?.points?.at(-1)?.price;

  return (
    <div className="min-h-screen text-foreground">
      <div className="ml-auto flex items-center gap-1 bg-card border border-border rounded-md p-1 max-w-7xl mx-auto px-4 sm:px-6 py-3 justify-end">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center">
            <Coins className="w-7 h-7 text-gold" />
          </div>
          <div>
            <h2 className="font-display text-3xl text-gold">Precio del Oro</h2>
            <p className="text-sm text-muted-foreground">
              Última cotización:{" "}
              <span className="text-gold font-semibold tabular-nums">
                {latest ? latest.toLocaleString() : "..."}
              </span>{" "}
              silver
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 h-[480px]">
          {goldQ.isLoading ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Cargando datos…
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.02 60)" />
                <XAxis dataKey="date" stroke="oklch(0.68 0.025 75)" fontSize={11} />
                <YAxis stroke="oklch(0.68 0.025 75)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.21 0.015 60)",
                    border: "1px solid oklch(0.3 0.02 60)",
                    borderRadius: 8,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="var(--gold)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </main>
    </div>
  );
}
