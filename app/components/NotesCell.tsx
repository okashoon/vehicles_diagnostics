"use client";

import { useEffect, useState } from "react";

function firstTwoWords(text: string): { preview: string; truncated: boolean } {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 2) return { preview: words.join(" "), truncated: false };
  return { preview: `${words.slice(0, 2).join(" ")}…`, truncated: true };
}

type Props = {
  text: string | null;
  emptyClassName?: string;
  buttonClassName?: string;
};

export function NotesCell({ text, emptyClassName, buttonClassName }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!text?.trim()) {
    return <span className={emptyClassName}>—</span>;
  }

  const { preview, truncated } = firstTwoWords(text);

  if (!truncated) {
    return <span>{preview}</span>;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`cursor-pointer ${buttonClassName ?? "underline decoration-dotted underline-offset-2 hover:opacity-80"}`}
        title="View full notes"
      >
        {preview}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Model notes"
        >
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <div className="relative z-10 flex max-h-[80vh] w-full max-w-lg flex-col border border-gray-700 bg-gray-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
              <h3 className="text-sm font-semibold tracking-wide text-gray-200">Model Notes</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-1 text-gray-400 hover:text-white"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto px-4 py-4 text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">
              {text}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
