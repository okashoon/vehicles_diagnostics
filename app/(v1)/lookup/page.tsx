import pool from "@/lib/db";
import { getSession } from "@/lib/auth";
import { FiltersBar } from "@/app/components/FiltersBar";
import { Pagination } from "@/app/components/Pagination";
import { LoginPrompt } from "@/app/components/LoginPrompt";
import type {
  Make,
  Model,
  ModelYearPair,
  Year,
  Module,
  VehicleInterface,
} from "@/app/components/FiltersBar";

const PER_PAGE = 100;

type VehicleRow = {
  id: number;
  year_display: string | null;
  make_name: string | null;
  model_name: string | null;
  module_name: string | null;
  interface_names: string | null;
  obd_dlc_connect_cable: string | null;
  d2m_connect_cable: string | null;
  module_location: string | null;
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

type VehicleResult = { rows: VehicleRow[]; total: number };

async function getFilterOptions(): Promise<FilterOptions> {
  try {
    const [makesRes, modelsRes, yearsRes, pairsRes, modulesRes, interfacesRes] =
      await Promise.all([
        pool.query<Make>(`SELECT id, name FROM makes ORDER BY name`),
        pool.query<Model>(`SELECT id, name, make_id FROM models ORDER BY name`),
        pool.query<Year>(`SELECT id, display FROM model_years ORDER BY year_start, year_end`),
        pool.query<ModelYearPair>(
          `SELECT DISTINCT model_id, model_year_id AS year_id
           FROM vehicles
           WHERE model_id IS NOT NULL AND model_year_id IS NOT NULL`
        ),
        pool.query<Module>(`SELECT id, name FROM modules ORDER BY name`),
        pool.query<VehicleInterface>(`SELECT id, name FROM vehicle_interfaces ORDER BY name`),
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
    return { makes: [], allModels: [], years: [], modelYearPairs: [], modules: [], vehicleInterfaces: [] };
  }
}

async function getVehicles(
  filters: { makeId?: number; modelId?: number; yearId?: number; moduleId?: number; interfaceIds?: number[] },
  page: number,
  perPage: number
): Promise<VehicleResult> {
  const { makeId, modelId, yearId, moduleId, interfaceIds } = filters;
  const interfaceIdsParam = interfaceIds && interfaceIds.length > 0 ? interfaceIds : null;
  const filterParams = [makeId ?? null, modelId ?? null, yearId ?? null, moduleId ?? null, interfaceIdsParam];
  const offset = (page - 1) * perPage;

  const WHERE = `
    WHERE ($1::int IS NULL OR vl.make_id       = $1)
      AND ($2::int IS NULL OR vl.model_id      = $2)
      AND ($3::int IS NULL OR vl.model_year_id = $3)
      AND ($4::int IS NULL OR vl.module_id     = $4)
      AND ($5::int[] IS NULL OR vl.id IN (
            SELECT vehicle_id FROM vehicles_interfaces WHERE interface_id = ANY($5::int[])
          ))`;

  try {
    const [rowsRes, countRes] = await Promise.all([
      pool.query<VehicleRow>(
        `SELECT
           vl.id,
           my.display          AS year_display,
           mk.name             AS make_name,
           mo.name             AS model_name,
           md.name             AS module_name,
           (SELECT string_agg(vi.name, ', ' ORDER BY vi.name)
            FROM   vehicles_interfaces vli
            JOIN   vehicle_interfaces vi ON vi.id = vli.interface_id
            WHERE  vli.vehicle_id = vl.id
           )                  AS interface_names,
           vl.obd_dlc_connect_cable,
           vl.d2m_connect_cable,
           vl.module_location
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
      pool.query<{ total: number }>(`SELECT COUNT(*)::int AS total FROM vehicles vl ${WHERE}`, filterParams),
    ]);
    return { rows: rowsRes.rows, total: countRes.rows[0]?.total ?? 0 };
  } catch (err) {
    console.error("Error getting vehicles", err);
    return { rows: [], total: 0 };
  }
}

const COLUMNS: { key: VehicleStringKey; label: string }[] = [
  { key: "year_display",          label: "YEAR" },
  { key: "make_name",             label: "MAKE" },
  { key: "model_name",            label: "MODEL" },
  { key: "module_name",           label: "MODULE" },
  { key: "interface_names",       label: "INTERFACES" },
  { key: "obd_dlc_connect_cable", label: "OBD/DLC_CABLE" },
  { key: "d2m_connect_cable",     label: "D2M_CABLE" },
  { key: "module_location",       label: "LOCATION" },
];

export default async function LookupV3({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const session = await getSession();
  const isAuthenticated = session !== null;

  const makeId      = typeof sp.make_id      === "string" ? Number(sp.make_id)      : undefined;
  const modelId     = typeof sp.model_id     === "string" ? Number(sp.model_id)     : undefined;
  const yearId      = typeof sp.year_id      === "string" ? Number(sp.year_id)      : undefined;
  const moduleId    = typeof sp.module_id    === "string" ? Number(sp.module_id)    : undefined;
  const interfaceIds =
    typeof sp.interface_ids === "string" && sp.interface_ids
      ? sp.interface_ids.split(",").map(Number).filter((n) => !isNaN(n))
      : undefined;

  const page = typeof sp.page === "string" ? Math.max(1, Number(sp.page)) : 1;
  const hasFilters = makeId || modelId || yearId || moduleId || (interfaceIds && interfaceIds.length > 0);

  const [filterOptions, vehicleResult] = await Promise.all([
    getFilterOptions(),
    isAuthenticated
      ? getVehicles({ makeId, modelId, yearId, moduleId, interfaceIds }, page, PER_PAGE)
      : Promise.resolve({ rows: [], total: 0 }),
  ]);

  const { rows: vehicles, total } = vehicleResult;
  const totalPages = Math.ceil(total / PER_PAGE);

  const filterSearchParams: Record<string, string> = {};
  if (makeId)   filterSearchParams.make_id       = String(makeId);
  if (modelId)  filterSearchParams.model_id      = String(modelId);
  if (yearId)   filterSearchParams.year_id       = String(yearId);
  if (moduleId) filterSearchParams.module_id     = String(moduleId);
  if (interfaceIds && interfaceIds.length > 0)
    filterSearchParams.interface_ids = interfaceIds.join(",");

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8 font-mono text-[#e0ffe0]">
      <div className="mx-auto max-w-8xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.3em] text-[#00ff41]/50 mb-2">// DATABASE_QUERY</p>
            <h1 className="text-xl font-bold tracking-widest text-[#00ff41] uppercase">
              Vehicle Diagnostics Lookup
            </h1>
            <p className="mt-1 text-xs text-[#00cc33]/60 tracking-wide">
              {isAuthenticated
                ? total > 0
                  ? `&gt; ${total.toLocaleString()} RECORD${total === 1 ? "" : "S"}${hasFilters ? " MATCHING FILTERS" : " LOADED"}`
                  : hasFilters
                  ? "&gt; NO RECORDS MATCH FILTERS"
                  : "&gt; NO RECORDS FOUND"
                : "&gt; AUTHENTICATION REQUIRED — APPLY FILTERS THEN SIGN IN"}
            </p>
          </div>
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
          isAuthenticated={isAuthenticated}
        />

        {!isAuthenticated ? (
          <LoginPrompt />
        ) : vehicles.length === 0 ? (
          <div className="border border-dashed border-[#00ff41]/20 bg-[#111111] py-16 text-center">
            <p className="text-sm text-[#00cc33]/60 font-mono tracking-widest">
              {hasFilters ? "&gt; NO RECORDS MATCH FILTERS" : "&gt; NO RECORDS FOUND"}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden border border-[#00ff41]/30 bg-[#111111]">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#00ff41]/10 text-xs">
                <thead className="bg-[#0a0a0a]">
                  <tr>
                    {COLUMNS.map((col) => (
                      <th
                        key={col.key}
                        scope="col"
                        className="whitespace-nowrap px-4 py-3 text-left font-mono font-bold tracking-widest text-[#00ff41]/60 uppercase text-[10px]"
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#00ff41]/10">
                  {vehicles.map((row) => (
                    <tr key={row.id} className="transition-colors hover:bg-[#00ff41]/5">
                      {COLUMNS.map((col) => {
                        const value = row[col.key];
                        return (
                          <td
                            key={col.key}
                            className="max-w-xs truncate whitespace-nowrap px-4 py-2.5 text-[#00cc33] font-mono"
                            title={value ?? ""}
                          >
                            {value ?? <span className="text-[#00ff41]/20">—</span>}
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
