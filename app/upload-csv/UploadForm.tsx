"use client";

import { useRef, useState } from "react";
import { CSV_FIELDS, type CsvFieldKey } from "@/lib/csv-fields";

type Status =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success"; inserted: number; filename: string }
  | { type: "error"; message: string };

type Step = "pick" | "map";

export function UploadForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<Step>("pick");
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<CsvFieldKey, string>>({} as Record<CsvFieldKey, string>);
  const [status, setStatus] = useState<Status>({ type: "idle" });

  function resetFile() {
    setFile(null);
    setStep("pick");
    setHeaders([]);
    setMapping({} as Record<CsvFieldKey, string>);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setStatus({ type: "idle" });
    setStep("pick");
    setHeaders([]);

    if (!f) return;

    setStatus({ type: "loading" });
    const formData = new FormData();
    formData.append("file", f);

    try {
      const res = await fetch("/api/upload-csv/preview", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) {
        setStatus({ type: "error", message: json.detail ?? json.error ?? "Could not read headers." });
        return;
      }
      setHeaders(json.headers as string[]);
      setMapping(json.suggested as Record<CsvFieldKey, string>);
      setStep("map");
      setStatus({ type: "idle" });
    } catch (err) {
      setStatus({ type: "error", message: String(err) });
    }
  }

  function setField(key: CsvFieldKey, csvHeader: string) {
    setMapping((prev) => ({ ...prev, [key]: csvHeader }));
  }

  const mappedCount = CSV_FIELDS.filter((f) => mapping[f.key]).length;
  const usedHeaders = new Set(CSV_FIELDS.map((f) => mapping[f.key]).filter(Boolean));

  async function handleImport() {
    if (!file) return;
    setStatus({ type: "loading" });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mapping", JSON.stringify(mapping));

    try {
      const res = await fetch("/api/upload-csv", { method: "POST", body: formData });
      const json = await res.json();

      if (!res.ok) {
        setStatus({ type: "error", message: json.detail ?? json.error ?? "Upload failed." });
      } else {
        setStatus({ type: "success", inserted: json.inserted, filename: file.name });
        resetFile();
      }
    } catch (err) {
      setStatus({ type: "error", message: String(err) });
    }
  }

  const isLoading = status.type === "loading";

  return (
    <div className="space-y-6">
      <label
        className={[
          "flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 cursor-pointer transition-colors",
          file
            ? "border-blue-600 bg-blue-950/20"
            : "border-gray-700 hover:border-gray-500 bg-gray-900/40",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="sr-only"
          onChange={handleFileChange}
          disabled={isLoading}
        />
        <svg className="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {file ? (
          <div className="text-center">
            <p className="text-sm font-medium text-blue-400">{file.name}</p>
            <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB — click to change</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-300">Click to select a CSV file</p>
            <p className="text-xs text-gray-600 mt-1">.csv files only</p>
          </div>
        )}
      </label>

      {step === "map" && (
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-200">Map columns</h3>
            <p className="text-xs text-gray-500 mt-1">
              Match each internal field to a header from the file. Unmapped fields are skipped.
              {headers.length > 0 && (
                <> File has {headers.length} header{headers.length === 1 ? "" : "s"}.</>
              )}
            </p>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-4 py-2.5 text-left">Internal field</th>
                  <th className="px-4 py-2.5 text-left">CSV header</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {CSV_FIELDS.map((field) => (
                  <tr key={field.key}>
                    <td className="px-4 py-2">
                      <p className="text-gray-200">{field.label}</p>
                      <p className="font-mono text-[10px] text-gray-600">{field.key}</p>
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={mapping[field.key] ?? ""}
                        onChange={(e) => setField(field.key, e.target.value)}
                        className="w-full bg-gray-950 border border-gray-700 rounded-md px-2 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-blue-600"
                      >
                        <option value="">— skip —</option>
                        {headers.map((h) => (
                          <option
                            key={h}
                            value={h}
                            disabled={usedHeaders.has(h) && mapping[field.key] !== h}
                          >
                            {h}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500">{mappedCount} of {CSV_FIELDS.length} fields mapped</p>
        </div>
      )}

      {step === "map" && (
        <button
          onClick={handleImport}
          disabled={!file || isLoading || mappedCount === 0}
          className="w-full py-3 px-6 rounded-lg text-sm font-semibold transition-colors
            bg-blue-600 hover:bg-blue-500 text-white
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Importing…
            </span>
          ) : `Import CSV (${mappedCount} columns)`}
        </button>
      )}

      {status.type === "success" && (
        <div className="rounded-lg border border-green-800 bg-green-950/30 px-5 py-4">
          <p className="text-green-400 font-semibold text-sm">Upload successful</p>
          <p className="text-green-300/70 text-xs mt-1">
            {status.filename} — <span className="font-mono">{status.inserted}</span> rows inserted
          </p>
        </div>
      )}

      {status.type === "error" && (
        <div className="rounded-lg border border-red-800 bg-red-950/30 px-5 py-4">
          <p className="text-red-400 font-semibold text-sm">Upload failed</p>
          <p className="text-red-300/70 text-xs mt-1 font-mono break-all">{status.message}</p>
        </div>
      )}
    </div>
  );
}
