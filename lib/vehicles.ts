import pool from "@/lib/db";
import type { VehicleResult, VehicleRow } from "@/lib/vehicle-types";

export type { VehicleResult, VehicleRow, VehicleStringKey } from "@/lib/vehicle-types";
export { DEFAULT_LOOKUP_COLUMNS } from "@/lib/vehicle-types";

export async function getVehicles(
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
           vl.model_notes,
           md.name             AS module_name,
           (SELECT string_agg(vi.name, ', ' ORDER BY vi.name)
            FROM   vehicles_interfaces vli
            JOIN   vehicle_interfaces vi ON vi.id = vli.interface_id
            WHERE  vli.vehicle_id = vl.id
           )                  AS interface_names,
           vl.obd_dlc_connect_cable,
           vl.obd_adapter,
           vl.d2m_connect_cable,
           vl.d2m_adapter,
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
