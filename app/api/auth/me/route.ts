import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import pool from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json(null);

  const { rows } = await pool.query(
    "SELECT name, email, role FROM users WHERE id = $1",
    [session.userId]
  );

  if (!rows[0]) return NextResponse.json(null);

  return NextResponse.json({
    name:  rows[0].name  as string | null,
    email: rows[0].email as string,
    role:  rows[0].role  as string,
  });
}
