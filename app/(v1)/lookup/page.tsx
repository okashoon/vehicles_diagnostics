import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { getProfileStatus, getSession } from "@/lib/auth";
import { FiltersBar } from "@/app/components/FiltersBar";
import { Pagination } from "@/app/components/Pagination";
import { LoginPrompt } from "@/app/components/LoginPrompt";
import { NotesCell } from "@/app/components/NotesCell";
import { VehicleColumnHeaders } from "@/app/components/VehicleColumnHeaders";
import { BackToTop } from "@/app/components/BackToTop";
import type {
  Make,
  Model,
  ModelYearPair,
  Year,
  Module,
  VehicleInterface,
} from "@/app/components/FiltersBar";
import { getVehicles } from "@/lib/vehicles";
import { getLookupColumnConfig, visibleLookupColumns } from "@/lib/lookup-columns";

const PER_PAGE = 100;

type FilterOptions = {
  makes: Make[];
  allModels: Model[];
  years: Year[];
  modelYearPairs: ModelYearPair[];
  modules: Module[];
  vehicleInterfaces: VehicleInterface[];
};

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

export default async function LookupV3({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const session = await getSession();
  const isAuthenticated = session !== null;

  // Google sign-ins (and legacy accounts) never supplied a company — collect it first.
  if (session) {
    const profile = await getProfileStatus(session.userId);
    if (!profile.complete) redirect("/complete-profile");
  }

  const makeId      = typeof sp.make_id      === "string" ? Number(sp.make_id)      : undefined;
  const modelId     = typeof sp.model_id     === "string" ? Number(sp.model_id)     : undefined;
  const yearId      = typeof sp.year_id      === "string" ? Number(sp.year_id)      : undefined;
  const moduleId    = typeof sp.module_id    === "string" ? Number(sp.module_id)    : undefined;
  const interfaceIds =
    typeof sp.interface_ids === "string" && sp.interface_ids
      ? sp.interface_ids.split(",").map(Number).filter((n) => !isNaN(n))
      : undefined;

  const page = typeof sp.page === "string" ? Math.max(1, Number(sp.page)) : 1;
  const hasFilters = Boolean(
    makeId || modelId || yearId || moduleId || (interfaceIds && interfaceIds.length > 0)
  );

  // Results stay empty until at least one filter is applied — no full-table dump.
  const [filterOptions, vehicleResult, columnConfig] = await Promise.all([
    getFilterOptions(),
    isAuthenticated && hasFilters
      ? getVehicles({ makeId, modelId, yearId, moduleId, interfaceIds }, page, PER_PAGE)
      : Promise.resolve({ rows: [], total: 0 }),
    getLookupColumnConfig(),
  ]);

  const columns = visibleLookupColumns(columnConfig);
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
              {!isAuthenticated
                ? "> AUTHENTICATION REQUIRED — APPLY FILTERS THEN SIGN IN"
                : !hasFilters
                ? "> APPLY FILTERS TO SEARCH THE DATABASE"
                : total > 0
                ? `> ${total.toLocaleString()} RECORD${total === 1 ? "" : "S"} MATCHING FILTERS`
                : "> NO RECORDS MATCH FILTERS"}
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
              {!hasFilters ? "> APPLY FILTERS TO SEARCH THE DATABASE" : "> NO RECORDS MATCH FILTERS"}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden border border-[#00ff41]/30 bg-[#111111]">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#00ff41]/10 text-xs">
                <thead className="bg-[#0a0a0a]">
                  <VehicleColumnHeaders columns={columns} variant="lookup" />
                </thead>
                <tbody className="divide-y divide-[#00ff41]/10">
                  {vehicles.map((row) => (
                    <tr key={row.id} className="transition-colors hover:bg-[#00ff41]/5">
                      {columns.map((col) => {
                        const value = row[col.key];
                        return (
                          <td
                            key={col.key}
                            className={
                              col.key === "module_location"
                                ? "max-w-md whitespace-normal px-4 py-2.5 text-[#00cc33] font-mono"
                                : "max-w-xs truncate whitespace-nowrap px-4 py-2.5 text-[#00cc33] font-mono"
                            }
                            title={col.key === "model_notes" ? undefined : (value ?? "")}
                          >
                            {col.key === "model_notes" ? (
                              <NotesCell
                                text={value}
                                emptyClassName="text-[#00ff41]/20"
                                buttonClassName="underline decoration-dotted underline-offset-2 hover:text-[#00ff41]"
                              />
                            ) : value ? (
                              value
                            ) : (
                              <span className="text-[#00ff41]/20">—</span>
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
      <BackToTop />
    </div>
  );
}
