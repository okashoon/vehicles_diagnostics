import { parse } from "csv-parse";
import { Readable } from "stream";
import type { PoolClient } from "pg";
import pool from "@/lib/db";
import { parseYear } from "@/lib/parse-year";
import { requireAdmin } from "@/lib/auth";

// ---------------------------------------------------------------------------
// DDL
// ---------------------------------------------------------------------------

const DDL = `
  CREATE TABLE IF NOT EXISTS makes (
    id   SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    CONSTRAINT makes_name_uq UNIQUE (name)
  );

  CREATE TABLE IF NOT EXISTS models (
    id      SERIAL PRIMARY KEY,
    name    TEXT    NOT NULL,
    make_id INTEGER NOT NULL REFERENCES makes (id),
    CONSTRAINT models_name_make_uq UNIQUE (name, make_id)
  );

  CREATE TABLE IF NOT EXISTS model_years (
    id         SERIAL PRIMARY KEY,
    year_start NUMERIC(6,1) NOT NULL,
    year_end   NUMERIC(6,1) NOT NULL,
    display    TEXT         NOT NULL,
    CONSTRAINT model_years_range_uq UNIQUE (year_start, year_end)
  );

  CREATE TABLE IF NOT EXISTS modules (
    id   SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    CONSTRAINT modules_name_uq UNIQUE (name)
  );

  CREATE TABLE IF NOT EXISTS vehicle_interfaces (
    id   SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    CONSTRAINT vehicle_interfaces_name_uq UNIQUE (name)
  );

  DROP TABLE IF EXISTS vehicles_interfaces;
  DROP TABLE IF EXISTS vehicles;

  CREATE TABLE vehicles (
    id                    SERIAL PRIMARY KEY,
    make_id               INTEGER REFERENCES makes (id),
    model_id              INTEGER REFERENCES models (id),
    model_year_id         INTEGER REFERENCES model_years (id),
    module_id             INTEGER REFERENCES modules (id),
    source_file           TEXT,
    market                TEXT,
    year_make             TEXT,
    model_notes           TEXT,
    obd_dlc_connect_cable TEXT,
    d2m_connect_cable     TEXT,
    module_location       TEXT,
    created_at            TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE vehicles_interfaces (
    vehicle_id   INTEGER NOT NULL REFERENCES vehicles (id) ON DELETE CASCADE,
    interface_id INTEGER NOT NULL REFERENCES vehicle_interfaces (id) ON DELETE CASCADE,
    PRIMARY KEY (vehicle_id, interface_id)
  );
`;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CsvRow = {
  source_file: string;
  market: string;
  year_make: string;
  year: string;
  make: string;
  model: string;
  model_notes: string;
  module: string;
  vehicle_interface: string;
  obd_dlc_connect_cable: string;
  d2m_connect_cable: string;
  module_location: string;
};

// ---------------------------------------------------------------------------
// CSV parser
// ---------------------------------------------------------------------------

