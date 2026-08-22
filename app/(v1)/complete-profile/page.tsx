import { redirect } from "next/navigation";
import { getProfileStatus, getSession } from "@/lib/auth";
import { CompleteProfileForm } from "./CompleteProfileForm";

export default async function CompleteProfilePage() {
  const session = await getSession();
  if (!session) redirect("/lookup");

  const profile = await getProfileStatus(session.userId);
  if (profile.complete) redirect("/lookup");

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8 font-mono text-[#e0ffe0]">
      <div className="mx-auto max-w-md pt-12">
        <p className="mb-2 text-xs tracking-[0.3em] text-[#00ff41]/50">// PROFILE_REQUIRED</p>
        <h1 className="text-xl font-bold uppercase tracking-widest text-[#00ff41]">
          Complete your profile
        </h1>
        <p className="mt-2 text-xs tracking-wide text-[#00cc33]/60">
          &gt; NAME AND COMPANY ARE REQUIRED BEFORE ACCESSING THE DATABASE
        </p>

        <CompleteProfileForm
          initialName={profile.name ?? ""}
          initialCompany={profile.company ?? ""}
        />
      </div>
    </div>
  );
}
