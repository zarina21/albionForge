import type { Metadata } from "next";
import Link from "next/link";
import { Leaf, Sword } from "lucide-react";

export const metadata: Metadata = {
  title: "Recolección",
  description: "Recursos, nodos y rutas de recolección en Albion Online. Información sobre madera, fibra, piedra, mineral y cuero.",
  openGraph: {
    title: "Albion Forge — Recolección",
    description: "Recursos y rutas de recolección en Albion Online.",
  },
};

const RESOURCES = [
  { name: "Madera", icon: "T6_WOOD" },
  { name: "Fibra", icon: "T6_FIBER" },
  { name: "Piedra", icon: "T6_ROCK" },
  { name: "Mineral", icon: "T6_ORE" },
  { name: "Cuero", icon: "T6_HIDE" },
];

export default function RecoleccionPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3 mb-6">
        <Leaf className="w-7 h-7 text-gold" />
        <h2 className="font-display text-3xl text-gold">Recursos</h2>
      </div>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Próximamente: precios en tiempo real de todos los recursos brutos y refinados, junto con
        mapas de biomas y rendimiento por tier.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {RESOURCES.map((r) => (
          <Link
            key={r.name}
            href="/"
            className="bg-card border border-border hover:border-gold/40 rounded-xl p-4 flex flex-col items-center gap-2 transition"
          >
            <img
              src={`https://render.albiononline.com/v1/item/${r.icon}.png?quality=1&size=128`}
              alt={r.name}
              className="w-16 h-16"
            />
            <span className="font-display text-gold text-sm">{r.name}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
