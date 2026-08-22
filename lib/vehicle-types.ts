export type VehicleRow = {
  id: number;
  year_display: string | null;
  make_name: string | null;
  model_name: string | null;
  model_notes: string | null;
  module_name: string | null;
  interface_names: string | null;
  obd_dlc_connect_cable: string | null;
  obd_adapter: string | null;
  d2m_connect_cable: string | null;
  d2m_adapter: string | null;
  module_location: string | null;
};

export type VehicleStringKey = Exclude<keyof VehicleRow, "id">;

export type VehicleResult = { rows: VehicleRow[]; total: number };

export type ColumnGroup = { id: string; label: string };

export type LookupColumnConfig = {
  key: VehicleStringKey;
  label: string;
  visible: boolean;
};

export const DEFAULT_LOOKUP_COLUMNS: {
  key: VehicleStringKey;
  label: string;
  group?: ColumnGroup;
}[] = [
  { key: "year_display",          label: "YEAR" },
  { key: "make_name",             label: "MAKE" },
  { key: "model_name",            label: "MODEL" },
  { key: "model_notes",           label: "MODEL NOTES" },
  { key: "module_name",           label: "MODULE" },
  { key: "interface_names",       label: "INTERFACES" },
  { key: "obd_dlc_connect_cable", label: "OBD CABLE",   group: { id: "obd", label: "OBD Connection" } },
  { key: "obd_adapter",           label: "OBD Adapter", group: { id: "obd", label: "OBD Connection" } },
  { key: "d2m_connect_cable",     label: "D2M Cable",   group: { id: "d2m", label: "D2M Connection" } },
  { key: "d2m_adapter",           label: "D2M Adapter", group: { id: "d2m", label: "D2M Connection" } },
  { key: "module_location",       label: "LOCATION" },
];

export function columnGroup(key: VehicleStringKey): ColumnGroup | undefined {
  return DEFAULT_LOOKUP_COLUMNS.find((c) => c.key === key)?.group;
}

export type HeaderSegment =
  | { type: "leaf"; key: VehicleStringKey; label: string }
  | { type: "group"; id: string; label: string; children: { key: VehicleStringKey; label: string }[] };

export function headerSegments(columns: LookupColumnConfig[]): HeaderSegment[] {
  const segments: HeaderSegment[] = [];
  for (const col of columns) {
    const group = columnGroup(col.key);
    const last = segments[segments.length - 1];
    if (group && last?.type === "group" && last.id === group.id) {
      last.children.push({ key: col.key, label: col.label });
    } else if (group) {
      segments.push({
        type: "group",
        id: group.id,
        label: group.label,
        children: [{ key: col.key, label: col.label }],
      });
    } else {
      segments.push({ type: "leaf", key: col.key, label: col.label });
    }
  }
  return segments;
}

export type ManagerItem =
  | { type: "leaf"; key: VehicleStringKey; label: string; visible: boolean }
  | {
      type: "group";
      id: string;
      label: string;
      children: { key: VehicleStringKey; label: string; visible: boolean }[];
    };

export function toManagerItems(columns: LookupColumnConfig[]): ManagerItem[] {
  const items: ManagerItem[] = [];
  for (const col of columns) {
    const group = columnGroup(col.key);
    const last = items[items.length - 1];
    if (group && last?.type === "group" && last.id === group.id) {
      last.children.push({ key: col.key, label: col.label, visible: col.visible });
    } else if (group) {
      items.push({
        type: "group",
        id: group.id,
        label: group.label,
        children: [{ key: col.key, label: col.label, visible: col.visible }],
      });
    } else {
      items.push({ type: "leaf", key: col.key, label: col.label, visible: col.visible });
    }
  }
  return items;
}

export function fromManagerItems(items: ManagerItem[]): LookupColumnConfig[] {
  const columns: LookupColumnConfig[] = [];
  for (const item of items) {
    if (item.type === "leaf") {
      columns.push({ key: item.key, label: item.label, visible: item.visible });
    } else {
      for (const child of item.children) {
        columns.push({ key: child.key, label: child.label, visible: child.visible });
      }
    }
  }
  return columns;
}

/** Keep grouped children adjacent, in default order, when merging stored config. */
export function keepGroupsTogether(columns: LookupColumnConfig[]): LookupColumnConfig[] {
  const byKey = new Map(columns.map((c) => [c.key, c]));
  const used = new Set<string>();
  const out: LookupColumnConfig[] = [];

  for (const col of columns) {
    if (used.has(col.key)) continue;
    const group = columnGroup(col.key);
    if (!group) {
      used.add(col.key);
      out.push(col);
      continue;
    }
    for (const def of DEFAULT_LOOKUP_COLUMNS) {
      if (def.group?.id === group.id && byKey.has(def.key) && !used.has(def.key)) {
        used.add(def.key);
        out.push(byKey.get(def.key)!);
      }
    }
  }

  return out;
}
