"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "w-full border border-[#00ff41]/30 bg-[#111111] px-3 py-2 text-sm text-[#e0ffe0] outline-none placeholder:text-[#00cc33]/30 focus:border-[#00ff41]";

export function CompleteProfileForm({
  initialName,
  initialCompany,
}: {
  initialName: string;
  initialCompany: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
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
        body: JSON.stringify({ name, company }),
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
      <div>
        <label className="mb-1 block text-xs uppercase tracking-widest text-[#00cc33]/70">
          Name
        </label>
        <input
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className={inputClass}
        />
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
