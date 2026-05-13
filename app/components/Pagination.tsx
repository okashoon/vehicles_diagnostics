import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  perPage: number;
  /** Current filter params — preserved when navigating between pages. */
  searchParams: Record<string, string>;
};

function pageUrl(searchParams: Record<string, string>, p: number): string {
  const params = new URLSearchParams({ ...searchParams, page: String(p) });
  return `/?${params.toString()}`;
}

/** Returns a compact sequence of page numbers with "..." gaps. */
function pageSequence(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const result: (number | "...")[] = [1];

  if (current > 3) result.push("...");

  const start = Math.max(2, current - 2);
  const end = Math.min(total - 1, current + 2);
  for (let i = start; i <= end; i++) result.push(i);

  if (current < total - 1) result.push("...");

  result.push(total);
  return result;
}

const BASE_BTN =
  "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium transition-colors";
const ACTIVE_BTN =
  BASE_BTN + " bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900";
const IDLE_BTN =
  BASE_BTN +
  " border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800";
const DISABLED_BTN =
  BASE_BTN +
  " cursor-not-allowed border border-zinc-200 bg-white text-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-600";

export function Pagination({
  page,
  totalPages,
  total,
  perPage,
  searchParams,
}: PaginationProps) {
  if (totalPages <= 1 && total <= perPage) return null;

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  const pages = pageSequence(page, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Showing{" "}
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          {from.toLocaleString()}&ndash;{to.toLocaleString()}
        </span>{" "}
        of{" "}
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          {total.toLocaleString()}
        </span>{" "}
        results
      </p>

      <div className="flex items-center gap-1">
        {/* Previous */}
        {page > 1 ? (
          <Link href={pageUrl(searchParams, page - 1)} className={IDLE_BTN}>
            &larr;
          </Link>
        ) : (
          <span className={DISABLED_BTN}>&larr;</span>
        )}

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="inline-flex h-8 min-w-8 items-center justify-center text-sm text-zinc-400"
            >
              &hellip;
            </span>
          ) : (
            <Link
              key={p}
              href={pageUrl(searchParams, p)}
              className={p === page ? ACTIVE_BTN : IDLE_BTN}
            >
              {p}
            </Link>
          )
        )}

        {/* Next */}
        {page < totalPages ? (
          <Link href={pageUrl(searchParams, page + 1)} className={IDLE_BTN}>
            &rarr;
          </Link>
        ) : (
          <span className={DISABLED_BTN}>&rarr;</span>
        )}
      </div>
    </div>
  );
}
