"use client";

import { useState } from "react";
import { Pagination } from "@/app/components/Pagination";
import { NotesCell } from "@/app/components/NotesCell";
import { VehicleColumnHeaders } from "@/app/components/VehicleColumnHeaders";
import type { LookupColumnConfig, VehicleRow } from "@/lib/vehicle-types";
import {
  DEFAULT_LOOKUP_COLUMNS,
  fromManagerItems,
  toManagerItems,
} from "@/lib/vehicle-types";

type Props = {
  vehicles: VehicleRow[];
  total: number;
  page: number;
  perPage: number;
  columns: LookupColumnConfig[];
};

function visBadge(visible: boolean) {
  return [
    "text-xs px-2 py-0.5 rounded-full border font-mono transition-colors disabled:opacity-40",
    visible
      ? "text-green-400 bg-green-900/20 border-green-800/50 hover:border-green-600"
      : "text-gray-500 bg-gray-800 border-gray-700 hover:border-gray-500",
  ].join(" ");
}

export function AdminDataTab({ vehicles, total, page, perPage, columns: initialColumns }: Props) {
  const [columns, setColumns] = useState<LookupColumnConfig[]>(initialColumns);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const visible = columns.filter((c) => c.visible);
  const items = toManagerItems(columns);
  const totalPages = Math.ceil(total / perPage);

  async function persist(next: LookupColumnConfig[]) {
    setColumns(next);
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/lookup-columns", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ columns: next }),
      });
      const json = await res.json();
      if (!res.ok) {
        setStatus(json.error ?? "Failed to save.");
        return;
      }
      setStatus("Saved — Lookup table updated.");
    } catch {
      setStatus("Network error.");
    } finally {
      setSaving(false);
    }
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...items];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    persist(fromManagerItems(next));
  }

  function toggleLeaf(index: number) {
    const item = items[index];
    if (item.type !== "leaf") return;
    const next = items.map((it, i) =>
      i === index && it.type === "leaf" ? { ...it, visible: !it.visible } : it
    );
    persist(fromManagerItems(next));
  }

  function toggleGroup(index: number) {
    const item = items[index];
    if (item.type !== "group") return;
    const allVisible = item.children.every((c) => c.visible);
    const next = items.map((it, i) =>
      i === index && it.type === "group"
        ? { ...it, children: it.children.map((c) => ({ ...c, visible: !allVisible })) }
        : it
    );
    persist(fromManagerItems(next));
  }

  function toggleChild(groupIndex: number, childIndex: number) {
    const next = items.map((it, i) => {
      if (i !== groupIndex || it.type !== "group") return it;
      return {
        ...it,
        children: it.children.map((c, ci) =>
          ci === childIndex ? { ...c, visible: !c.visible } : c
        ),
      };
    });
    persist(fromManagerItems(next));
  }

  function resetDefaults() {
    persist(DEFAULT_LOOKUP_COLUMNS.map((c) => ({ ...c, visible: true })));
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Lookup columns
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Reorder or hide columns. Vehicle data is not deleted — hidden columns only disappear from the Lookup table.
            </p>
          </div>
          <button
            type="button"
            onClick={resetDefaults}
            disabled={saving}
            className="text-xs text-gray-400 hover:text-gray-200 border border-gray-700 hover:border-gray-500 px-2.5 py-1 rounded transition-colors disabled:opacity-40"
          >
            Reset defaults
          </button>
        </div>

        <ul className="divide-y divide-gray-800">
          {items.map((item, i) => (
            <li key={item.type === "leaf" ? item.key : item.id} className="py-2.5">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    aria-label="Move up"
                    disabled={i === 0 || saving}
                    onClick={() => move(i, -1)}
                    className="text-[10px] text-gray-400 hover:text-white disabled:opacity-20 leading-none px-1"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    aria-label="Move down"
                    disabled={i === items.length - 1 || saving}
                    onClick={() => move(i, 1)}
                    className="text-[10px] text-gray-400 hover:text-white disabled:opacity-20 leading-none px-1"
                  >
                    ▼
                  </button>
                </div>
                <span className="font-mono text-xs text-gray-200">
                  {item.label}
                </span>
                {item.type === "leaf" ? (
                  <button
                    type="button"
                    onClick={() => toggleLeaf(i)}
                    disabled={saving || (item.visible && visible.length === 1)}
                    className={`ml-auto ${visBadge(item.visible)}`}
                  >
                    {item.visible ? "visible" : "hidden"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleGroup(i)}
                    disabled={saving}
                    className={`ml-auto ${visBadge(item.children.some((c) => c.visible))}`}
                  >
                    {item.children.every((c) => c.visible)
                      ? "visible"
                      : item.children.some((c) => c.visible)
                      ? "partial"
                      : "hidden"}
                  </button>
                )}
              </div>
              {item.type === "group" && (
                <ul className="ml-10 mt-2 space-y-1.5">
                  {item.children.map((child, ci) => (
                    <li key={child.key} className="flex items-center gap-3">
                      <span className="text-gray-600 text-xs">↳</span>
                      <span className="font-mono text-xs text-gray-400">{child.label}</span>
                      <button
                        type="button"
                        onClick={() => toggleChild(i, ci)}
                        disabled={saving || (child.visible && visible.length === 1)}
                        className={`ml-auto ${visBadge(child.visible)}`}
                      >
                        {child.visible ? "visible" : "hidden"}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {status && (
          <p className={`mt-3 text-xs ${status.startsWith("Saved") ? "text-green-400" : "text-red-400"}`}>
            {saving ? "Saving…" : status}
          </p>
        )}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Vehicles ({total.toLocaleString()})
          </h2>
        </div>
        {vehicles.length === 0 ? (
          <p className="px-5 py-10 text-center text-gray-600 text-sm">No vehicle records found.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-800">
                  <VehicleColumnHeaders columns={visible} variant="admin" />
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {vehicles.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-800/40 transition-colors">
                      {visible.map((col) => {
                        const value = row[col.key];
                        return (
                          <td
                            key={col.key}
                            className={
                              col.key === "module_location"
                                ? "px-5 py-3 text-gray-300 text-xs max-w-md whitespace-normal"
                                : "px-5 py-3 text-gray-300 text-xs max-w-xs truncate whitespace-nowrap"
                            }
                            title={col.key === "model_notes" ? undefined : (value ?? "")}
                          >
                            {col.key === "model_notes" ? (
                              <NotesCell
                                text={value}
                                emptyClassName="text-gray-600"
                                buttonClassName="underline decoration-dotted underline-offset-2 hover:text-white"
                              />
                            ) : value ? (
                              value
                            ) : (
                              <span className="text-gray-600">—</span>
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
              perPage={perPage}
              searchParams={{ tab: "data" }}
              basePath="/admin"
            />
          </>
        )}
      </div>
    </div>
  );
}
