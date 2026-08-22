import pool from "@/lib/db";
import { CABLE_KINDS, cableColumn, type CableKind, type CableRecord } from "@/lib/cable-utils";

/** Adds any cable string found on vehicles that isn't tracked yet, per category. */
export async function scanCables(): Promise<Record<CableKind, number>> {
  const result = { obd: 0, d2m: 0 } as Record<CableKind, number>;

  for (const { kind, column } of CABLE_KINDS) {
    const { rows } = await pool.query<{ name: string }>(
      `SELECT DISTINCT trim(${column}) AS name
       FROM vehicles
       WHERE ${column} IS NOT NULL AND trim(${column}) <> ''`
    );

    for (const { name } of rows) {
      const known = await pool.query(
        `SELECT 1 FROM cable_aliases WHERE kind = $1 AND raw_name = $2`,
        [kind, name]
      );
      if (known.rows.length > 0) continue;

      const { rows: created } = await pool.query<{ id: number }>(
        `INSERT INTO cables (kind, name) VALUES ($1, $2)
         ON CONFLICT (kind, name) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [kind, name]
      );
      await pool.query(
        `INSERT INTO cable_aliases (cable_id, kind, raw_name) VALUES ($1, $2, $3)
         ON CONFLICT (kind, raw_name) DO NOTHING`,
        [created[0].id, kind, name]
      );
      result[kind]++;
    }
  }

  return result;
}

export async function listCables(): Promise<CableRecord[]> {
  const { rows } = await pool.query<{
    id: number;
    kind: CableKind;
    name: string;
    aliases: string[];
  }>(`
    SELECT
      c.id,
      c.kind,
      c.name,
      COALESCE(
        array_agg(a.raw_name ORDER BY a.raw_name) FILTER (WHERE a.raw_name IS NOT NULL),
        ARRAY[]::text[]
      ) AS aliases
    FROM cables c
    LEFT JOIN cable_aliases a ON a.cable_id = c.id
    GROUP BY c.id, c.kind, c.name
    ORDER BY c.name
  `);

  const counts = await usageCounts();

  return rows.map((row) => {
    const names = new Set([row.name, ...row.aliases]);
    let vehicleCount = 0;
    for (const n of names) vehicleCount += counts[row.kind].get(n) ?? 0;
    return { id: row.id, kind: row.kind, name: row.name, aliases: row.aliases, vehicleCount };
  });
}

async function usageCounts(): Promise<Record<CableKind, Map<string, number>>> {
  const result = { obd: new Map(), d2m: new Map() } as Record<CableKind, Map<string, number>>;

  for (const { kind, column } of CABLE_KINDS) {
    try {
      const { rows } = await pool.query<{ name: string; count: number }>(
        `SELECT trim(${column}) AS name, COUNT(*)::int AS count
         FROM vehicles
         WHERE ${column} IS NOT NULL AND trim(${column}) <> ''
         GROUP BY trim(${column})`
      );
      result[kind] = new Map(rows.map((r) => [r.name, r.count]));
    } catch {
      result[kind] = new Map();
    }
  }

  return result;
}

/** Maps a raw CSV value back to its merged canonical name. */
export async function resolveCableName(
  raw: string | null | undefined,
  kind: CableKind
): Promise<string | null> {
  if (!raw?.trim()) return raw ?? null;
  const name = raw.trim();
  try {
    const { rows } = await pool.query<{ name: string }>(
      `SELECT c.name
       FROM cable_aliases a
       JOIN cables c ON c.id = a.cable_id
       WHERE a.kind = $1 AND a.raw_name = $2`,
      [kind, name]
    );
    return rows[0]?.name ?? name;
  } catch {
    return name;
  }
}

export async function mergeCables(canonicalId: number, mergeIds: number[]): Promise<void> {
  const { rows: canonicalRows } = await pool.query<{ name: string; kind: CableKind }>(
    `SELECT name, kind FROM cables WHERE id = $1`,
    [canonicalId]
  );
  if (!canonicalRows[0]) throw new Error("Canonical cable not found.");
  const { name: canonicalName, kind } = canonicalRows[0];

  const ids = [...new Set(mergeIds.filter((id) => id !== canonicalId))];
  if (ids.length === 0) return;

  const { rows: absorbed } = await pool.query<{ name: string }>(
    `SELECT name FROM cables WHERE id = ANY($1::int[]) AND kind = $2`,
    [ids, kind]
  );
  if (absorbed.length === 0) return;
  const oldNames = absorbed.map((r) => r.name);
  const column = cableColumn(kind);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      `UPDATE cable_aliases SET cable_id = $1 WHERE cable_id = ANY($2::int[])`,
      [canonicalId, ids]
    );

    for (const oldName of oldNames) {
      await client.query(
        `INSERT INTO cable_aliases (cable_id, kind, raw_name)
         VALUES ($1, $2, $3)
         ON CONFLICT (kind, raw_name) DO UPDATE SET cable_id = EXCLUDED.cable_id`,
        [canonicalId, kind, oldName]
      );
    }

    await client.query(
      `UPDATE vehicles SET ${column} = $1 WHERE trim(${column}) = ANY($2::text[])`,
      [canonicalName, oldNames]
    );

    await client.query(`DELETE FROM cables WHERE id = ANY($1::int[])`, [ids]);
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
