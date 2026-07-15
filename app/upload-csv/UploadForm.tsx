"use client";

import { useRef, useState } from "react";

type Status =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success"; inserted: number; filename: string }
  | { type: "error"; message: string };

export function UploadForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>({ type: "idle" });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setStatus({ type: "idle" });
  }

  async function handleUpload() {
    if (!file) return;
    setStatus({ type: "loading" });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload-csv", { method: "POST", body: formData });
      const json = await res.json();

      if (!res.ok) {
        setStatus({ type: "error", message: json.detail ?? json.error ?? "Upload failed." });
      } else {
        setStatus({ type: "success", inserted: json.inserted, filename: file.name });
        setFile(null);
        if (inputRef.current) inputRef.current.value = "";
      }
    } catch (err) {
      setStatus({ type: "error", message: String(err) });
    }
  }

  const isLoading = status.type === "loading";

  return (
    <div className="space-y-6">
      {/* Drop zone / file picker */}
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

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={!file || isLoading}
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
            Uploading…
          </span>
        ) : "Upload CSV"}
      </button>

      {/* Result */}
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
