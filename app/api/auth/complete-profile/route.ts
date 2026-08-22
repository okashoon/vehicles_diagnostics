import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const company = typeof body?.company === "string" ? body.company.trim() : "";

  if (!name || !company) {
    return NextResponse.json(
      { error: "Name and company are required." },
      { status: 400 }
    );
  }

  try {
    await pool.query("UPDATE users SET name = $2, company = $3 WHERE id = $1", [
      session.userId,
      name,
      company,
    ]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[complete-profile] error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
