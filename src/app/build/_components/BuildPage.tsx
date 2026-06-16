"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Shield, Sword, Swords, Skull, Flame, Crown, Users, Trees, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { AlbionItem } from "@/lib/albion-api";

type Role = "tank" | "healer" | "dps_melee" | "dps_ranged" | "support";
type Content =
  | "solo_pve"
  | "group_pve"
  | "solo_pvp"
  | "small_scale"
  | "zvz"
  | "ganking"
  | "avalonian";

const CONTENTS: { id: Content; label: string; icon: typeof Sword }[] = [
  { id: "solo_pve", label: "Solo PvE", icon: Trees },
  { id: "group_pve", label: "Group PvE", icon: Users },
  { id: "avalonian", label: "Avalonian Dungeon", icon: Crown },
  { id: "solo_pvp", label: "Solo PvP", icon: Swords },
  { id: "small_scale", label: "Small Scale", icon: Sword },
  { id: "zvz", label: "ZvZ", icon: Flame },
  { id: "ganking", label: "Ganking", icon: Skull },
];

const ROLES: { id: Role; label: string; icon: typeof Shield }[] = [
  { id: "tank", label: "Tank", icon: Shield },
  { id: "healer", label: "Healer", icon: Crown },
  { id: "dps_melee", label: "DPS Melee", icon: Sword },
  { id: "dps_ranged", label: "DPS Ranged", icon: Swords },
  { id: "support", label: "Support", icon: Flame },
];

interface BuildSlot {
  uid: string;
  label: string;
}

interface PopularBuild {
  id: string;
  name: string;
  description: string;
  weapon: BuildSlot;
  head: BuildSlot;
  chest: BuildSlot;
  shoes: BuildSlot;
  cape?: BuildSlot;
}

