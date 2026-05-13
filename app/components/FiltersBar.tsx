"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Make = { id: number; name: string };
export type Model = { id: number; name: string; make_id: number };
export type Year = { id: number; display: string };
export type ModelYearPair = { model_id: number; year_id: number };

export type FiltersBarProps = {
  makes: Make[];
  allModels: Model[];
  years: Year[];
  modelYearPairs: ModelYearPair[];
  currentMakeId: number | null;
  currentModelId: number | null;
  currentYearId: number | null;
};

// ---------------------------------------------------------------------------
// Reusable searchable dropdown (Make / Model)
// ---------------------------------------------------------------------------

type DropdownOption = { id: number; label: string };

function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  disabled = false,
}: {
  options: DropdownOption[];
  value: number | null;
  onChange: (val: number | null) => void;
  placeholder: string;
  searchPlaceholder: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );
  const selected = options.find((o) => o.id === value);

  function select(id: number | null) {
    onChange(id);
    setOpen(false);
    setSearch("");
  }

  return (
    <div ref={containerRef} className="relative flex-1 min-w-40">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={
          "flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm transition-colors " +
          (disabled
            ? "cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-500"
            : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-500")
        }
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-full min-w-48 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          <div className="border-b border-zinc-100 p-2 dark:border-zinc-800">
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
            />
          </div>

          <ul className="max-h-56 overflow-y-auto py-1">
            <li
              onClick={() => select(null)}
              className="cursor-pointer px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-50 dark:text-zinc-500 dark:hover:bg-zinc-800"
            >
              {placeholder}
            </li>
            {filtered.map((o) => (
              <li
                key={o.id}
                onClick={() => select(o.id)}
                className={
                  "cursor-pointer px-3 py-2 text-sm transition-colors " +
                  (o.id === value
                    ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                    : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800")
                }
              >
                {o.label}
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-zinc-400 dark:text-zinc-500">
                No results
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Chevron icon (inline — no icon library needed)
// ---------------------------------------------------------------------------

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// FiltersBar
// ---------------------------------------------------------------------------

export function FiltersBar({
  makes,
  allModels,
  years,
  modelYearPairs,
  currentMakeId,
  currentModelId,
  currentYearId,
}: FiltersBarProps) {
  const router = useRouter();

  const [makeId, setMakeId] = useState<number | null>(currentMakeId);
  const [modelId, setModelId] = useState<number | null>(currentModelId);
  const [yearId, setYearId] = useState<number | null>(currentYearId);

  // Builds a URL from explicit values so we never read stale state.
  function navigate(mk: number | null, mo: number | null, yr: number | null) {
    const params = new URLSearchParams();
    if (mk !== null) params.set("make_id", String(mk));
    if (mo !== null) params.set("model_id", String(mo));
    if (yr !== null) params.set("year_id", String(yr));
    // page intentionally omitted — any filter change resets to page 1
    router.push(`/?${params.toString()}`);
  }

  function handleMakeChange(id: number | null) {
    setMakeId(id);
    setModelId(null);
    setYearId(null);
    navigate(id, null, null);
  }

  function handleModelChange(id: number | null) {
    // Carry over yearId only if it's still valid for the new model
    const newYearId =
      id !== null && yearId !== null &&
      modelYearPairs.some((p) => p.model_id === id && p.year_id === yearId)
        ? yearId
        : null;
    setModelId(id);
    setYearId(newYearId);
    navigate(makeId, id, newYearId);
  }

  function handleYearChange(id: number | null) {
    setYearId(id);
    navigate(makeId, modelId, id);
  }

  function handleClear() {
    setMakeId(null);
    setModelId(null);
    setYearId(null);
    router.push("/");
  }

  const modelOptions = allModels
    .filter((m) => m.make_id === makeId)
    .map((m) => ({ id: m.id, label: m.name }));

  const yearOptions =
    modelId !== null
      ? years.filter((y) =>
          modelYearPairs.some(
            (p) => p.model_id === modelId && p.year_id === y.id
          )
        )
      : years;

  const hasActiveFilters = makeId !== null || modelId !== null || yearId !== null;

  return (
    <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-end gap-3">
        {/* Make */}
        <div className="flex min-w-40 flex-1 flex-col gap-1">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Make
          </label>
          <SearchableDropdown
            options={makes.map((m) => ({ id: m.id, label: m.name }))}
            value={makeId}
            onChange={handleMakeChange}
            placeholder="All makes"
            searchPlaceholder="Search makes…"
          />
        </div>

        {/* Model */}
        <div className="flex min-w-40 flex-1 flex-col gap-1">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Model
          </label>
          <SearchableDropdown
            options={modelOptions}
            value={modelId}
            onChange={handleModelChange}
            placeholder="All models"
            searchPlaceholder="Search models…"
            disabled={makeId === null}
          />
        </div>

        {/* Year */}
        <div className="flex min-w-36 flex-col gap-1">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Year
          </label>
          <select
            value={yearId ?? ""}
            onChange={(e) =>
              handleYearChange(e.target.value ? Number(e.target.value) : null)
            }
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-500"
          >
            <option value="">All years</option>
            {yearOptions.map((y) => (
              <option key={y.id} value={y.id}>
                {y.display}
              </option>
            ))}
          </select>
        </div>

        {/* Clear */}
        {hasActiveFilters && (
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleClear}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
