import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSession, requireAdmin } from "@/lib/auth";

const ROLES = ["user", "admin"] as const;

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || !(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const userId = Number(body?.userId);
  const role = String(body?.role ?? "");

  if (!userId || !ROLES.includes(role as (typeof ROLES)[number])) {
    return NextResponse.json(
      { error: `userId and a role of ${ROLES.join(" or ")} are required.` },
      { status: 400 }
    );
  }

  // Blocking self-edits keeps an admin from removing their own last access.
  if (session.userId === userId) {
    return NextResponse.json(
      { error: "You cannot change your own role." },
      { status: 400 }
    );
  }

  try {
    // Both rules are restated in SQL so the write cannot succeed for a
    // non-admin caller, or on the caller's own row, even if a future
    // refactor loses the checks above.
    const { rowCount } = await pool.query(
      `UPDATE users SET role = $2
       WHERE id = $1
         AND id <> $3
         AND EXISTS (SELECT 1 FROM users actor WHERE actor.id = $3 AND actor.role = 'admin')`,
      [userId, role, session.userId]
    );
    if (!rowCount) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, userId, role });
  } catch (err) {
    console.error("[admin/users/role] error:", err);
    return NextResponse.json({ error: "Failed to update role." }, { status: 500 });
  }
}
