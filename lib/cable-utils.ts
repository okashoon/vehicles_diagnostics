export type CableKind = "obd" | "d2m";

export const CABLE_KINDS: { kind: CableKind; label: string; column: string }[] = [
  { kind: "obd", label: "OBD Cables", column: "obd_dlc_connect_cable" },
  { kind: "d2m", label: "D2M Cables", column: "d2m_connect_cable" },
];

export function cableColumn(kind: CableKind): string {
  return CABLE_KINDS.find((k) => k.kind === kind)!.column;
}

export type CableRecord = {
  id: number;
  kind: CableKind;
  name: string;
  aliases: string[];
  vehicleCount: number;
};

export type CableCluster = {
  key: string;
  /** "number" — same cable #(s). "exact" — identical text after normalizing. */
  kind: "number" | "exact";
  numbers: string[];
  cables: CableRecord[];
};

/** Matches "Cable# 842", "Cable ID# 842", "Cable #842", "cable id #0842". */
const CABLE_NUMBER_RE = /cable\s*(?:id)?\s*#?\s*0*(\d+)/gi;
/** Fallback for names that only carry a bare "#842". */
const BARE_NUMBER_RE = /#\s*0*(\d+)/g;

export function extractCableNumbers(raw: string): string[] {
  const found = new Set<string>();

  for (const m of raw.matchAll(CABLE_NUMBER_RE)) found.add(m[1]);
  if (found.size === 0) {
    for (const m of raw.matchAll(BARE_NUMBER_RE)) found.add(m[1]);
  }

  return [...found].sort((a, b) => Number(a) - Number(b));
}

export function normalizeCableName(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/cable\s*id\s*#/g, "cable#")
    .replace(/cable\s*#/g, "cable#")
    .replace(/[^a-z0-9#]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Groups cable names of a single category.
 *
 * Names carrying cable numbers are grouped when their full number set matches,
 * so "Cable# 842 or Cable# 861 ..." and "Cable ID# 842 or Cable ID# 861 ..."
 * land together. Names without numbers only group on identical text.
 */
export function clusterCables(cables: CableRecord[]): {
  clusters: CableCluster[];
  uniques: CableRecord[];
} {
  const groups = new Map<string, { kind: "number" | "exact"; numbers: string[]; cables: CableRecord[] }>();

  for (const cable of cables) {
    const numbers = extractCableNumbers(cable.name);
    const key =
      numbers.length > 0
        ? `num:${numbers.join("+")}`
        : `txt:${normalizeCableName(cable.name) || `id-${cable.id}`}`;

    const existing = groups.get(key);
    if (existing) {
      existing.cables.push(cable);
    } else {
      groups.set(key, {
        kind: numbers.length > 0 ? "number" : "exact",
        numbers,
        cables: [cable],
      });
    }
  }

  const clusters: CableCluster[] = [];
  const uniques: CableRecord[] = [];

  for (const [key, group] of groups) {
    const sorted = [...group.cables].sort(
      (a, b) => b.vehicleCount - a.vehicleCount || a.name.localeCompare(b.name)
    );
    if (sorted.length > 1) {
      clusters.push({ key: `${cables[0]?.kind ?? "obd"}:${key}`, kind: group.kind, numbers: group.numbers, cables: sorted });
    } else {
      uniques.push(sorted[0]);
    }
  }

  clusters.sort((a, b) => {
    const aTotal = a.cables.reduce((s, c) => s + c.vehicleCount, 0);
    const bTotal = b.cables.reduce((s, c) => s + c.vehicleCount, 0);
    return bTotal - aTotal || b.cables.length - a.cables.length;
  });

  uniques.sort((a, b) => b.vehicleCount - a.vehicleCount || a.name.localeCompare(b.name));

  return { clusters, uniques };
}
