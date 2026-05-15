"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Make           = { id: number; name: string };
export type Model          = { id: number; name: string; make_id: number };
export type Year           = { id: number; display: string };
export type ModelYearPair  = { model_id: number; year_id: number };
export type Module         = { id: number; name: string };
export type VehicleInterface = { id: number; name: string };

export type FiltersBarProps = {
  makes: Make[];
  allModels: Model[];
  years: Year[];
  modelYearPairs: ModelYearPair[];
  modules: Module[];
  vehicleInterfaces: VehicleInterface[];
  currentMakeId: number | null;
  currentModelId: number | null;
  currentYearId: number | null;
  currentModuleId: number | null;
  currentInterfaceIds: number[];
};

// ---------------------------------------------------------------------------
// Icons
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// SearchableDropdown — single-select with search
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
// MultiSelectDropdown — checkbox-based multi-select
// ---------------------------------------------------------------------------

function MultiSelectDropdown({
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
}: {
  options: DropdownOption[];
  value: number[];
  onChange: (val: number[]) => void;
  placeholder: string;
  searchPlaceholder: string;
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

  function toggle(id: number) {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  }

  const selectedLabels = options
    .filter((o) => value.includes(o.id))
    .map((o) => o.label);

  const buttonLabel =
    selectedLabels.length === 0
      ? placeholder
      : selectedLabels.length === 1
      ? selectedLabels[0]
      : `${selectedLabels.length} selected`;

  return (
    <div ref={containerRef} className="relative flex-1 min-w-48">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-500"
      >
        <span className="truncate">
          {buttonLabel}
        </span>
        <div className="flex shrink-0 items-center gap-1">
          {value.length > 0 && (
            <span className="rounded-full bg-zinc-200 px-1.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
              {value.length}
            </span>
          )}
          <ChevronDown className="h-4 w-4 text-zinc-400" />
        </div>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-full min-w-56 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
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
          <ul className="max-h-64 overflow-y-auto py-1">
            {value.length > 0 && (
              <li
                onClick={() => onChange([])}
                className="cursor-pointer border-b border-zinc-100 px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-500 dark:hover:bg-zinc-800"
              >
                Clear selection
              </li>
            )}
            {filtered.map((o) => {
              const checked = value.includes(o.id);
              return (
                <li
                  key={o.id}
                  onClick={() => toggle(o.id)}
                  className={
                    "flex cursor-pointer items-center gap-2.5 px-3 py-2 text-sm transition-colors " +
                    (checked
                      ? "bg-zinc-50 text-zinc-900 dark:bg-zinc-800/60 dark:text-zinc-50"
                      : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800")
                  }
                >
                  <span
                    className={
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded border " +
                      (checked
                        ? "border-zinc-900 bg-zinc-900 dark:border-zinc-50 dark:bg-zinc-50"
                        : "border-zinc-300 dark:border-zinc-600")
                    }
                  >
                    {checked && (
                      <CheckIcon className="h-3 w-3 text-white dark:text-zinc-900" />
                    )}
                  </span>
                  <span className="truncate">{o.label}</span>
                </li>
              );
            })}
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
// FiltersBar
// ---------------------------------------------------------------------------

export function FiltersBar({
  makes,
  allModels,
  years,
  modelYearPairs,
  modules,
  vehicleInterfaces,
  currentMakeId,
  currentModelId,
  currentYearId,
  currentModuleId,
  currentInterfaceIds,
}: FiltersBarProps) {
  const router = useRouter();

  const [makeId, setMakeId]             = useState<number | null>(currentMakeId);
  const [modelId, setModelId]           = useState<number | null>(currentModelId);
  const [yearId, setYearId]             = useState<number | null>(currentYearId);
  const [moduleId, setModuleId]         = useState<number | null>(currentModuleId);
  const [interfaceIds, setInterfaceIds] = useState<number[]>(currentInterfaceIds);

  function navigate(
    mk: number | null,
    mo: number | null,
    yr: number | null,
    md: number | null,
    ifaces: number[]
  ) {
    const params = new URLSearchParams();
    if (mk !== null)       params.set("make_id",       String(mk));
    if (mo !== null)       params.set("model_id",      String(mo));
    if (yr !== null)       params.set("year_id",       String(yr));
    if (md !== null)       params.set("module_id",     String(md));
    if (ifaces.length > 0) params.set("interface_ids", ifaces.join(","));
    router.push(`/?${params.toString()}`);
  }

  function handleMakeChange(id: number | null) {
    setMakeId(id);
    setModelId(null);
    setYearId(null);
    navigate(id, null, null, moduleId, interfaceIds);
  }

  function handleModelChange(id: number | null) {
    const newYearId =
      id !== null && yearId !== null &&
      modelYearPairs.some((p) => p.model_id === id && p.year_id === yearId)
        ? yearId
        : null;
    setModelId(id);
    setYearId(newYearId);
    navigate(makeId, id, newYearId, moduleId, interfaceIds);
  }

  function handleYearChange(id: number | null) {
    setYearId(id);
    navigate(makeId, modelId, id, moduleId, interfaceIds);
  }

  function handleModuleChange(id: number | null) {
    setModuleId(id);
    navigate(makeId, modelId, yearId, id, interfaceIds);
  }

  function handleInterfaceChange(ids: number[]) {
    setInterfaceIds(ids);
    navigate(makeId, modelId, yearId, moduleId, ids);
  }

  function handleClear() {
    setMakeId(null);
    setModelId(null);
    setYearId(null);
    setModuleId(null);
    setInterfaceIds([]);
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

  const hasActiveFilters =
    makeId !== null || modelId !== null || yearId !== null ||
    moduleId !== null || interfaceIds.length > 0;

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

        {/* Module */}
        <div className="flex min-w-44 flex-1 flex-col gap-1">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Module
          </label>
          <select
            value={moduleId ?? ""}
            onChange={(e) =>
              handleModuleChange(e.target.value ? Number(e.target.value) : null)
            }
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-500"
          >
            <option value="">All modules</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Interface (multi-select) */}
        <div className="flex min-w-48 flex-1 flex-col gap-1">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Interface
          </label>
          <MultiSelectDropdown
            options={vehicleInterfaces.map((vi) => ({ id: vi.id, label: vi.name }))}
            value={interfaceIds}
            onChange={handleInterfaceChange}
            placeholder="All interfaces"
            searchPlaceholder="Search interfaces…"
          />
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
