export default function SetupGuideV2() {
  return (
    <main className="min-h-screen bg-[#0f1117] text-[#e2e8f0]">
      <section className="mx-auto max-w-4xl px-4 py-16 space-y-8">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#3b82f6]/30 bg-[#3b82f6]/10 px-3 py-1">
            <span className="text-xs font-medium text-[#93c5fd]">Getting Started</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Setup</h1>
        </div>

        <div className="space-y-4">
          {[
            {
              num: "01",
              text: (
                <>
                  Install serial cable drivers –{" "}
                  <a
                    href="https://crashpulse.com/wp-content/uploads/2025/11/PL23XX-M_LogoDriver_Setup_4300_20240704.zip"
                    className="text-[#3b82f6] hover:text-[#93c5fd] hover:underline"
                    download
                  >
                    PL23XX-M_LogoDriver_Setup_4300_20240704
                  </a>
                  .
                </>
              ),
            },
            {
              num: "02",
              text: "Connect serial cable and power adapter to CDX.",
            },
            {
              num: "03",
              text: 'If using the Bosch CDR software, select "test CANplus", and follow prompts to update firmware using your genuine CDR license. After updating, test your CDX using a supported vehicle or ACM.',
            },
            {
              num: "04",
              text: (
                <>
                  Need help?{" "}
                  <a href="mailto:Tech@crashpulse.com"
                    className="text-[#3b82f6] hover:text-[#93c5fd] hover:underline">
                    Tech@crashpulse.com
                  </a>
                </>
              ),
            },
          ].map((step) => (
            <div
              key={step.num}
              className="rounded-2xl border border-[#2d3748] bg-[#1e2330] p-6 flex items-start gap-5 hover:border-[#3b82f6]/30 transition-colors"
            >
              <span className="text-2xl font-black text-[#3b82f6] shrink-0 font-mono tabular-nums">
                {step.num}
              </span>
              <p className="text-[#94a3b8] text-sm leading-relaxed pt-1">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#1e2330] py-8 text-center">
        <p className="text-xs text-[#334155]">
          &copy; {new Date().getFullYear()} Crash Pulse Technologies. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}
