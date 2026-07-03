export default function ValidationV3() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e0ffe0] font-mono">
      <section className="mx-auto max-w-4xl px-4 py-16 space-y-10">

        <img
          src="https://crashpulse.com/wp-content/uploads/2026/02/Validation_Image.webp"
          alt="SAE Validation Publication"
          className="w-full border border-[#00ff41]/20"
        />

        {/* SAE paper link */}
        <div className="border border-[#00ff41]/40 bg-[#00ff41]/5 p-5 flex items-start gap-3">
          <span className="text-[#00ff41] shrink-0 text-xs mt-0.5">&gt;</span>
          <a
            href="https://www.sae.org/papers/validation-a-legacy-compatible-vehicle-communication-interface-for-retrieval-crash-data-passenger-vehicles-2026-01-5009"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00ff41] text-xs leading-relaxed hover:underline"
          >
            SAE 2026-01-5009 – Validation of a Legacy-Compatible Vehicle Communication Interface
            for the Retrieval of Crash Data from Passenger Vehicles ↗
          </a>
        </div>

        <div>
          <p className="text-xs tracking-[0.3em] text-[#00ff41]/50 mb-2">// VALIDATION_REPORT</p>
          <h1 className="text-2xl font-black tracking-widest text-[#00ff41] uppercase">
            Testing, Validation, and Peer-Reviewed Publications
          </h1>
        </div>

        <div className="space-y-4 text-sm text-[#00cc33] leading-relaxed">
          <p>
            <span className="text-[#00ff41]">&gt; </span>
            At Crash Pulse Technologies, credibility isn&apos;t just a goal; it&apos;s a requirement.
          </p>
          <p>
            <span className="text-[#00ff41]">&gt; </span>
            To support the forensic reliability and acceptance of the CDX, as well as its compatibility
            with existing legacy crash data hardware and software, we have conducted extensive beta
            testing, validation testing, and repeatability testing. In February of 2026, a technical
            paper titled &ldquo;Validation of a Legacy-Compatible Vehicle Communication Interface for
            the Retrieval of Crash Data from Passenger Vehicles&rdquo; was published by SAE. A second
            technical paper was submitted to ARJ in January of 2026.
          </p>
        </div>

        <div className="border border-[#00ff41]/30 bg-[#111111] p-8 space-y-6">
          <p className="text-xs tracking-[0.3em] text-[#00ff41]/50">// SIGNIFICANCE_ANALYSIS</p>
          <h2 className="text-sm font-bold tracking-widest text-[#00ff41] uppercase">Why This Matters</h2>
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
                <span className="text-[#00ff41] shrink-0 text-xs mt-0.5">&gt;</span>
                <div className="text-sm">
                  <span className="font-bold text-[#e0ffe0]">[{item.title}] </span>
                  <span className="text-[#00cc33]">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-[#00cc33] leading-relaxed border-l-2 border-[#00ff41] pl-4">
          Our mission is to provide investigators, engineers, and attorneys with tools that are not
          only powerful but provably accurate.
        </p>
      </section>

      <footer className="border-t border-[#00ff41]/20 py-8 text-center">
        <p className="text-xs font-mono text-[#00ff41]/30 tracking-widest">
          &copy; {new Date().getFullYear()} CRASH_PULSE_TECHNOLOGIES :: ALL_RIGHTS_RESERVED
        </p>
      </footer>
    </main>
  );
}
