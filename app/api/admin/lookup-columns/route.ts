import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { mergeWithDefaults } from "@/lib/lookup-columns";
import { DEFAULT_LOOKUP_COLUMNS } from "@/lib/vehicle-types";

export async function PUT(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const incoming = Array.isArray(body.columns) ? body.columns : null;
  if (!incoming) {
    return NextResponse.json({ error: "columns array is required." }, { status: 400 });
  }

  const columns = mergeWithDefaults(
    incoming.map((c: { key?: string; visible?: boolean }) => ({
      key: String(c.key ?? ""),
      label: "",
      visible: Boolean(c.visible),
    }))
  );

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM lookup_column_config");
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      const def = DEFAULT_LOOKUP_COLUMNS.find((d) => d.key === col.key)!;
      await client.query(
        `INSERT INTO lookup_column_config (key, label, position, visible)
         VALUES ($1, $2, $3, $4)`,
        [col.key, def.label, i, col.visible]
      );
    }
    await client.query("COMMIT");
    return NextResponse.json({ ok: true, columns });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[lookup-columns] save error:", err);
    return NextResponse.json({ error: "Failed to save column config." }, { status: 500 });
  } finally {
    client.release();
  }
}