function parseCsv(buffer: Buffer): Promise<CsvRow[]> {
  return new Promise((resolve, reject) => {
    const rows: CsvRow[] = [];
    Readable.from(buffer).pipe(
      parse({
        columns: (header: string[]) =>
          header.map((h) =>
            h
              .toLowerCase()
              .replace(/\//g, "_")
              .replace(/[^a-z0-9]+/g, "_")
              .replace(/^_|_$/g, "")
          ),
        skip_empty_lines: true,
        trim: true,
      })
        .on("data", (row: CsvRow) => rows.push(row))
        .on("error", reject)
        .on("end", () => resolve(rows))
    );
  });
}

// ---------------------------------------------------------------------------
// Parsing helpers
// ---------------------------------------------------------------------------

/**
 * Splits a raw vehicle_interface cell into individual interface names.
 *
 * Rules:
 *  1. Split by comma.
 *  2. If a comma-token begins with "CANplus " followed by more text (e.g.
 *     "CANplus CDR 900"), split off "CANplus" as a separate interface.
 *
 * Examples:
 *   "CDR 9000"                  → ["CDR 9000"]
 *   "CANplus, CDR 9000, CDX"    → ["CANplus", "CDR 9000", "CDX"]
 *   "CANplus CDR 900, CDX"      → ["CANplus", "CDR 900", "CDX"]
 *   "CANplus, CDR 900, CDX"     → ["CANplus", "CDR 900", "CDX"]
 */
function parseVehicleInterfaces(raw: string): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .flatMap((token) => {
      const t = token.trim();
      if (!t) return [];
      if (t.startsWith("CANplus ")) {
        const rest = t.slice("CANplus ".length).trim();
        return rest ? ["CANplus", rest] : ["CANplus"];
      }
      return [t];
    })
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// Upsert helpers — return the id of the existing or newly inserted row
// ---------------------------------------------------------------------------

async function upsertMake(client: PoolClient, name: string): Promise<number> {
  const { rows } = await client.query<{ id: number }>(
    `INSERT INTO makes (name)
     VALUES ($1)
     ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [name]
  );
  return rows[0].id;
}

async function upsertModel(
  client: PoolClient,
  name: string,
  makeId: number
): Promise<number> {
  const { rows } = await client.query<{ id: number }>(
    `INSERT INTO models (name, make_id)
     VALUES ($1, $2)
     ON CONFLICT (name, make_id) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [name, makeId]
  );
  return rows[0].id;
}

async function upsertModelYear(
  client: PoolClient,
  yearStart: number,
  yearEnd: number,
  display: string
): Promise<number> {
  const { rows } = await client.query<{ id: number }>(
    `INSERT INTO model_years (year_start, year_end, display)
     VALUES ($1, $2, $3)
     ON CONFLICT (year_start, year_end) DO UPDATE SET display = EXCLUDED.display
     RETURNING id`,
    [yearStart, yearEnd, display]
  );
  return rows[0].id;
}

async function upsertModule(client: PoolClient, name: string): Promise<number> {
  const { rows } = await client.query<{ id: number }>(
    `INSERT INTO modules (name)
     VALUES ($1)
     ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [name]
  );
  return rows[0].id;
}

async function upsertVehicleInterface(
  client: PoolClient,
  name: string
): Promise<number> {
  const { rows } = await client.query<{ id: number }>(
    `INSERT INTO vehicle_interfaces (name)
     VALUES ($1)
     ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [name]
  );
  return rows[0].id;
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Invalid multipart form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return Response.json(
      { error: 'Missing file field. Send the CSV as a form field named "file".' },
      { status: 400 }
    );
  }

  if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
    return Response.json({ error: "Uploaded file must be a CSV" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let rows: CsvRow[];
  try {
    rows = await parseCsv(buffer);
  } catch (err) {
    return Response.json(
      { error: "Failed to parse CSV", detail: String(err) },
      { status: 422 }
    );
  }

  if (rows.length === 0) {
    return Response.json(
      { error: "CSV file is empty or has no data rows" },
      { status: 422 }
    );
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(DDL);

    let inserted = 0;
    for (const row of rows) {
      const makeName = row.make?.trim();
      const modelName = row.model?.trim();
      const yearRaw = row.year?.trim();
      const moduleName = row.module?.trim();

      const makeId = makeName ? await upsertMake(client, makeName) : null;

      const modelId =
        modelName && makeId !== null
          ? await upsertModel(client, modelName, makeId)
          : null;

      let modelYearId: number | null = null;
      if (yearRaw) {
        const { yearStart, yearEnd, display } = parseYear(yearRaw);
        modelYearId = await upsertModelYear(client, yearStart, yearEnd, display);
      }

      const moduleId = moduleName ? await upsertModule(client, moduleName) : null;

      const { rows: vehicleRows } = await client.query<{ id: number }>(
        `INSERT INTO vehicles
           (make_id, model_id, model_year_id, module_id,
            source_file, market, year_make, model_notes,
            obd_dlc_connect_cable, d2m_connect_cable, module_location)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         RETURNING id`,
        [
          makeId,
          modelId,
          modelYearId,
          moduleId,
          row.source_file ?? null,
          row.market ?? null,
          row.year_make ?? null,
          row.model_notes ?? null,
          row.obd_dlc_connect_cable ?? null,
          row.d2m_connect_cable ?? null,
          row.module_location ?? null,
        ]
      );

      const vehicleId = vehicleRows[0].id;

      const interfaceNames = parseVehicleInterfaces(row.vehicle_interface ?? "");
      for (const name of interfaceNames) {
        const interfaceId = await upsertVehicleInterface(client, name);
        await client.query(
          `INSERT INTO vehicles_interfaces (vehicle_id, interface_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [vehicleId, interfaceId]
        );
      }

      inserted++;
    }

    await client.query("COMMIT");
    return Response.json({ success: true, inserted });
  } catch (err) {
    await client.query("ROLLBACK");
    return Response.json(
      { error: "Database error", detail: String(err) },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
