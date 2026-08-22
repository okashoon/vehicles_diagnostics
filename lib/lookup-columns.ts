import pool from "@/lib/db";
import {
  DEFAULT_LOOKUP_COLUMNS,
  keepGroupsTogether,
  type LookupColumnConfig,
  type VehicleStringKey,
} from "@/lib/vehicle-types";

export type { LookupColumnConfig } from "@/lib/vehicle-types";

const VALID_KEYS = new Set(DEFAULT_LOOKUP_COLUMNS.map((c) => c.key));

export function mergeWithDefaults(
  stored: { key: string; label: string; visible: boolean }[]
): LookupColumnConfig[] {
  const used = new Set<string>();
  const result: LookupColumnConfig[] = [];

  for (const row of stored) {
    if (!VALID_KEYS.has(row.key as VehicleStringKey) || used.has(row.key)) continue;
    const def = DEFAULT_LOOKUP_COLUMNS.find((c) => c.key === row.key)!;
    used.add(row.key);
    result.push({
      key: row.key as VehicleStringKey,
      label: def.label,
      visible: row.visible,
    });
  }

  for (const def of DEFAULT_LOOKUP_COLUMNS) {
    if (!used.has(def.key)) {
      result.push({ key: def.key, label: def.label, visible: true });
    }
  }

  return keepGroupsTogether(result);
}

export async function getLookupColumnConfig(): Promise<LookupColumnConfig[]> {
  try {
    const { rows } = await pool.query<{ key: string; label: string; visible: boolean }>(
      `SELECT key, label, visible
       FROM lookup_column_config
       ORDER BY position ASC`
    );
    if (rows.length === 0) {
      return DEFAULT_LOOKUP_COLUMNS.map((c) => ({ ...c, visible: true }));
    }
    return mergeWithDefaults(rows);
  } catch {
    return DEFAULT_LOOKUP_COLUMNS.map((c) => ({ ...c, visible: true }));
  }
}

export function visibleLookupColumns(columns: LookupColumnConfig[]) {
  return columns.filter((c) => c.visible);
}
