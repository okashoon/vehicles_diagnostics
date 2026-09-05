"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "w-full border border-[#00ff41]/30 bg-[#111111] px-3 py-2 text-sm text-[#e0ffe0] outline-none placeholder:text-[#00cc33]/30 focus:border-[#00ff41]";

function splitName(full: string): { first: string; last: string } {
  const trimmed = full.trim();
  if (!trimmed) return { first: "", last: "" };
  const space = trimmed.indexOf(" ");
  if (space === -1) return { first: trimmed, last: "" };
  return { first: trimmed.slice(0, space), last: trimmed.slice(space + 1).trim() };
}

export function CompleteProfileForm({
  initialName,
  initialCompany,
}: {
  initialName: string;
  initialCompany: string;
}) {
  const router = useRouter();
  const split = splitName(initialName);
  const [firstName, setFirstName] = useState(split.first);
  const [lastName, setLastName] = useState(split.last);
  const [company, setCompany] = useState(initialCompany);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName.trim()} ${lastName.trim()}`.trim(),
          company,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      window.dispatchEvent(new Event("auth-change"));
      router.replace("/lookup");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-widest text-[#00cc33]/70">
            First name
          </label>
          <input
            type="text"
            autoComplete="given-name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-widest text-[#00cc33]/70">
            Last name
          </label>
          <input
            type="text"
            autoComplete="family-name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-widest text-[#00cc33]/70">
          Company
        </label>
        <input
          type="text"
          autoComplete="organization"
          required
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Your company"
          className={inputClass}
        />
      </div>

      {error && (
        <p className="border border-red-900 bg-red-950/40 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="mt-2 border border-[#00ff41]/40 bg-[#00ff41]/10 py-2.5 text-sm font-bold uppercase tracking-widest text-[#00ff41] transition-colors hover:bg-[#00ff41]/20 disabled:opacity-50 cursor-pointer"
      >
        {saving ? "Saving…" : "Continue"}
      </button>
    </form>
  );
}
