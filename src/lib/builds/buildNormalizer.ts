export function normalizeItemName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "_");
}

export function buildFingerprint(items: { slot: string; itemUniqueName: string }[]): string {
  const sorted = [...items].sort((a, b) => a.slot.localeCompare(b.slot));
  return sorted.map((i) => `${i.slot}:${i.itemUniqueName}`).join("|");
}

export function compareBuilds(
  a: { items: { slot: string; itemUniqueName: string }[] },
  b: { items: { slot: string; itemUniqueName: string }[] },
): boolean {
  return buildFingerprint(a.items) === buildFingerprint(b.items);
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
