import { redirect } from "next/navigation";
import Link from "next/link";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";

interface UserRow {
  id: number;
  email: string;
  name: string | null;
  provider: string;
  role: string;
  email_verified: boolean;
  created_at: string;
  last_login: string | null;
}

type Filter = "verified" | "google" | "email" | null;

async function getUser(userId: number): Promise<{ email: string; name: string | null; role: string } | null> {
  const res = await pool.query("SELECT email, name, role FROM users WHERE id = $1", [userId]);
  return res.rows[0] ?? null;
}

async function getAllUsers(): Promise<UserRow[]> {
  const res = await pool.query(`
    SELECT id, email, name, provider, role, email_verified, created_at, last_login
    FROM users
    ORDER BY created_at DESC
  `);
  return res.rows;
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function applyFilter(users: UserRow[], filter: Filter): UserRow[] {
  if (filter === "verified") return users.filter(u => u.email_verified);
  if (filter === "google")   return users.filter(u => u.provider === "google");
  if (filter === "email")    return users.filter(u => u.provider === "email");
  return users;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/");

  const user = await getUser(session.userId);
  if (!user || user.role !== "admin") redirect("/");

  const { filter: rawFilter } = await searchParams;
  const filter: Filter = (["verified", "google", "email"].includes(rawFilter ?? "")
    ? rawFilter
    : null) as Filter;

  const allUsers = await getAllUsers();
  const filteredUsers = applyFilter(allUsers, filter);

  const verified    = allUsers.filter(u => u.email_verified).length;
  const googleUsers = allUsers.filter(u => u.provider === "google").length;
  const emailUsers  = allUsers.filter(u => u.provider === "email").length;

  const stats = [
    { label: "Total Users",      value: allUsers.length, color: "text-white",        filterKey: 'all',        activeRing: "ring-gray-500" },
    { label: "Verified",         value: verified,         color: "text-green-400",   filterKey: "verified",  activeRing: "ring-green-500" },
    { label: "Google OAuth",     value: googleUsers,      color: "text-blue-400",    filterKey: "google",    activeRing: "ring-blue-500" },
    { label: "Email / Password", value: emailUsers,       color: "text-yellow-400",  filterKey: "email",     activeRing: "ring-yellow-500" },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">
              {user.name && <span className="text-gray-200 font-medium">{user.name} · </span>}
              {user.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/upload-csv"
              className="text-sm bg-blue-900/40 text-blue-400 border border-blue-800 hover:bg-blue-900/70 px-3 py-1.5 rounded-lg transition-colors"
            >
              Upload CSV
            </a>
            <span className="text-xs bg-red-900/40 text-red-400 border border-red-800 px-3 py-1 rounded-full font-mono">
              ADMIN
            </span>
          </div>
        </div>

        {/* Stat cards — clickable filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(stat => {
            const isActive = filter === stat.filterKey;
            // clicking an active card clears the filter; clicking inactive sets it
            const href = isActive || stat.filterKey === null
              ? "/admin"
              : `/admin?filter=${stat.filterKey}`;

            return (
              <Link
                key={stat.label}
                href={href}
                className={[
                  "bg-gray-900 border rounded-lg p-4 transition-all",
                  stat.filterKey === null
                    ? "cursor-default pointer-events-none border-gray-800"
                    : isActive
                      ? `border-gray-600 ring-1 ${stat.activeRing}`
                      : "border-gray-800 hover:border-gray-600 hover:bg-gray-800/60",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">{stat.label}</p>
                  {isActive && (
                    <span className="text-[10px] text-gray-400 border border-gray-700 px-1.5 py-0.5 rounded font-mono shrink-0">
                      ✕ clear
                    </span>
                  )}
                </div>
                <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              </Link>
            );
          })}
        </div>

        {/* Users table */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              {filter ? (
                <>
                  <span className="text-gray-500">Filtered: </span>
                  <span className="text-white">{filter}</span>
                  <span className="text-gray-500"> — {filteredUsers.length} of {allUsers.length} users</span>
                </>
              ) : (
                <>All Users ({allUsers.length})</>
              )}
            </h2>
            {filter && (
              <Link href="/admin" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                Clear filter ✕
              </Link>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 text-left">ID</th>
                  <th className="px-5 py-3 text-left">Email</th>
                  <th className="px-5 py-3 text-left">Name</th>
                  <th className="px-5 py-3 text-left">Provider</th>
                  <th className="px-5 py-3 text-left">Role</th>
                  <th className="px-5 py-3 text-left">Verified</th>
                  <th className="px-5 py-3 text-left">Last Login</th>
                  <th className="px-5 py-3 text-left">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-5 py-3 text-gray-500 font-mono text-xs">{u.id}</td>
                    <td className="px-5 py-3 text-gray-100">{u.email}</td>
                    <td className="px-5 py-3 text-gray-300">{u.name ?? <span className="text-gray-600 italic">—</span>}</td>
                    <td className="px-5 py-3">
                      {u.provider === "google" ? (
                        <span className="inline-flex items-center gap-1.5 text-xs bg-blue-900/30 text-blue-400 border border-blue-800/50 px-2 py-0.5 rounded-full">
                          Google
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs bg-gray-800 text-gray-400 border border-gray-700 px-2 py-0.5 rounded-full">
                          Email
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {u.role === "admin" ? (
                        <span className="text-xs bg-red-900/30 text-red-400 border border-red-800/50 px-2 py-0.5 rounded-full">
                          admin
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">user</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {u.email_verified ? (
                        <span className="text-green-400 text-xs font-medium">✓ Yes</span>
                      ) : (
                        <span className="text-yellow-500 text-xs font-medium">Pending</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">{formatDate(u.last_login)}</td>
                    <td className="px-5 py-3 text-gray-400 text-xs">{formatDate(u.created_at)}</td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-10 text-center text-gray-600">
                      No users match this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
