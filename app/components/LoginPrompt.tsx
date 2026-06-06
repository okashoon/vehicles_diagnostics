"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthModal } from "@/app/components/AuthModal";

export function LoginPrompt() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function handleSuccess() {
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <div className="rounded-xl border border-dashed border-zinc-300 bg-white py-20 text-center dark:border-zinc-700 dark:bg-zinc-900">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-7 w-7 text-zinc-500 dark:text-zinc-400"
          >
            <path
              fillRule="evenodd"
              d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <p className="text-base font-semibold text-zinc-700 dark:text-zinc-300">
          Sign in to view results
        </p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Create a free account or sign in to access vehicle diagnostics data.
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path
              fillRule="evenodd"
              d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M6 10a.75.75 0 0 1 .75-.75h9.546l-1.048-1.07a.75.75 0 1 1 1.004-1.116l2.5 2.25a.75.75 0 0 1 0 1.132l-2.5 2.25a.75.75 0 1 1-1.004-1.116l1.048-1.07H6.75A.75.75 0 0 1 6 10Z"
              clipRule="evenodd"
            />
          </svg>
          Sign in
        </button>
      </div>

      <AuthModal open={open} onClose={() => setOpen(false)} onSuccess={handleSuccess} />
    </>
  );
}
