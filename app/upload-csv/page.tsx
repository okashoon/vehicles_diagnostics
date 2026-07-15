import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { UploadForm } from "./UploadForm";

export default async function UploadCsvPage() {
  if (!(await requireAdmin())) redirect("/");

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-start justify-center p-6">
      <div className="w-full max-w-xl space-y-8 mt-16">

        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-white">Upload Vehicle CSV</h1>
            <span className="text-xs bg-red-900/40 text-red-400 border border-red-800 px-2 py-0.5 rounded-full font-mono">
              ADMIN
            </span>
          </div>
          <p className="text-gray-400 text-sm">
            Uploading a new CSV will drop and recreate the vehicles table, then insert all rows from the file.
          </p>
        </div>

        {/* Upload card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <UploadForm />
        </div>

        {/* Back link */}
        <a href="/admin" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors">
          ← Back to Admin
        </a>
      </div>
    </div>
  );
}
