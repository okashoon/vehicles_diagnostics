export default function SetupGuideV3() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e0ffe0] font-mono">
      <section className="mx-auto max-w-4xl px-4 py-16 space-y-8">
        <div>
          <p className="text-xs tracking-[0.3em] text-[#00ff41]/50 mb-2">// INIT_SEQUENCE</p>
          <h1 className="text-2xl font-black tracking-widest text-[#00ff41] uppercase">Setup</h1>
        </div>

        <div className="space-y-3">
          {[
            {
              num: "01",
              label: "INSTALL_DRIVERS",
              text: (
                <>
                  Install serial cable drivers –{" "}
                  <a
                    href="https://crashpulse.com/wp-content/uploads/2025/11/PL23XX-M_LogoDriver_Setup_4300_20240704.zip"
                    className="text-[#00ff41] hover:underline"
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
              label: "CONNECT_HARDWARE",
              text: "Connect serial cable and power adapter to CDX.",
            },
            {
              num: "03",
              label: "FIRMWARE_UPDATE",
              text: 'If using the Bosch CDR software, select "test CANplus", and follow prompts to update firmware using your genuine CDR license. After updating, test your CDX using a supported vehicle or ACM.',
            },
            {
              num: "04",
              label: "TECH_SUPPORT",
              text: (
                <>
                  Need help?{" "}
                  <a href="mailto:Tech@crashpulse.com"
                    className="text-[#00ff41] hover:underline">
                    Tech@crashpulse.com
                  </a>
                </>
              ),
            },
          ].map((step) => (
            <div
              key={step.num}
              className="border border-[#00ff41]/30 bg-[#111111] p-6 flex items-start gap-5 hover:border-[#00ff41]/60 transition-colors"
            >
              <div className="shrink-0">
                <span className="text-2xl font-black text-[#00ff41] font-mono tabular-nums">
                  {step.num}
                </span>
                <p className="text-[9px] tracking-widest text-[#00ff41]/40 mt-0.5">{step.label}</p>
              </div>
              <p className="text-sm text-[#00cc33] leading-relaxed pt-1">{step.text}</p>
            </div>
          ))}
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
