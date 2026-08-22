import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listCables, mergeCables } from "@/lib/cables-db";

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const canonicalId = Number(body?.canonicalId);
  const mergeIds = Array.isArray(body?.mergeIds) ? body.mergeIds.map(Number) : [];

  if (!canonicalId || mergeIds.some((id: number) => !id)) {
    return NextResponse.json(
      { error: "canonicalId and mergeIds are required." },
      { status: 400 }
    );
  }

  try {
    await mergeCables(canonicalId, mergeIds);
    const cables = await listCables();
    return NextResponse.json({ ok: true, cables });
  } catch (err) {
    console.error("[cables/merge] error:", err);
    return NextResponse.json({ error: "Failed to merge cables." }, { status: 500 });
  }
}
