import { parse } from "csv-parse/sync";
import { requireAdmin } from "@/lib/auth";
import { suggestMapping } from "@/lib/csv-fields";

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Invalid multipart form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return Response.json(
      { error: 'Missing file field. Send the CSV as a form field named "file".' },
      { status: 400 }
    );
  }

  if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
    return Response.json({ error: "Uploaded file must be a CSV" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const records = parse(buffer, {
      to_line: 1,
      relax_column_count: true,
      trim: true,
      skip_empty_lines: true,
    }) as string[][];

    const headers = (records[0] ?? []).filter((h) => h.trim() !== "");
    if (headers.length === 0) {
      return Response.json({ error: "CSV has no header row." }, { status: 422 });
    }

    return Response.json({
      headers,
      suggested: suggestMapping(headers),
    });
  } catch (err) {
    return Response.json(
      { error: "Failed to read CSV headers", detail: String(err) },
      { status: 422 }
    );
  }
}
