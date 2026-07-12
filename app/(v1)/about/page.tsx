export default function AboutV3() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e0ffe0] font-mono">
      <section className="mx-auto max-w-4xl px-4 py-16 space-y-10">

        <img
          src="/about_us_new.jpeg"
          alt="Crash Pulse Technologies — About Us"
          className="w-full border border-[#00ff41]/20"
        />

        <div>
          <p className="text-xs tracking-[0.3em] text-[#00ff41]/50 mb-2">// OPERATOR_PROFILE</p>
          <h1 className="text-2xl font-black tracking-widest text-[#00ff41] uppercase">
            About Me and the Project
          </h1>
        </div>

        <div className="space-y-5 text-sm text-[#00cc33] leading-relaxed">
          {[
            "My name is Jason Zeitler, and I am a forensic engineer, crash investigator, and someone who, like many of you, experienced the pain of our industry's legacy vehicle equipment shortage. I originally learned of the discontinuation of the CANplus while lecturing at the 2024 IPTM Traffic Symposium for Traffic Safety on the topic of chip-swaps. Later at dinner, I began creating a plan for how to fix this equipment shortage.",
            "Later in December 2024, I began working on a solution. Over the course of months, I sourced all the extremely rare and discontinued chips and components, built a prototype, and conducted validation testing. I didn't want to just create a solution to this problem, I wanted to make the solution fun, so, I wrapped it in professional branding, durable hardware, and a product people would be proud to use.",
            "The CDX was born. It was built because the forensic engineering community needed a solution. The work we do matters. Establishing truth through crash analysis and objective data is critical. Today, I am proud to share that this problem has been addressed.",
            "This product was not created to disrupt any markets. It was built to solve a long-standing industry problem once thought to be unsolvable. Based on established legal principles such as Right to Repair, interoperability exemptions, fair use, functional equivalence, abandonment, competition law, and public interest, the CDX solution was developed to address the discontinuation of the Bosch CANplus VCI.",
          ].map((text, i) => (
            <p key={i}>
              <span className="text-[#00ff41]">&gt; </span>{text}
            </p>
          ))}
          <p className="text-base font-bold text-[#e0ffe0] italic border-l-2 border-[#00ff41] pl-4">
            Crash Data eXtraction, Reimagined.
          </p>
        </div>

        {/* Why We Exist */}
        <div className="border border-[#00ff41]/30 bg-[#111111] p-8 space-y-5">
          <p className="text-xs tracking-[0.3em] text-[#00ff41]/50">// MISSION_PARAMETERS</p>
          <h2 className="text-sm font-bold tracking-widest text-[#00ff41] uppercase">Why We Exist</h2>
          <p className="text-sm text-[#00cc33] leading-relaxed">
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
              <li key={item} className="flex items-start gap-3 text-[#00cc33] text-sm">
                <span className="text-[#00ff41] shrink-0">&gt;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Global Access */}
        <div className="border border-[#00ff41]/30 bg-[#111111] p-8 space-y-4">
          <p className="text-xs tracking-[0.3em] text-[#00ff41]/50">// GLOBAL_NETWORK</p>
          <h2 className="text-sm font-bold tracking-widest text-[#00ff41] uppercase">
            Global Access. Local Support.
          </h2>
          <p className="text-sm text-[#00cc33] leading-relaxed">
            Through our sister site,{" "}
            <a href="https://crashpulseglobal.com" target="_blank" rel="noopener noreferrer"
              className="text-[#00ff41] hover:underline">
              CrashpulseGLOBAL.com
            </a>
            , we ship worldwide, with optimized logistics for the US, Europe, Australia, and more.
            Our tech support is provided by real engineers and crash investigation professionals who
            understand the work you do. For US orders, please visit{" "}
            <a href="https://crashpulseus.com" target="_blank" rel="noopener noreferrer"
              className="text-[#00ff41] hover:underline">
              CrashpulseUS.com
            </a>
            ; for all orders outside of the US, please visit{" "}
            <a href="https://crashpulseglobal.com" target="_blank" rel="noopener noreferrer"
              className="text-[#00ff41] hover:underline">
              CrashpulseGLOBAL.com
            </a>
          </p>
        </div>

        <p className="text-base font-bold text-[#e0ffe0] italic text-center border-l-2 border-[#00ff41] pl-4">
          Unlocking the Past. Engineering the Future
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
