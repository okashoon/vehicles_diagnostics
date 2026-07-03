export default function AboutV2() {
  return (
    <main className="min-h-screen bg-[#0f1117] text-[#e2e8f0]">
      <section className="mx-auto max-w-4xl px-4 py-16 space-y-10">
        {/* Main image */}
        <img
          src="https://crashpulse.com/wp-content/uploads/2026/02/About_us_new.webp"
          alt="Crash Pulse Technologies — About Us"
          className="w-full rounded-2xl border border-[#2d3748]"
        />

        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#3b82f6]/30 bg-[#3b82f6]/10 px-3 py-1">
            <span className="text-xs font-medium text-[#93c5fd]">Our Story</span>
          </div>
          <h1 className="text-3xl font-bold text-white">About Me and the Project</h1>
        </div>

        <div className="space-y-5 text-[#94a3b8] text-sm leading-relaxed">
          <p>
            My name is Jason Zeitler, and I am a forensic engineer, crash investigator, and someone
            who, like many of you, experienced the pain of our industry&apos;s legacy vehicle
            equipment shortage. I originally learned of the discontinuation of the CANplus while
            lecturing at the 2024 IPTM Traffic Symposium for Traffic Safety on the topic of
            chip-swaps. Later at dinner, I began creating a plan for how to fix this equipment
            shortage.
          </p>
          <p>
            Later in December 2024, I began working on a solution. Over the course of months, I
            sourced all the extremely rare and discontinued chips and components, built a prototype,
            and conducted validation testing. I didn&apos;t want to just create a solution to this
            problem, I wanted to make the solution fun, so, I wrapped it in professional branding,
            durable hardware, and a product people would be proud to use.
          </p>
          <p>
            The CDX was born. It was built because the forensic engineering community needed a
            solution. The work we do matters. Establishing truth through crash analysis and
            objective data is critical. Today, I am proud to share that this problem has been
            addressed.
          </p>
          <p>
            This product was not created to disrupt any markets. It was built to solve a
            long-standing industry problem once thought to be unsolvable. Based on established
            legal principles such as Right to Repair, interoperability exemptions, fair use,
            functional equivalence, abandonment, competition law, and public interest, the CDX
            solution was developed to address the discontinuation of the Bosch CANplus VCI.
          </p>
          <p className="text-base font-semibold text-white italic">
            Crash Data eXtraction, Reimagined.
          </p>
        </div>

        {/* Why We Exist */}
        <div className="rounded-2xl border border-[#2d3748] bg-[#1e2330] p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="h-1 w-6 rounded-full bg-[#3b82f6]" />
            <h2 className="text-base font-bold text-white">Why We Exist</h2>
          </div>
          <p className="text-[#94a3b8] text-sm leading-relaxed">
            The industry needed a reliable, professional-grade solution for legacy vehicle crash
            data retrieval. We built CDX to solve this issue.
          </p>
          <ul className="space-y-3">
            {[
              "Published a peer-reviewed technical paper – SAE 2026-01-5009 Validation of a Legacy-Compatible Vehicle Communication Interface for the Retrieval of Crash Data from Passenger Vehicles",
              "Works seamlessly with your existing hardware, software, and cables",
              "Field-tested and engineered for reliability",
              "Second validation peer-reviewed paper submitted to ARJ",
              "100's of ACM and PCM testing performed (DTM and DLC)",
              "Made by a fellow crash reconstructionist, for a fellow crash reconstructionist (not affiliated or endorsed by Bosch, Vetronix, or the federal government).",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-[#94a3b8] text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3b82f6]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Global Access */}
        <div className="rounded-2xl border border-[#2d3748] bg-[#1e2330] p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-1 w-6 rounded-full bg-[#3b82f6]" />
            <h2 className="text-base font-bold text-white">Global Access. Local Support.</h2>
          </div>
          <p className="text-[#94a3b8] text-sm leading-relaxed">
            Through our sister site,{" "}
            <a href="https://crashpulseglobal.com" target="_blank" rel="noopener noreferrer"
              className="text-[#3b82f6] hover:text-[#93c5fd] hover:underline">
              CrashpulseGLOBAL.com
            </a>
            , we ship worldwide, with optimized logistics for the US, Europe, Australia, and more.
            Our tech support is provided by real engineers and crash investigation professionals who
            understand the work you do. For US orders, please visit{" "}
            <a href="https://crashpulseus.com" target="_blank" rel="noopener noreferrer"
              className="text-[#3b82f6] hover:text-[#93c5fd] hover:underline">
              CrashpulseUS.com
            </a>
            ; for all orders outside of the US, please visit{" "}
            <a href="https://crashpulseglobal.com" target="_blank" rel="noopener noreferrer"
              className="text-[#3b82f6] hover:text-[#93c5fd] hover:underline">
              CrashpulseGLOBAL.com
            </a>
          </p>
        </div>

        <p className="text-base font-semibold text-white italic text-center">
          Unlocking the Past. Engineering the Future
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