const BUILDS: Record<Content, Partial<Record<Role, PopularBuild[]>>> = {
  solo_pve: {
    dps_melee: [
      {
        id: "1h-dagger-solo",
        name: "Daga Claymore",
        description: "Limpieza rápida de mobs en mazmorras solitarias gracias al daño en área.",
        weapon: { uid: "T8_2H_DAGGERPAIR", label: "Par de Dagas" },
        head: { uid: "T8_HEAD_LEATHER_HELL", label: "Capucha del Demonio" },
        chest: { uid: "T8_ARMOR_LEATHER_MORGANA", label: "Chaqueta Mercenaria" },
        shoes: { uid: "T8_SHOES_LEATHER_HELL", label: "Botas del Demonio" },
        cape: { uid: "T8_CAPEITEM_FW_MARTLOCK", label: "Capa de Martlock" },
      },
    ],
    dps_ranged: [
      {
        id: "fire-staff-solo",
        name: "Báculo de Fuego",
        description: "DPS sostenido a distancia con buen control y daño en área.",
        weapon: { uid: "T8_2H_FIRESTAFF", label: "Báculo de Fuego" },
        head: { uid: "T8_HEAD_CLOTH_HELL", label: "Capucha del Demonio" },
        chest: { uid: "T8_ARMOR_CLOTH_HELL", label: "Túnica del Demonio" },
        shoes: { uid: "T8_SHOES_LEATHER_MORGANA", label: "Botas Mercenarias" },
      },
    ],
    healer: [
      {
        id: "nature-solo",
        name: "Báculo Natural",
        description: "Sostén infinito para farmeo prolongado y mazmorras T8.",
        weapon: { uid: "T8_2H_NATURESTAFF_KEEPER", label: "Báculo Salvaje" },
        head: { uid: "T8_HEAD_CLOTH_SET1", label: "Sombrero de Estudioso" },
        chest: { uid: "T8_ARMOR_CLOTH_SET1", label: "Túnica de Estudioso" },
        shoes: { uid: "T8_SHOES_LEATHER_SET1", label: "Botas de Mercenario" },
      },
    ],
  },
  group_pve: {
    tank: [
      {
        id: "1h-mace-group",
        name: "Maza con Escudo",
        description: "Control de mobs con stuns múltiples y mitigación constante.",
        weapon: { uid: "T8_MAIN_MACE_KEEPER", label: "Maza Salvaje" },
        head: { uid: "T8_HEAD_PLATE_SET3", label: "Yelmo del Caballero Real" },
        chest: { uid: "T8_ARMOR_PLATE_KEEPER", label: "Armadura del Guarda" },
        shoes: { uid: "T8_SHOES_PLATE_SET3", label: "Sabatones Reales" },
      },
    ],
    healer: [
      {
        id: "holy-group",
        name: "Báculo Sagrado",
        description: "Curas burst para grupos en mazmorras élite.",
        weapon: { uid: "T8_2H_HOLYSTAFF_HELL", label: "Báculo Caído" },
        head: { uid: "T8_HEAD_CLOTH_SET1", label: "Sombrero de Estudioso" },
        chest: { uid: "T8_ARMOR_CLOTH_SET1", label: "Túnica de Estudioso" },
        shoes: { uid: "T8_SHOES_CLOTH_SET1", label: "Sandalias de Estudioso" },
      },
    ],
    dps_ranged: [
      {
        id: "cursed-group",
        name: "Báculo Maldito",
        description: "DPS sostenido con daño verdadero ideal para jefes.",
        weapon: { uid: "T8_2H_CURSEDSTAFF_MORGANA", label: "Báculo Demoníaco" },
        head: { uid: "T8_HEAD_CLOTH_HELL", label: "Capucha del Demonio" },
        chest: { uid: "T8_ARMOR_CLOTH_HELL", label: "Túnica del Demonio" },
        shoes: { uid: "T8_SHOES_LEATHER_MORGANA", label: "Botas Mercenarias" },
      },
    ],
  },
  avalonian: {
    tank: [
      {
        id: "incubus-ava",
        name: "Maza Íncubo",
        description: "Tankeo de bosses avalonianos con auto-sustain mediante drenaje.",
        weapon: { uid: "T8_2H_MACE_AVALON", label: "Maza Avaloniana" },
        head: { uid: "T8_HEAD_PLATE_AVALON", label: "Yelmo Avaloniano" },
        chest: { uid: "T8_ARMOR_PLATE_AVALON", label: "Armadura Avaloniana" },
        shoes: { uid: "T8_SHOES_PLATE_AVALON", label: "Sabatones Avalonianos" },
      },
    ],
    dps_melee: [
      {
        id: "carving-ava",
        name: "Sword Talladora",
        description: "Burst masivo en mazmorras avalonianas con W de salto.",
        weapon: { uid: "T8_2H_CLAYMORE_AVALON", label: "Mandoble Avaloniano" },
        head: { uid: "T8_HEAD_LEATHER_HELL", label: "Capucha del Demonio" },
        chest: { uid: "T8_ARMOR_LEATHER_MORGANA", label: "Chaqueta Mercenaria" },
        shoes: { uid: "T8_SHOES_LEATHER_HELL", label: "Botas del Demonio" },
      },
    ],
  },
  solo_pvp: {
    dps_melee: [
      {
        id: "spirit-spear-solo",
        name: "Lanza del Espíritu",
        description: "Movilidad, sangrado y burst para 1v1 en zonas rojas.",
        weapon: { uid: "T8_2H_SPEAR_KEEPER", label: "Lanza Salvaje" },
        head: { uid: "T8_HEAD_LEATHER_HELL", label: "Capucha del Demonio" },
        chest: { uid: "T8_ARMOR_LEATHER_MORGANA", label: "Chaqueta Mercenaria" },
        shoes: { uid: "T8_SHOES_LEATHER_HELL", label: "Botas del Demonio" },
        cape: { uid: "T8_CAPEITEM_KEEPER", label: "Capa del Guarda" },
      },
    ],
    dps_ranged: [
      {
        id: "1h-fire-solo",
        name: "Bastón de Fuego",
        description: "Control y daño en área para 1vX en mazmorras corruptas.",
        weapon: { uid: "T8_MAIN_FIRESTAFF", label: "Bastón de Fuego" },
        head: { uid: "T8_HEAD_CLOTH_HELL", label: "Capucha del Demonio" },
        chest: { uid: "T8_ARMOR_CLOTH_HELL", label: "Túnica del Demonio" },
        shoes: { uid: "T8_SHOES_LEATHER_HELL", label: "Botas del Demonio" },
      },
    ],
  },
  small_scale: {
    tank: [
      {
        id: "1h-hammer-ss",
        name: "Martillo con Escudo",
        description: "Engage y peel para grupos pequeños con stuns en cadena.",
        weapon: { uid: "T8_MAIN_HAMMER_HELL", label: "Martillo Caído" },
        head: { uid: "T8_HEAD_PLATE_HELL", label: "Casco del Demonio" },
        chest: { uid: "T8_ARMOR_PLATE_HELL", label: "Armadura del Demonio" },
        shoes: { uid: "T8_SHOES_PLATE_HELL", label: "Sabatones del Demonio" },
      },
    ],
    healer: [
      {
        id: "great-holy-ss",
        name: "Gran Báculo Sagrado",
        description: "Curas en área masivas para escaramuzas y small scale.",
        weapon: { uid: "T8_2H_HOLYSTAFF_MORGANA", label: "Gran Báculo Sagrado" },
        head: { uid: "T8_HEAD_CLOTH_SET1", label: "Sombrero de Estudioso" },
        chest: { uid: "T8_ARMOR_CLOTH_SET1", label: "Túnica de Estudioso" },
        shoes: { uid: "T8_SHOES_CLOTH_SET1", label: "Sandalias de Estudioso" },
      },
    ],
    dps_ranged: [
      {
        id: "bow-ss",
        name: "Arco Largo",
        description: "Picks rápidos y zoning con flecha múltiple.",
        weapon: { uid: "T8_2H_LONGBOW", label: "Arco Largo" },
        head: { uid: "T8_HEAD_LEATHER_HELL", label: "Capucha del Demonio" },
        chest: { uid: "T8_ARMOR_LEATHER_MORGANA", label: "Chaqueta Mercenaria" },
        shoes: { uid: "T8_SHOES_LEATHER_HELL", label: "Botas del Demonio" },
      },
    ],
  },
  zvz: {
    tank: [
      {
        id: "1h-mace-zvz",
        name: "Maza Pesada",
        description: "Inicio de pelea con Cyclone y stuns para mantener formación.",
        weapon: { uid: "T8_MAIN_MACE_HELL", label: "Maza del Demonio" },
        head: { uid: "T8_HEAD_PLATE_HELL", label: "Casco del Demonio" },
        chest: { uid: "T8_ARMOR_PLATE_HELL", label: "Armadura del Demonio" },
        shoes: { uid: "T8_SHOES_PLATE_HELL", label: "Sabatones del Demonio" },
      },
    ],
    healer: [
      {
        id: "great-nature-zvz",
        name: "Gran Báculo Natural",
        description: "Curas sostenidas con HoT para mantener el frontline en ZvZ.",
        weapon: { uid: "T8_2H_NATURESTAFF_HELL", label: "Gran Báculo Natural" },
        head: { uid: "T8_HEAD_CLOTH_SET1", label: "Sombrero de Estudioso" },
        chest: { uid: "T8_ARMOR_CLOTH_SET1", label: "Túnica de Estudioso" },
        shoes: { uid: "T8_SHOES_CLOTH_SET1", label: "Sandalias de Estudioso" },
      },
    ],
    dps_ranged: [
      {
        id: "permafrost-zvz",
        name: "Permafrost Prism",
        description: "Daño en área y slow masivo, pieza clave en grandes peleas.",
        weapon: { uid: "T8_2H_ICEGAUNTLETS_HELL", label: "Permafrost Prism" },
        head: { uid: "T8_HEAD_CLOTH_HELL", label: "Capucha del Demonio" },
        chest: { uid: "T8_ARMOR_CLOTH_HELL", label: "Túnica del Demonio" },
        shoes: { uid: "T8_SHOES_LEATHER_MORGANA", label: "Botas Mercenarias" },
      },
    ],
    support: [
      {
        id: "locus-zvz",
        name: "Locus Oculto",
        description: "Stuns en área para preparar enganches y wipes enemigos.",
        weapon: { uid: "T8_2H_ARCANESTAFF_HELL", label: "Locus Oculto" },
        head: { uid: "T8_HEAD_CLOTH_HELL", label: "Capucha del Demonio" },
        chest: { uid: "T8_ARMOR_CLOTH_HELL", label: "Túnica del Demonio" },
        shoes: { uid: "T8_SHOES_CLOTH_HELL", label: "Sandalias del Demonio" },
      },
    ],
  },
  ganking: {
    dps_melee: [
      {
        id: "dagger-gank",
        name: "Dagas de Sangre",
        description: "Burst altísimo en pocos segundos para asesinar recolectores.",
        weapon: { uid: "T8_MAIN_DAGGER_HELL", label: "Daga del Demonio" },
        head: { uid: "T8_HEAD_LEATHER_HELL", label: "Capucha del Demonio" },
        chest: { uid: "T8_ARMOR_LEATHER_HELL", label: "Chaqueta del Demonio" },
        shoes: { uid: "T8_SHOES_LEATHER_HELL", label: "Botas del Demonio" },
      },
    ],
    dps_ranged: [
      {
        id: "crossbow-gank",
        name: "Ballesta Pesada",
        description: "Pick rápido a distancia con Auto-Crossbow.",
        weapon: { uid: "T8_2H_CROSSBOWLARGE_MORGANA", label: "Ballestón Demoníaco" },
        head: { uid: "T8_HEAD_LEATHER_HELL", label: "Capucha del Demonio" },
        chest: { uid: "T8_ARMOR_LEATHER_HELL", label: "Chaqueta del Demonio" },
        shoes: { uid: "T8_SHOES_LEATHER_HELL", label: "Botas del Demonio" },
      },
    ],
  },
};

