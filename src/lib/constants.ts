export const CATEGORIES = [
  "Weapons",
  "Off-hands",
  "Head Armor",
  "Chest Armor",
  "Shoes",
  "Capes",
  "Bags",
  "Mounts",
  "Tools",
  "Resources",
  "Refined Resources",
  "Food",
  "Potions",
  "Artifacts",
  "Farmables",
  "Animal Products",
  "Journals",
  "Luxury Goods",
  "Furniture",
] as const;

export const TIERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
export const ENCHANTMENTS = [0, 1, 2, 3, 4] as const;
export const QUALITIES = [
  { id: 1, label: "Normal" },
  { id: 2, label: "Good" },
  { id: 3, label: "Outstanding" },
  { id: 4, label: "Excellent" },
  { id: 5, label: "Masterpiece" },
] as const;

export const CONTENT_TYPES = [
  { id: "solo_open_world", label: "Solo Open World" },
  { id: "solo_dungeons", label: "Solo Dungeons" },
  { id: "corrupted_dungeons", label: "Corrupted Dungeons" },
  { id: "solo_mists", label: "Solo Mists" },
  { id: "knightfall_abbey", label: "Knightfall Abbey" },
  { id: "solo_tracking", label: "Solo Tracking" },
  { id: "solo_gathering", label: "Solo Gathering" },
  { id: "solo_ganking", label: "Solo Ganking" },
  { id: "solo_roads", label: "Solo Roads of Avalon" },
  { id: "duo_mists", label: "Duo Mists" },
  { id: "hellgate_2v2", label: "2v2 Hellgates" },
  { id: "abyssal_2v2", label: "Abyssal Depths 2v2" },
  { id: "abyssal_3v3", label: "Abyssal Depths 3v3" },
  { id: "small_scale", label: "Small Scale" },
  { id: "group_dungeons", label: "Group Dungeons" },
  { id: "static_dungeons", label: "Static Dungeons" },
  { id: "avalonian_dungeons", label: "Avalonian Dungeons" },
  { id: "world_bosses", label: "World Bosses" },
  { id: "arena", label: "Arena" },
  { id: "crystal_arena_5v5", label: "Crystal Arena 5v5" },
  { id: "crystal_league_5v5", label: "Crystal League 5v5" },
  { id: "crystal_league_20v20", label: "Crystal League 20v20" },
  { id: "hellgate_5v5", label: "Hellgates 5v5" },
  { id: "hellgate_10v10", label: "Hellgates 10v10" },
  { id: "faction_warfare", label: "Faction Warfare" },
  { id: "bandit_assault", label: "Bandit Assault" },
  { id: "outposts", label: "Outposts" },
  { id: "castles", label: "Castles" },
  { id: "territory_fights", label: "Territory Fights" },
  { id: "zvz", label: "ZvZ" },
  { id: "bomb_squad", label: "Bomb Squad" },
  { id: "transport_ganking", label: "Transport Ganking" },
  { id: "roads_pvp", label: "Roads PvP" },
] as const;

export const ROLES = [
  "Tank", "Healer", "Melee DPS", "Ranged DPS", "Support",
  "Bruiser", "Assassin", "Kite DPS", "Brawler",
  "Engage Tank", "Defensive Tank", "Peeler",
  "Shotcaller", "Bomb Squad", "Ganker", "Scout",
  "Transporter", "Gatherer", "Crafter", "Refiner", "Farmer",
  "Sustain DPS", "One-shot", "Mobility build", "Rat",
  "Clap DPS", "Backline diver", "Escape gatherer",
] as const;

export const WEAPON_LINES = [
  "Sword", "Axe", "Mace", "Hammer", "Spear", "Dagger",
  "Bow", "Crossbow", "Quarterstaff", "War Gloves",
  "Fire Staff", "Frost Staff", "Arcane Staff",
  "Holy Staff", "Nature Staff", "Cursed Staff", "Shapeshifter Staff",
] as const;

export const BIOMES = [
  { id: "forest", label: "Forest", city: "Lymhurst", primary: "Wood", secondary: "Hide", tertiary: "Stone" },
  { id: "highland", label: "Highland", city: "Martlock", primary: "Stone", secondary: "Ore", tertiary: "Wood" },
  { id: "mountain", label: "Mountain", city: "Fort Sterling", primary: "Ore", secondary: "Stone", tertiary: "Fiber" },
  { id: "steppe", label: "Steppe", city: "Bridgewatch", primary: "Hide", secondary: "Fiber", tertiary: "Ore" },
  { id: "swamp", label: "Swamp", city: "Thetford", primary: "Fiber", secondary: "Wood", tertiary: "Hide" },
] as const;

export const RESOURCE_TYPES = [
  "Wood", "Ore", "Hide", "Fiber", "Stone", "Fish",
] as const;

export const RISK_ZONES = [
  { id: "blue", label: "Blue Zone", risk: "safe" },
  { id: "yellow", label: "Yellow Zone", risk: "low" },
  { id: "red", label: "Red Zone", risk: "full_loot" },
  { id: "black", label: "Black Zone / Outlands", risk: "full_loot_high" },
  { id: "roads", label: "Roads of Avalon", risk: "high" },
  { id: "mists", label: "Mists", risk: "variable" },
] as const;

export const GATHERING_PROFESSIONS = [
  { id: "lumberjack", label: "Lumberjack", resource: "Wood", tool: "Axe" },
  { id: "ore_miner", label: "Ore Miner", resource: "Ore", tool: "Pickaxe" },
  { id: "quarrier", label: "Quarrier", resource: "Stone", tool: "Stone Hammer" },
  { id: "fiber_harvester", label: "Fiber Harvester", resource: "Fiber", tool: "Sickle" },
  { id: "skinner", label: "Animal Skinner", resource: "Hide", tool: "Skinning Knife" },
  { id: "fisherman", label: "Fisherman", resource: "Fish", tool: "Fishing Rod" },
] as const;

export const REFINING_BONUS_CITIES = [
  { resource: "Planks", city: "Fort Sterling" },
  { resource: "Cloth", city: "Lymhurst" },
  { resource: "Leather", city: "Martlock" },
  { resource: "Stone Blocks", city: "Bridgewatch" },
  { resource: "Metal Bars", city: "Thetford" },
] as const;

export const BUDGET_LEVELS = ["Cheap", "Medium", "Expensive"] as const;
export const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"] as const;
export const BUILD_STATUSES = ["active", "outdated", "experimental"] as const;
