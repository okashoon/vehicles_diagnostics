import pool from "@/lib/db";
import { FiltersBar } from "@/app/components/FiltersBar";
import { Pagination } from "@/app/components/Pagination";
import type {
  Make,
  Model,
  ModelYearPair,
  Year,
  Module,
  VehicleInterface,
} from "@/app/components/FiltersBar";

const PER_PAGE = 25;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type VehicleRow = {
  id: number;
  year_display: string | null;
  make_name: string | null;
  model_name: string | null;
  // model_notes: string | null;
  module_name: string | null;
  interface_names: string | null;
  obd_dlc_connect_cable: string | null;
  d2m_connect_cable: string | null;
  module_location: string | null;
  // market: string | null;
  // source_file: string | null;
};

type VehicleStringKey = Exclude<keyof VehicleRow, "id">;

type FilterOptions = {
  makes: Make[];
  allModels: Model[];
  years: Year[];
  modelYearPairs: ModelYearPair[];
  modules: Module[];
  vehicleInterfaces: VehicleInterface[];
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
    const [makesRes, modelsRes, yearsRes, pairsRes, modulesRes, interfacesRes] =
      await Promise.all([
        pool.query<Make>(`SELECT id, name FROM makes ORDER BY name`),
        pool.query<Model>(`SELECT id, name, make_id FROM models ORDER BY name`),
        pool.query<Year>(
          `SELECT id, display FROM model_years ORDER BY year_start, year_end`
        ),
        pool.query<ModelYearPair>(
          `SELECT DISTINCT model_id, model_year_id AS year_id
           FROM vehicles
           WHERE model_id IS NOT NULL AND model_year_id IS NOT NULL`
        ),
        pool.query<Module>(`SELECT id, name FROM modules ORDER BY name`),
        pool.query<VehicleInterface>(
          `SELECT id, name FROM vehicle_interfaces ORDER BY name`
        ),
      ]);
    return {
      makes: makesRes.rows,
      allModels: modelsRes.rows,
      years: yearsRes.rows,
      modelYearPairs: pairsRes.rows,
      modules: modulesRes.rows,
      vehicleInterfaces: interfacesRes.rows,
    };
  } catch {
    return {
      makes: [],
      allModels: [],
      years: [],
      modelYearPairs: [],
      modules: [],
      vehicleInterfaces: [],
    };
  }
}

async function getVehicles(
  filters: {
    makeId?: number;
    modelId?: number;
    yearId?: number;
    moduleId?: number;
    interfaceIds?: number[];
  },
  page: number,
  perPage: number
): Promise<VehicleResult> {
  const { makeId, modelId, yearId, moduleId, interfaceIds } = filters;
  const interfaceIdsParam =
    interfaceIds && interfaceIds.length > 0 ? interfaceIds : null;

  const filterParams = [
    makeId ?? null,
    modelId ?? null,
    yearId ?? null,
    moduleId ?? null,
    interfaceIdsParam,
  ];
  const offset = (page - 1) * perPage;

  const WHERE = `
    WHERE ($1::int IS NULL OR vl.make_id       = $1)
      AND ($2::int IS NULL OR vl.model_id      = $2)
      AND ($3::int IS NULL OR vl.model_year_id = $3)
      AND ($4::int IS NULL OR vl.module_id     = $4)
      AND ($5::int[] IS NULL OR vl.id IN (
            SELECT vehicle_id
            FROM   vehicles_interfaces
            WHERE  interface_id = ANY($5::int[])
          ))`;

  try {
    const [rowsRes, countRes] = await Promise.all([
      pool.query<VehicleRow>(
        `SELECT
           vl.id,
           my.display          AS year_display,
           mk.name             AS make_name,
           mo.name             AS model_name,
           -- vl.model_notes,
           md.name             AS module_name,
           (SELECT string_agg(vi.name, ', ' ORDER BY vi.name)
            FROM   vehicles_interfaces vli
            JOIN   vehicle_interfaces vi ON vi.id = vli.interface_id
            WHERE  vli.vehicle_id = vl.id
           )                  AS interface_names,
           vl.obd_dlc_connect_cable,
           vl.d2m_connect_cable,
           vl.module_location
           -- vl.market,
           -- vl.source_file
         FROM  vehicles  vl
         LEFT  JOIN makes           mk ON mk.id = vl.make_id
         LEFT  JOIN models          mo ON mo.id = vl.model_id
         LEFT  JOIN model_years     my ON my.id = vl.model_year_id
         LEFT  JOIN modules         md ON md.id = vl.module_id
         ${WHERE}
         ORDER BY vl.id
         LIMIT $6 OFFSET $7`,
        [...filterParams, perPage, offset]
      ),
      pool.query<{ total: number }>(
        `SELECT COUNT(*)::int AS total
         FROM vehicles vl
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
  // { key: "model_notes",           label: "Notes" },
  { key: "module_name",           label: "Module" },
  { key: "interface_names",       label: "Interfaces" },
  { key: "obd_dlc_connect_cable", label: "OBD/DLC Cable" },
  { key: "d2m_connect_cable",     label: "D2M Cable" },
  { key: "module_location",       label: "Location" },
  // { key: "market",                label: "Market" },
  // { key: "source_file",           label: "Source File" },
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

  const makeId     = typeof sp.make_id      === "string" ? Number(sp.make_id)      : undefined;
  const modelId    = typeof sp.model_id     === "string" ? Number(sp.model_id)     : undefined;
  const yearId     = typeof sp.year_id      === "string" ? Number(sp.year_id)      : undefined;
  const moduleId   = typeof sp.module_id    === "string" ? Number(sp.module_id)    : undefined;
  const interfaceIds =
    typeof sp.interface_ids === "string" && sp.interface_ids
      ? sp.interface_ids.split(",").map(Number).filter((n) => !isNaN(n))
      : undefined;

  const page = typeof sp.page === "string" ? Math.max(1, Number(sp.page)) : 1;

  const [filterOptions, { rows: vehicles, total }] = await Promise.all([
    getFilterOptions(),
    getVehicles({ makeId, modelId, yearId, moduleId, interfaceIds }, page, PER_PAGE),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);
  const hasFilters =
    makeId || modelId || yearId || moduleId || (interfaceIds && interfaceIds.length > 0);

  const filterSearchParams: Record<string, string> = {};
  if (makeId)   filterSearchParams.make_id       = String(makeId);
  if (modelId)  filterSearchParams.model_id      = String(modelId);
  if (yearId)   filterSearchParams.year_id       = String(yearId);
  if (moduleId) filterSearchParams.module_id     = String(moduleId);
  if (interfaceIds && interfaceIds.length > 0)
    filterSearchParams.interface_ids = interfaceIds.join(",");

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
          modules={filterOptions.modules}
          vehicleInterfaces={filterOptions.vehicleInterfaces}
          currentMakeId={makeId ?? null}
          currentModelId={modelId ?? null}
          currentYearId={yearId ?? null}
          currentModuleId={moduleId ?? null}
          currentInterfaceIds={interfaceIds ?? []}
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