function itemIconUrl(uid: string) {
  return `https://render.albiononline.com/v1/item/${encodeURIComponent(uid)}.png?quality=4&size=128`;
}

export function BuildPage() {
  const [content, setContent] = useState<Content>("solo_pve");
  const [role, setRole] = useState<Role>("dps_melee");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AlbionItem[]>([]);
  const [showSug, setShowSug] = useState(false);
  const [loadingSug, setLoadingSug] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setLoadingSug(false);
      return;
    }
    setLoadingSug(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/items/search?q=${encodeURIComponent(q)}&limit=8&category=equipment`).then((r) => r.json());
        setSuggestions(res.items);
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSug(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setShowSug(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function itemName(it: AlbionItem) {
    return it.LocalizedNames?.["ES-ES"] || it.LocalizedNames?.["EN-US"] || it.UniqueName;
  }

  const builds = useMemo(() => {
    const base = BUILDS[content]?.[role] ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter((b) => {
      const haystack = [
        b.name, b.description,
        b.weapon?.label, b.weapon?.uid,
        b.head?.label, b.head?.uid,
        b.chest?.label, b.chest?.uid,
        b.shoes?.label, b.shoes?.uid,
        b.cape?.label, b.cape?.uid,
      ].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }, [content, role, query]);

  const availableRoles = useMemo(
    () => ROLES.filter((r) => (BUILDS[content]?.[r.id]?.length ?? 0) > 0),
    [content],
  );

  return (
    <div className="min-h-screen text-foreground">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-7 h-7 text-gold" />
            <h2 className="font-display text-3xl text-gold">Builds populares</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Elige el tipo de contenido y tu rol para ver los sets más usados por la
            comunidad. Haz clic en cualquier pieza para abrirla en el buscador.
          </p>
        </div>

        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Contenido</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {CONTENTS.map(({ id, label, icon: Icon }) => {
              const active = id === content;
              return (
                <button
                  key={id}
                  onClick={() => {
                    setContent(id);
                    const next = ROLES.find((r) => (BUILDS[id]?.[r.id]?.length ?? 0) > 0);
                    if (next && !BUILDS[id]?.[role]) setRole(next.id);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition ${
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border hover:border-gold/40 text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Rol</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {ROLES.map(({ id, label, icon: Icon }) => {
              const enabled = (BUILDS[content]?.[id]?.length ?? 0) > 0;
              const active = id === role;
              return (
                <button
                  key={id}
                  onClick={() => enabled && setRole(id)}
                  disabled={!enabled}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition ${
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : enabled
                        ? "bg-card border-border hover:border-gold/40 text-foreground"
                        : "bg-card/40 border-border/40 text-muted-foreground/40 cursor-not-allowed"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
          </div>
          {availableRoles.length > 0 && !BUILDS[content]?.[role] && (
            <p className="text-xs text-muted-foreground mt-2">
              No hay builds para este rol en este contenido. Prueba con otro rol.
            </p>
          )}
        </section>

        <section>
          <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Buscar arma o pieza
          </label>
          <div className="relative max-w-md" ref={boxRef}>
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSug(true);
              }}
              onFocus={() => setShowSug(true)}
              placeholder="Escribe el nombre de un arma o armadura..."
              className="pl-9 pr-9"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setSuggestions([]);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {showSug && query.trim().length >= 2 && (
              <div className="absolute z-20 mt-1 w-full bg-popover border border-border rounded-lg shadow-xl overflow-hidden">
                {loadingSug ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">Buscando…</div>
                ) : suggestions.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">Sin resultados</div>
                ) : (
                  <ul className="max-h-72 overflow-y-auto">
                    {suggestions.map((it) => (
                      <li key={it.UniqueName}>
                        <button
                          onClick={() => {
                            const name = itemName(it);
                            setQuery(name);
                            setShowSug(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-accent/60 transition"
                        >
                          <img
                            src={`https://render.albiononline.com/v1/item/${encodeURIComponent(it.UniqueName)}.png?size=48`}
                            alt=""
                            className="w-8 h-8 rounded"
                            loading="lazy"
                          />
                          <div className="min-w-0">
                            <div className="text-sm text-foreground truncate">{itemName(it)}</div>
                            <div className="text-xs text-muted-foreground truncate">{it.UniqueName}</div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="space-y-4">
          {builds.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-10 text-center text-muted-foreground">
              {query
                ? `No hay builds que coincidan con "${query}".`
                : "Aún no hay builds catalogadas para esta combinación."}
            </div>
          ) : (
            builds.map((b) => <BuildCard key={b.id} build={b} />)
          )}
        </section>
      </main>
    </div>
  );
}

function BuildCard({ build }: { build: PopularBuild }) {
  const slots: { key: string; slot: BuildSlot | undefined; label: string }[] = [
    { key: "weapon", slot: build.weapon, label: "Arma" },
    { key: "head", slot: build.head, label: "Cabeza" },
    { key: "chest", slot: build.chest, label: "Pecho" },
    { key: "shoes", slot: build.shoes, label: "Botas" },
    { key: "cape", slot: build.cape, label: "Capa" },
  ];

  return (
    <article className="bg-card border border-border rounded-xl p-5">
      <header className="mb-4">
        <h3 className="font-display text-2xl text-gold">{build.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{build.description}</p>
      </header>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {slots.filter((s) => s.slot).map(({ key, slot, label }) => (
          <Link
            key={key}
            href="/"
            className="flex flex-col items-center gap-2 bg-background/40 border border-border/60 hover:border-gold/40 rounded-lg p-3 transition"
          >
            <img src={itemIconUrl(slot!.uid)} alt={slot!.label} className="w-16 h-16" loading="lazy" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
            <span className="text-xs text-center text-foreground font-medium leading-tight">{slot!.label}</span>
          </Link>
        ))}
      </div>
    </article>
  );
}
