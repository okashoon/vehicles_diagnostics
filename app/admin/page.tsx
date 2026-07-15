import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";

interface UserRow {
  id: number;
  email: string;
  name: string | null;
  provider: string;
  email_verified: boolean;
  created_at: string;
  last_login: string | null;
}

async function getAdminEmail(userId: number): Promise<string | null> {
  const res = await pool.query("SELECT email FROM users WHERE id = $1", [userId]);
  return res.rows[0]?.email ?? null;
}

async function getAllUsers(): Promise<UserRow[]> {
  const res = await pool.query(`
    SELECT id, email, name, provider, email_verified, created_at, last_login
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

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/");

  const email = await getAdminEmail(session.userId);
  const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map(e => e.trim().toLowerCase());

  if (!email || !adminEmails.includes(email.toLowerCase())) {
    redirect("/");
  }

  const users = await getAllUsers();

  const verified   = users.filter(u => u.email_verified).length;
  const googleUsers = users.filter(u => u.provider === "google").length;
  const emailUsers  = users.filter(u => u.provider === "email").length;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Signed in as {email}</p>
          </div>
          <span className="text-xs bg-red-900/40 text-red-400 border border-red-800 px-3 py-1 rounded-full font-mono">
            ADMIN
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Users",     value: users.length,  color: "text-white" },
            { label: "Verified",        value: verified,       color: "text-green-400" },
            { label: "Google OAuth",    value: googleUsers,    color: "text-blue-400" },
            { label: "Email / Password",value: emailUsers,     color: "text-yellow-400" },
          ].map(stat => (
            <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider">{stat.label}</p>
              <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Users table */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              All Users ({users.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 text-left">ID</th>
                  <th className="px-5 py-3 text-left">Email</th>
                  <th className="px-5 py-3 text-left">Name</th>
                  <th className="px-5 py-3 text-left">Provider</th>
                  <th className="px-5 py-3 text-left">Verified</th>
                  <th className="px-5 py-3 text-left">Last Login</th>
                  <th className="px-5 py-3 text-left">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-5 py-3 text-gray-500 font-mono text-xs">{user.id}</td>
                    <td className="px-5 py-3 text-gray-100">{user.email}</td>
                    <td className="px-5 py-3 text-gray-300">{user.name ?? <span className="text-gray-600 italic">—</span>}</td>
                    <td className="px-5 py-3">
                      {user.provider === "google" ? (
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
                      {user.email_verified ? (
                        <span className="text-green-400 text-xs font-medium">✓ Yes</span>
                      ) : (
                        <span className="text-yellow-500 text-xs font-medium">Pending</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">{formatDate(user.last_login)}</td>
                    <td className="px-5 py-3 text-gray-400 text-xs">{formatDate(user.created_at)}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-gray-600">
                      No users found.
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
