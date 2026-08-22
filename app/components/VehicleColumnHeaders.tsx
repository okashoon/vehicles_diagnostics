import type { LookupColumnConfig } from "@/lib/vehicle-types";
import { headerSegments } from "@/lib/vehicle-types";

type Props = {
  columns: LookupColumnConfig[];
  variant: "lookup" | "admin";
};

export function VehicleColumnHeaders({ columns, variant }: Props) {
  const segments = headerSegments(columns);
  const hasGroups = segments.some((s) => s.type === "group");

  const base =
    variant === "lookup"
      ? "whitespace-nowrap px-4 py-3 text-left font-mono font-bold tracking-widest text-[#00ff41]/60 uppercase text-[10px]"
      : "px-5 py-3 text-left whitespace-nowrap text-gray-400 text-xs uppercase tracking-wider font-semibold";

  const groupBase =
    variant === "lookup"
      ? "whitespace-nowrap px-4 py-3 text-center font-mono font-bold tracking-widest text-[#00ff41]/80 uppercase text-xs border-b border-[#00ff41]/10"
      : "px-5 py-3 text-center whitespace-nowrap text-gray-300 text-sm uppercase tracking-wider font-semibold border-b border-gray-800";

  if (!hasGroups) {
    return (
      <tr>
        {columns.map((col) => (
          <th key={col.key} className={base}>
            {col.label}
          </th>
        ))}
      </tr>
    );
  }

  return (
    <>
      <tr>
        {segments.map((seg) =>
          seg.type === "leaf" ? (
            <th key={seg.key} rowSpan={2} className={base}>
              {seg.label}
            </th>
          ) : (
            <th key={seg.id} colSpan={seg.children.length} className={groupBase}>
              {seg.label}
            </th>
          )
        )}
      </tr>
      <tr>
        {segments.flatMap((seg) =>
          seg.type === "group"
            ? seg.children.map((child) => (
                <th key={child.key} className={base}>
                  {child.label}
                </th>
              ))
            : []
        )}
      </tr>
    </>
  );
}
