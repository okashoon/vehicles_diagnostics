export default function ValidationV2() {
  return (
    <main className="min-h-screen bg-[#0f1117] text-[#e2e8f0]">
      <section className="mx-auto max-w-4xl px-4 py-16 space-y-10">
        {/* Top image */}
        <img
          src="https://crashpulse.com/wp-content/uploads/2026/02/Validation_Image.webp"
          alt="SAE Validation Publication"
          className="w-full rounded-2xl border border-[#2d3748]"
        />

        {/* SAE paper link */}
        <div className="rounded-2xl border border-[#3b82f6]/20 bg-[#3b82f6]/5 p-5 flex items-start gap-3">
          <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#3b82f6]" />
          <a
            href="https://www.sae.org/papers/validation-a-legacy-compatible-vehicle-communication-interface-for-retrieval-crash-data-passenger-vehicles-2026-01-5009"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3b82f6] font-medium text-sm hover:text-[#93c5fd] hover:underline"
          >
            SAE 2026-01-5009 – Validation of a Legacy-Compatible Vehicle Communication Interface
            for the Retrieval of Crash Data from Passenger Vehicles ↗
          </a>
        </div>

        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#3b82f6]/30 bg-[#3b82f6]/10 px-3 py-1">
            <span className="text-xs font-medium text-[#93c5fd]">Peer-Reviewed</span>
          </div>
          <h1 className="text-3xl font-bold text-white">
            Testing, Validation, and Peer-Reviewed Publications
          </h1>
        </div>

        <div className="space-y-4 text-[#94a3b8] text-sm leading-relaxed">
          <p>
            At Crash Pulse Technologies, credibility isn&apos;t just a goal; it&apos;s a
            requirement.
          </p>
          <p>
            To support the forensic reliability and acceptance of the CDX, as well as its
            compatibility with existing legacy crash data hardware and software, we have conducted
            extensive beta testing, validation testing, and repeatability testing. In February of
            2026, a technical paper titled &ldquo;Validation of a Legacy-Compatible Vehicle
            Communication Interface for the Retrieval of Crash Data from Passenger
            Vehicles&rdquo; was published by SAE. A second technical paper was submitted to ARJ
            in January of 2026.
          </p>
        </div>

        <div className="rounded-2xl border border-[#2d3748] bg-[#1e2330] p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-1 w-6 rounded-full bg-[#3b82f6]" />
            <h2 className="text-base font-bold text-white">Why This Matters</h2>
          </div>
          <div className="space-y-5">
            {[
              {
                title: "Legal Admissibility",
                desc: "Peer-reviewed validation through SAE supports Daubert considerations, helping ensure that the product and its outputs are defensible in court.",
              },
              {
                title: "Technical Transparency",
                desc: "Publishing methodology and results allows independent experts to review and evaluate the work, which is a cornerstone of scientific integrity.",
              },
              {
                title: "Industry Trust",
                desc: "Submitting to respected journals such as SAE and ARJ demonstrates a commitment to evidence-based practices and establishes a higher standard of professionalism within the crash data recovery community.",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3b82f6]" />
                <div className="text-sm">
                  <span className="font-semibold text-white">{item.title}: </span>
                  <span className="text-[#94a3b8]">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[#94a3b8] text-sm leading-relaxed">
          Our mission is to provide investigators, engineers, and attorneys with tools that are not
          only powerful but provably accurate.
        </p>
      </section>

      <footer className="border-t border-[#1e2330] py-8 text-center">
        <p className="text-xs text-[#334155]">
          &copy; {new Date().getFullYear()} Crash Pulse Technologies. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}
