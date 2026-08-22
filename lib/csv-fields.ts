export type CsvFieldKey =
  | "source_file"
  | "market"
  | "year_make"
  | "year"
  | "make"
  | "model"
  | "model_notes"
  | "module"
  | "vehicle_interface"
  | "obd_dlc_connect_cable"
  | "obd_adapter"
  | "d2m_connect_cable"
  | "d2m_adapter"
  | "module_location";

export const CSV_FIELDS: { key: CsvFieldKey; label: string }[] = [
  { key: "source_file",           label: "Source file" },
  { key: "market",                label: "Market" },
  { key: "year_make",             label: "Year / Make" },
  { key: "year",                  label: "Year" },
  { key: "make",                  label: "Make" },
  { key: "model",                 label: "Model" },
  { key: "model_notes",           label: "Model notes" },
  { key: "module",                label: "Module" },
  { key: "vehicle_interface",     label: "Vehicle interface" },
  { key: "obd_dlc_connect_cable", label: "OBD cable" },
  { key: "obd_adapter",           label: "OBD adapter" },
  { key: "d2m_connect_cable",     label: "D2M cable" },
  { key: "d2m_adapter",           label: "D2M adapter" },
  { key: "module_location",       label: "Module location" },
];

export const CSV_FIELD_KEYS = CSV_FIELDS.map((f) => f.key);

export function normalizeHeader(h: string): string {
  return h
    .toLowerCase()
    .replace(/\//g, "_")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

/** Suggest which CSV header maps to each internal field. */
export function suggestMapping(csvHeaders: string[]): Record<CsvFieldKey, string> {
  const mapping = {} as Record<CsvFieldKey, string>;
  const used = new Set<string>();

  for (const field of CSV_FIELDS) {
    const match = csvHeaders.find((h) => {
      if (used.has(h)) return false;
      const n = normalizeHeader(h);
      return n === field.key || n === normalizeHeader(field.label);
    });
    mapping[field.key] = match ?? "";
    if (match) used.add(match);
  }

  return mapping;
}
