"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ROLES = ["user", "admin"] as const;

export function RoleSelect({ userId, role }: { userId: number; role: string }) {
  const router = useRouter();
  const [value, setValue] = useState(role);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function change(next: string) {
    const previous = value;
    setValue(next);
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users/role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to update role.");
      router.refresh();
    } catch (err) {
      setValue(previous);
      setError(err instanceof Error ? err.message : "Failed to update role.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-1">
      <select
        value={value}
        disabled={saving}
        onChange={(e) => change(e.target.value)}
        className={[
          "rounded-md border bg-gray-800 px-2 py-1 text-xs cursor-pointer transition-colors",
          "focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50",
          value === "admin"
            ? "border-red-800/50 text-red-400"
            : "border-gray-700 text-gray-300",
        ].join(" ")}
      >
        {ROLES.map((r) => (
          <option key={r} value={r} className="bg-gray-800 text-gray-200">
            {r}
          </option>
        ))}
      </select>
      {error && <p className="text-[10px] text-red-400 max-w-[10rem]">{error}</p>}
    </div>
  );
}
