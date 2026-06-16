export const CURRENT_PATCH_VERSION = "latest";

export const DEFAULT_SERVER = "west" as const;
export const DEFAULT_CITY = "Bridgewatch" as const;
export const CITIES = ["Bridgewatch", "Martlock", "Thetford", "Fort Sterling", "Lymhurst", "Caerleon", "Brecilien"] as const;
export const SERVERS = { west: "west", east: "east", europe: "europe" } as const;

export const MIN_POPULAR_USAGES = 25;
export const MIN_POPULAR_SAMPLE_SIZE = 25;
export const MIN_POPULAR_WIN_RATE = 50;
export const MAX_POPULAR_DATA_AGE_DAYS = 14;

export const OUTDATED_DAYS_THRESHOLD = 30;

export type Server = keyof typeof SERVERS;

export const CONTENT_TYPES = {
  solo_open_world: "Solo Open World",
  solo_dungeons: "Solo Dungeons",
  corrupted_dungeons: "Corrupted Dungeons",
  solo_mists: "Solo Mists",
  knightfall_abbey: "Knightfall Abbey",
  solo_tracking: "Solo Tracking",
  solo_gathering: "Solo Gathering",
  solo_ganking: "Solo Ganking",
  solo_roads: "Solo Roads of Avalon",
  duo_mists: "Duo Mists",
  hellgate_2v2: "2v2 Hellgates",
  abyssal_2v2: "Abyssal Depths 2v2",
  abyssal_3v3: "Abyssal Depths 3v3",
  small_scale: "Small Scale",
  roads: "Roads of Avalon",
  crystal_spiders: "Crystal Spiders",
  group_tracking: "Group Tracking",
  group_dungeons: "Group Dungeons",
  static_dungeons: "Static Dungeons",
  avalonian_dungeons: "Avalonian Dungeons",
  world_bosses: "World Bosses",
  fame_farm_group: "Fame Farm Group",
  avalon_gold: "Avalon Gold Chests",
  avalon_blue: "Avalon Blue Chests",
  arena: "Arena",
  crystal_arena_5v5: "Crystal Arena 5v5",
  crystal_league_5v5: "Crystal League 5v5",
  crystal_league_20v20: "Crystal League 20v20",
  hellgate_5v5: "Hellgates 5v5",
  hellgate_10v10: "Hellgates 10v10",
  ganking: "Ganking",
  faction_warfare: "Faction Warfare",
  bandit_assault: "Bandit Assault",
  outposts: "Outposts",
  castles: "Castles",
  territory_fights: "Territory Fights",
  zvz: "ZvZ",
  bomb_squad: "Bomb Squad",
  transport_ganking: "Transport Ganking",
  roads_pvp: "Roads PvP",
} as const;

export const ROLES = [
  "Tank", "Healer", "Melee DPS", "Ranged DPS", "Support",
  "Bruiser", "Assassin", "Kite DPS", "Brawler",
  "Engage Tank", "Defensive Tank", "Peeler", "Caller", "Shotcaller",
  "Bomb Squad", "Ganker", "Scout", "Transporter", "Gatherer",
  "Crafter", "Refiner", "Farmer",
  "Sustain DPS", "One-shot", "Mobility build", "Rat", "Escape gatherer",
  "Battle gatherer", "Fisher",
  "Double DPS", "One-shot comp", "Kite comp", "Bruiser comp",
  "Backline diver",
  "Clap DPS", "Support Arcane", "Support Nature", "Support Holy",
  "Locus Support", "Cleanse Support",
  "Camlann", "Permafrost", "Siege", "Objective pressure",
] as const;

export const WEAPON_LINES = [
  "Sword", "Axe", "Mace", "Hammer", "Spear", "Dagger", "Bow", "Crossbow",
  "Quarterstaff", "War Gloves", "Fire Staff", "Frost Staff", "Arcane Staff",
  "Holy Staff", "Nature Staff", "Cursed Staff", "Shapeshifter Staff",
] as const;

export const BUDGET_LEVELS = ["cheap", "medium", "expensive", "luxury"] as const;
export const DIFFICULTIES = ["easy", "medium", "hard", "expert"] as const;
export const STATUSES = ["active", "experimental", "outdated", "archived"] as const;
export const SOURCE_TYPES = ["manual", "pvp_stats", "market_calculated", "hybrid"] as const;
export const SLOTS = ["main_hand", "off_hand", "head", "chest", "shoes", "cape", "bag", "mount", "food", "potion"] as const;
