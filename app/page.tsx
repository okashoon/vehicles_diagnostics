import pool from "@/lib/db";
import { FiltersBar } from "@/app/components/FiltersBar";
import { Pagination } from "@/app/components/Pagination";
import type { Make, Model, ModelYearPair, Year } from "@/app/components/FiltersBar";

const PER_PAGE = 25;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type VehicleRow = {
  id: number;
  year_display: string | null;
  make_name: string | null;
  model_name: string | null;
  model_notes: string | null;
  module: string | null;
  vehicle_interface: string | null;
  obd_dlc_connect_cable: string | null;
  d2m_connect_cable: string | null;
  module_location: string | null;
  market: string | null;
  source_file: string | null;
};

type VehicleStringKey = Exclude<keyof VehicleRow, "id">;

type FilterOptions = {
  makes: Make[];
  allModels: Model[];
  years: Year[];
  modelYearPairs: ModelYearPair[];
};

type VehicleResult = {
  rows: VehicleRow[];
  total: number;
};

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

async function getFilterOptions(): Promise<FilterOptions> {
  try {
    const [makesRes, modelsRes, yearsRes, pairsRes] = await Promise.all([
      pool.query<Make>(`SELECT id, name FROM makes ORDER BY name`),
      pool.query<Model>(`SELECT id, name, make_id FROM models ORDER BY name`),
      pool.query<Year>(
        `SELECT id, display FROM model_years ORDER BY year_start, year_end`
      ),
      pool.query<ModelYearPair>(
        `SELECT DISTINCT model_id, model_year_id AS year_id
         FROM vehicles_lookup
         WHERE model_id IS NOT NULL AND model_year_id IS NOT NULL`
      ),
    ]);
    return {
      makes: makesRes.rows,
      allModels: modelsRes.rows,
      years: yearsRes.rows,
      modelYearPairs: pairsRes.rows,
    };
  } catch {
    return { makes: [], allModels: [], years: [], modelYearPairs: [] };
  }
}

async function getVehicles(
  filters: {
    makeId?: number;
    modelId?: number;
    yearId?: number;
  },
  page: number,
  perPage: number
): Promise<VehicleResult> {
  const filterParams = [
    filters.makeId ?? null,
    filters.modelId ?? null,
    filters.yearId ?? null,
  ];
  const offset = (page - 1) * perPage;

  const WHERE = `
    WHERE ($1::int IS NULL OR vl.make_id       = $1)
      AND ($2::int IS NULL OR vl.model_id      = $2)
      AND ($3::int IS NULL OR vl.model_year_id = $3)`;

  try {
    const [rowsRes, countRes] = await Promise.all([
      pool.query<VehicleRow>(
        `SELECT
           vl.id,
           my.display          AS year_display,
           mk.name             AS make_name,
           mo.name             AS model_name,
           vl.model_notes,
           vl.module,
           vl.vehicle_interface,
           vl.obd_dlc_connect_cable,
           vl.d2m_connect_cable,
           vl.module_location,
           vl.market,
           vl.source_file
         FROM  vehicles_lookup  vl
         LEFT  JOIN makes       mk ON mk.id = vl.make_id
         LEFT  JOIN models      mo ON mo.id = vl.model_id
         LEFT  JOIN model_years my ON my.id = vl.model_year_id
         ${WHERE}
         ORDER BY vl.id
         LIMIT $4 OFFSET $5`,
        [...filterParams, perPage, offset]
      ),
      pool.query<{ total: number }>(
        `SELECT COUNT(*)::int AS total
         FROM vehicles_lookup vl
         ${WHERE}`,
        filterParams
      ),
    ]);

    return {
      rows: rowsRes.rows,
      total: countRes.rows[0]?.total ?? 0,
    };
  } catch (err) {
    console.error("Error getting vehicles", err);
    return { rows: [], total: 0 };
  }
}

// ---------------------------------------------------------------------------
// Table columns
// ---------------------------------------------------------------------------

const COLUMNS: { key: VehicleStringKey; label: string }[] = [
  { key: "year_display",          label: "Year" },
  { key: "make_name",             label: "Make" },
  { key: "model_name",            label: "Model" },
  { key: "model_notes",           label: "Notes" },
  { key: "module",                label: "Module" },
  { key: "vehicle_interface",     label: "Interface" },
  { key: "obd_dlc_connect_cable", label: "OBD/DLC Cable" },
  { key: "d2m_connect_cable",     label: "D2M Cable" },
  { key: "module_location",       label: "Location" },
  { key: "market",                label: "Market" },
  { key: "source_file",           label: "Source File" },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;

  const makeId  = typeof sp.make_id  === "string" ? Number(sp.make_id)  : undefined;
  const modelId = typeof sp.model_id === "string" ? Number(sp.model_id) : undefined;
  const yearId  = typeof sp.year_id  === "string" ? Number(sp.year_id)  : undefined;
  const page    = typeof sp.page     === "string" ? Math.max(1, Number(sp.page)) : 1;

  console.log("page", page);

  const [filterOptions, { rows: vehicles, total }] = await Promise.all([
    getFilterOptions(),
    getVehicles({ makeId, modelId, yearId }, page, PER_PAGE),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);
  const hasFilters = makeId || modelId || yearId;

  // Build a clean params object (without `page`) to pass into Pagination
  // so page links preserve the active filters.
  const filterSearchParams: Record<string, string> = {};
  if (makeId)  filterSearchParams.make_id  = String(makeId);
  if (modelId) filterSearchParams.model_id = String(modelId);
  if (yearId)  filterSearchParams.year_id  = String(yearId);

  return (
    <div className="min-h-screen bg-zinc-50 p-8 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Vehicle Diagnostics Lookup
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {total > 0
              ? `${total.toLocaleString()} record${total === 1 ? "" : "s"}${
                  hasFilters ? " matching filters" : ""
                }`
              : hasFilters
              ? "No records match these filters"
              : "No records found"}
          </p>
        </div>

        <FiltersBar
          makes={filterOptions.makes}
          allModels={filterOptions.allModels}
          years={filterOptions.years}
          modelYearPairs={filterOptions.modelYearPairs}
          currentMakeId={makeId ?? null}
          currentModelId={modelId ?? null}
          currentYearId={yearId ?? null}
        />

        {vehicles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white py-16 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {hasFilters
                ? "No records match these filters."
                : "No records found. Upload a CSV to get started."}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                <thead className="bg-zinc-50 dark:bg-zinc-800/60">
                  <tr>
                    {COLUMNS.map((col) => (
                      <th
                        key={col.key}
                        scope="col"
                        className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {vehicles.map((row) => (
                    <tr
                      key={row.id}
                      className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                    >
                      {COLUMNS.map((col) => {
                        const value = row[col.key];
                        return (
                          <td
                            key={col.key}
                            className="max-w-xs truncate whitespace-nowrap px-4 py-3 text-zinc-700 dark:text-zinc-300"
                            title={value ?? ""}
                          >
                            {value ?? (
                              <span className="text-zinc-300 dark:text-zinc-600">
                                &mdash;
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              perPage={PER_PAGE}
              searchParams={filterSearchParams}
            />
          </div>
        )}
      </div>
    </div>
  );
}
