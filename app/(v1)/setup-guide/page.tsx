export default function SetupGuidePage() {
  return (
    <main className="min-h-screen bg-[#0a0e1a] text-white">
      <section className="mx-auto max-w-4xl px-4 py-16 space-y-8">
        <h1 className="text-3xl font-extrabold text-white">Setup</h1>

        <div className="space-y-4">
          {[
            {
              num: "Step 1",
              text: (
                <>
                  Install serial cable drivers –{" "}
                  <a
                    href="https://crashpulse.com/wp-content/uploads/2025/11/PL23XX-M_LogoDriver_Setup_4300_20240704.zip"
                    className="text-[#e63946] hover:underline"
                    download
                  >
                    PL23XX-M_LogoDriver_Setup_4300_20240704
                  </a>
                  .
                </>
              ),
            },
            {
              num: "Step 2",
              text: "Connect serial cable and power adapter to CDX.",
            },
            {
              num: "Step 3",
              text: 'If using the Bosch CDR software, select "test CANplus", and follow prompts to update firmware using your genuine CDR license. After updating, test your CDX using a supported vehicle or ACM.',
            },
            {
              num: "Step 4",
              text: (
                <>
                  Need help?{" "}
                  <a
                    href="mailto:Tech@crashpulse.com"
                    className="text-[#e63946] hover:underline"
                  >
                    Tech@crashpulse.com
                  </a>
                </>
              ),
            },
          ].map((step) => (
            <div
              key={step.num}
              className="rounded-2xl border border-zinc-800 bg-[#111827] p-6 flex items-start gap-5"
            >
              <span className="text-2xl font-black text-[#e63946] shrink-0 w-20">
                {step.num}:
              </span>
              <p className="text-zinc-300 leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-zinc-800 bg-[#080b14] py-8 text-center">
        <p className="text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} Crash Pulse Technologies. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}
