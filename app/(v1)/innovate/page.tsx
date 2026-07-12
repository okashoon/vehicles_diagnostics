export default function InnovatePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e0ffe0] font-mono">
      <section className="mx-auto max-w-4xl px-4 py-16 space-y-8">

        <img
          src="/innovate1.jpg"
          alt="Innovative Products — Crash Pulse Technologies"
          className="w-full border border-[#00ff41]/20"
        />

        <div>
          <p className="text-xs tracking-[0.3em] text-[#00ff41]/50 mb-2">// INNOVATION_HUB</p>
          <h1 className="text-2xl font-black tracking-widest text-[#00ff41] uppercase">
            Have an innovative idea?
          </h1>
        </div>

        <div className="border border-[#00ff41]/30 bg-[#111111] p-8 space-y-5">
          <p className="text-base font-bold text-[#e0ffe0]">
            Have a tool, cable, adapter, or just an idea?
          </p>
          <p className="text-base font-bold text-[#00ff41]">
            Let&apos;s bring it to life. Join the Crash Pulse family!
          </p>
        </div>

        <div className="space-y-5 text-sm text-[#00cc33] leading-relaxed">
          <p>
            <span className="text-[#00ff41]">&gt; </span>
            You&apos;ve built something.
          </p>
          <p>
            <span className="text-[#00ff41]">&gt; </span>
            A custom adapter. A specialty cable. A control interface. A solution to a problem every
            investigator has faced but no one has solved properly.
          </p>
          <p className="text-base font-bold text-[#e0ffe0]">
            Now what?
          </p>
          <p>
            <span className="text-[#00ff41]">&gt; </span>
            You can keep it in your lab.<br />
            <span className="text-[#00ff41]">&gt; </span>
            Or you can bring it to market with us.
          </p>
          <p>
            <span className="text-[#00ff41]">&gt; </span>
            Crash Pulse Technologies develops professional-grade tools for serious crash
            investigators. If your concept improves accuracy, efficiency, reliability, or capability
            in forensic engineering, we want to explore it.
          </p>
        </div>

        <div className="border border-[#00ff41]/30 bg-[#111111] p-8 space-y-4">
          <p className="text-xs tracking-[0.3em] text-[#00ff41]/50">// PARTNERSHIP_MODEL</p>
          {[
            {
              label: "You bring the concept.",
              desc: "We provide engineering refinement, industrial design, scalable manufacturing, and global distribution.",
            },
            {
              label: "Together,",
              desc: "we turn working prototypes into production-ready tools used worldwide.",
            },
            {
              label: "We are already developing",
              desc: "next-generation products beyond our current lineup. And we are building a long-term ecosystem of investigator-driven innovation.",
            },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3 text-sm">
              <span className="text-[#00ff41] shrink-0 mt-0.5">&gt;</span>
              <p className="text-[#00cc33] leading-relaxed">
                <span className="font-bold text-[#e0ffe0]">{item.label}</span>{" "}
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <img
          src="/innovate2.png"
          alt="Join the Crash Pulse Family"
          className="w-full border border-[#00ff41]/20"
        />

        <div className="border border-[#00ff41]/40 bg-[#00ff41]/5 p-8 space-y-3">
          <p className="text-xs tracking-[0.3em] text-[#00ff41]/50">// DIRECT_CHANNEL</p>
          <p className="text-sm text-[#00cc33] leading-relaxed">
            If you have an invention or concept ready for professional development, contact:
          </p>
          <a
            href="mailto:jason@crashpulse.com"
            className="text-base font-bold text-[#00ff41] hover:underline tracking-wide"
          >
            jason@crashpulse.com
          </a>
        </div>

      </section>

      <footer className="border-t border-[#00ff41]/20 py-8 text-center">
        <p className="text-xs font-mono text-[#00ff41]/30 tracking-widest">
          &copy; {new Date().getFullYear()} CRASH_PULSE_TECHNOLOGIES :: ALL_RIGHTS_RESERVED
        </p>
      </footer>
    </main>
  );
}
