export type ParsedYear = {
  yearStart: number;
  yearEnd: number;
  display: string;
};

/**
 * Parses a raw year string from the CSV into numeric bounds and a display label.
 *
 * Handles:
 *   "2015"        -> { yearStart: 2015,   yearEnd: 2015,   display: "2015" }
 *   "2020.5"      -> { yearStart: 2020.5, yearEnd: 2020.5, display: "2020.5" }
 *   "2014 - 2021" -> { yearStart: 2014,   yearEnd: 2021,   display: "2014 - 2021" }
 *   "2014–2021"   -> same (en-dash variant)
 */
export function parseYear(raw: string): ParsedYear {
  const trimmed = raw.trim();

  // Range: "2014 - 2021" or "2014–2021" (en-dash)
  const rangeMatch = trimmed.match(
    /^(\d+(?:\.\d+)?)\s*[-\u2013]\s*(\d+(?:\.\d+)?)$/
  );
  if (rangeMatch) {
    return {
      yearStart: Number(rangeMatch[1]),
      yearEnd: Number(rangeMatch[2]),
      display: trimmed,
    };
  }

  // Single year or half-year (e.g. 2015, 2020.5)
  const single = Number(trimmed);
  if (!isNaN(single) && single > 0) {
    return { yearStart: single, yearEnd: single, display: trimmed };
  }

  // Fallback: store 0/0 and preserve the raw string so no data is lost
  return { yearStart: 0, yearEnd: 0, display: trimmed };
}
