import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listCables, scanCables } from "@/lib/cables-db";

export async function POST() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const added = await scanCables();
    const cables = await listCables();
    return NextResponse.json({ ok: true, added, cables });
  } catch (err) {
    console.error("[cables/scan] error:", err);
    return NextResponse.json({ error: "Failed to scan cable names." }, { status: 500 });
  }
}
