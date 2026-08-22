"use client";

import { useMemo, useState } from "react";
import {
  CABLE_KINDS,
  clusterCables,
  extractCableNumbers,
  type CableKind,
  type CableRecord,
} from "@/lib/cable-utils";

export function AdminCablesTab({ initialCables }: { initialCables: CableRecord[] }) {
  const [cables, setCables] = useState(initialCables);
  const [activeKind, setActiveKind] = useState<CableKind>("obd");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function rescan() {
    setScanning(true);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/cables/scan", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Scan failed.");
      setCables(data.cables);
      setNotice(`Found ${data.added.obd} new OBD and ${data.added.d2m} new D2M cable names.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed.");
    } finally {
      setScanning(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-gray-400 max-w-2xl">
          OBD and D2M cables are analyzed separately. Names are grouped when they carry the
          same cable number(s) — merging rewrites the vehicle rows to the canonical name and
          keeps every old spelling as an alias, so future CSV imports resolve automatically.
        </p>
        <button
          onClick={rescan}
          disabled={scanning}
          className="shrink-0 text-sm bg-blue-900/40 text-blue-400 border border-blue-800 hover:bg-blue-900/70 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          {scanning ? "Scanning…" : "Rescan vehicles"}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-lg px-4 py-2">
          {error}
        </p>
      )}
      {notice && (
        <p className="text-sm text-gray-300 bg-gray-900 border border-gray-800 rounded-lg px-4 py-2">
          {notice}
        </p>
      )}

      <div className="flex gap-2">
        {CABLE_KINDS.map(({ kind, label }) => {
          const count = cables.filter((c) => c.kind === kind).length;
          const isActive = activeKind === kind;
          return (
            <button
              key={kind}
              onClick={() => setActiveKind(kind)}
              className={[
                "px-4 py-2 text-sm font-medium rounded-lg border transition-colors cursor-pointer",
                isActive
                  ? "bg-gray-800 border-gray-600 text-white"
                  : "bg-gray-900 border-gray-800 text-gray-500 hover:text-gray-300 hover:border-gray-700",
              ].join(" ")}
            >
              {label}
              <span className={`ml-2 font-mono text-xs ${isActive ? "text-gray-400" : "text-gray-600"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {CABLE_KINDS.filter(({ kind }) => kind === activeKind).map(({ kind, label }) => (
        <CategorySection
          key={kind}
          label={label}
          cables={cables.filter((c) => c.kind === kind)}
          onMerged={setCables}
          onError={setError}
        />
      ))}
    </div>
  );
}

function CategorySection({
  label,
  cables,
  onMerged,
  onError,
}: {
  label: string;
  cables: CableRecord[];
  onMerged: (cables: CableRecord[]) => void;
  onError: (message: string | null) => void;
}) {
  const { clusters, uniques } = useMemo(() => clusterCables(cables), [cables]);
  const [canonicalByCluster, setCanonicalByCluster] = useState<Record<string, number>>({});
  const [mergingKey, setMergingKey] = useState<string | null>(null);
  const [showUniques, setShowUniques] = useState(false);

  async function merge(clusterKey: string, canonicalId: number, ids: number[]) {
    setMergingKey(clusterKey);
    onError(null);
    try {
      const res = await fetch("/api/admin/cables/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ canonicalId, mergeIds: ids }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Merge failed.");
      onMerged(data.cables);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Merge failed.");
    } finally {
      setMergingKey(null);
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          {label}
          <span className="text-gray-500 normal-case font-normal"> — {cables.length} distinct</span>
        </h2>
        <span className="text-xs text-gray-500 font-mono">
          {clusters.length} group{clusters.length === 1 ? "" : "s"} to review
        </span>
      </div>

      <div className="divide-y divide-gray-800/60">
        {clusters.length === 0 && (
          <p className="px-5 py-8 text-center text-gray-600 text-sm">
            {cables.length === 0
              ? "No cable names found for this category. Try a rescan."
              : "Nothing to merge — every cable number is unique."}
          </p>
        )}

        {clusters.map((cluster) => {
          const canonicalId = canonicalByCluster[cluster.key] ?? cluster.cables[0].id;
          const ids = cluster.cables.map((c) => c.id).filter((id) => id !== canonicalId);
          const busy = mergingKey === cluster.key;

          return (
            <div key={cluster.key} className="px-5 py-4 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-mono text-gray-400">
                  {cluster.kind === "number" ? (
                    <>
                      Cable #{cluster.numbers.join(" + #")}
                      <span className="text-gray-600"> · {cluster.cables.length} spellings</span>
                    </>
                  ) : (
                    <>
                      Identical text
                      <span className="text-gray-600"> · {cluster.cables.length} entries</span>
                    </>
                  )}
                </span>
                <button
                  onClick={() => merge(cluster.key, canonicalId, ids)}
                  disabled={busy || ids.length === 0}
                  className="shrink-0 text-xs bg-green-900/40 text-green-400 border border-green-800 hover:bg-green-900/70 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  {busy ? "Merging…" : `Merge ${ids.length} into selected`}
                </button>
              </div>

              <div className="space-y-1.5">
                {cluster.cables.map((cable) => (
                  <label
                    key={cable.id}
                    className="flex items-start gap-3 text-sm cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name={`canonical-${cluster.key}`}
                      checked={canonicalId === cable.id}
                      onChange={() =>
                        setCanonicalByCluster((prev) => ({ ...prev, [cluster.key]: cable.id }))
                      }
                      className="mt-1 accent-green-500 cursor-pointer"
                    />
                    <span className="flex-1 min-w-0">
                      <span
                        className={
                          canonicalId === cable.id
                            ? "text-white"
                            : "text-gray-400 group-hover:text-gray-200"
                        }
                      >
                        {cable.name}
                      </span>
                      <span className="text-gray-600 text-xs font-mono ml-2">
                        {cable.vehicleCount} row{cable.vehicleCount === 1 ? "" : "s"}
                      </span>
                      {cable.aliases.length > 1 && (
                        <span className="block text-[11px] text-gray-600 mt-0.5">
                          aliases: {cable.aliases.filter((a) => a !== cable.name).join(" | ")}
                        </span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {uniques.length > 0 && (
        <div className="border-t border-gray-800">
          <button
            onClick={() => setShowUniques((v) => !v)}
            className="w-full px-5 py-3 text-left text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
          >
            {showUniques ? "▾" : "▸"} {uniques.length} cable name
            {uniques.length === 1 ? "" : "s"} with no match
          </button>
          {showUniques && (
            <ul className="px-5 pb-4 space-y-1">
              {uniques.map((cable) => (
                <li key={cable.id} className="text-sm text-gray-400 flex items-baseline gap-2">
                  <span className="text-gray-600 font-mono text-[11px] shrink-0">
                    {extractCableNumbers(cable.name).length > 0
                      ? `#${extractCableNumbers(cable.name).join(",")}`
                      : "no #"}
                  </span>
                  <span className="flex-1">{cable.name}</span>
                  <span className="text-gray-600 font-mono text-[11px] shrink-0">
                    {cable.vehicleCount}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
