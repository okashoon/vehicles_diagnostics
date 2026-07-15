"use client";

import { useState } from "react";

export default function HomeV3() {
  const [activeTab, setActiveTab] = useState<"us" | "intl">("us");

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e0ffe0] font-mono">

      {/* Hero — video background */}
      <section className="relative flex min-h-[65vh] items-center justify-center overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-30"
          src="/media/CDX-Video.mp4"
          autoPlay muted playsInline loop
        />
        <div className="absolute inset-0 bg-[#0a0a0a]/60" />

        {/* Scanline overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #00ff41 2px, #00ff41 3px)", backgroundSize: "100% 4px" }}
        />

        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <p className="mb-4 text-xs tracking-[0.3em] text-[#00ff41]/60">
            // SYSTEM STATUS: ONLINE
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-[#00ff41]">
            CRASH_PULSE
          </h1>
          <p className="mt-1 text-lg font-bold tracking-widest text-[#00cc33]">
            TECHNOLOGIES
          </p>
          <div className="mt-6 border border-[#00ff41]/30 bg-[#00ff41]/5 p-4 text-left text-sm text-[#00cc33] leading-relaxed max-w-2xl mx-auto">
            <span className="text-[#00ff41]">&gt; </span>
            The legacy tools were discontinued. The forensic engineering community was left without
            a viable path forward.{" "}
            <span className="text-[#e0ffe0] font-bold">We built the solution.</span>
          </div>
        </div>
      </section>

      {/* Tab switcher */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        <div className="flex gap-0 mb-8 border border-[#00ff41]/30">
          {(["us", "intl"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={[
                "flex-1 px-4 py-2.5 text-xs font-mono tracking-widest uppercase transition-colors",
                activeTab === t
                  ? "bg-[#00ff41] text-[#0a0a0a] font-bold"
                  : "text-[#00cc33] hover:text-[#00ff41] hover:bg-[#00ff41]/10",
              ].join(" ")}
            >
              {t === "us" ? "> IN THE U.S." : "> OUTSIDE THE U.S."}
            </button>
          ))}
        </div>

        {/* US Tab */}
        {activeTab === "us" && (
          <div className="space-y-6">
            <div className="text-center">
              <a href="https://crashpulseus.com" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-[#00ff41] bg-[#00ff41]/10 px-8 py-3 text-xs font-bold font-mono tracking-widest text-[#00ff41] hover:bg-[#00ff41] hover:text-[#0a0a0a] transition-colors uppercase">
                [ US_SHOP ] → CLICK_HERE
              </a>
            </div>

            <div className="border border-[#00ff41]/30 bg-[#111111] p-8 space-y-5">
              <p className="text-xs tracking-widest text-[#00ff41]/60">// SYSTEM BRIEF</p>
              <h2 className="text-base font-bold tracking-widest text-[#00ff41] uppercase">
                Crash Pulse Technologies
              </h2>
              <p className="text-sm text-[#00cc33] leading-relaxed">
                The legacy tools were discontinued. The forensic engineering community was left
                without a viable path forward. We built the solution.
              </p>
              <p className="text-sm text-[#00cc33] leading-relaxed">
                We have secured a limited supply of discontinued components to produce a batch of
                legacy-compatible VCIs designed to deliver equivalent crash data retrieval
                functionality previously provided by the discontinued CANplus VCI, allowing
                continued use of existing Bosch CDR software.
              </p>
              <p className="text-sm text-[#00cc33] leading-relaxed">
                With this limited release of CDX modules, the legacy gap is addressed. Supply chain
                limitations are no longer the barrier they once were, and access to critical crash
                data is restored for the forensic engineering community.
              </p>
              <p className="text-sm font-bold text-[#e0ffe0] italic text-center border-t border-[#00ff41]/20 pt-4">
                Unlocking the Past. Engineering the Future.
              </p>
              <img
                src="/validation_image.jpeg"
                alt="Validation — SAE Published"
                className="w-full border border-[#00ff41]/20"
              />
              <img
                src="/summit.jpeg"
                alt="2026 EDR Summit — Houston"
                className="w-full border border-[#00ff41]/20"
              />
              <div className="space-y-3 pt-2">
                <p className="text-sm text-[#00cc33] leading-relaxed">
                  The Crash Pulse CDX was presented at the 2026 EDR Summit, in Houston, on the
                  development and validation of the CDX, an SAE-published, functionally equivalent
                  solution to the discontinued CANplus.
                </p>
                <p className="text-xs font-bold tracking-widest text-[#00ff41] uppercase">
                  // Topics included:
                </p>
                <div className="grid sm:grid-cols-2 gap-1.5">
                  {[
                    "Building the CDX", "Beta testing", "Validation testing", "SAE Technical Paper",
                    "Upcoming ARJ Technical Paper", "Seamless compatibility with the CDR ecosystem",
                    "Software", "Cables", "Adapters", "CDX Programmer's Edition",
                    "Extensive QA/QC process and 3-year warranty",
                    "Solved – Nissan: Double Ignition Cycle Anomaly Explained",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <span className="text-[#00ff41] text-xs shrink-0">&gt;</span>
                      <span className="text-[#00cc33] text-xs">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* International Tab */}
        {activeTab === "intl" && (
          <div className="space-y-6">
            <div className="text-center">
              <a href="https://crashpulseglobal.com" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-[#00ff41] bg-[#00ff41]/10 px-8 py-3 text-xs font-bold font-mono tracking-widest text-[#00ff41] hover:bg-[#00ff41] hover:text-[#0a0a0a] transition-colors uppercase">
                [ INTL_SHOP ] → CLICK_HERE
              </a>
            </div>
            <div className="border border-[#00ff41]/30 bg-[#111111] p-8 space-y-4">
              <p className="text-xs tracking-widest text-[#00ff41]/60">// GLOBAL ACCESS</p>
              {[
                "Global pre-orders will be live soon at CrashPulseGLOBAL.com. This is the only way to lock in your CDX unit before they're gone. Please visit our International Shop and add your email address to be notified as soon as international CDX units are ready to ship!",
                "CrashPulseGLOBAL.com is the official store for all international orders. Serving forensic engineers, crash reconstructionists, and investigative teams across Europe, Australia, United Kingdom, and beyond.",
                "We ship globally from our European distribution center, so you can avoid U.S. export hassles, steep customs fees, and unnecessary delays.",
              ].map((text, i) => (
                <p key={i} className="text-sm text-[#00cc33] leading-relaxed">
                  <span className="text-[#00ff41]">&gt; </span>{text}
                </p>
              ))}
              <p className="text-xs font-bold tracking-widest text-[#00ff41] uppercase pt-2">
                // On CrashPulseGLOBAL.com you&apos;ll find:
              </p>
              {[
                "The CDX Vehicle Communication Interface — a rugged, field-ready tool built to support legacy crash data workflows in a wide range of global vehicles",
                "Complete eXtraction Kits — includes precision-engineered cables and adapters that streamline your data access",
                "Localized Checkout Options — major currencies, secure payments, VAT-friendly B2B transactions",
                "Fast Global Shipping — trusted couriers, real-time tracking, no surprises",
                "Built for Investigators, by Investigators — we know what matters in the field, because we've worked it",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="text-[#00ff41] text-xs shrink-0">&gt;</span>
                  <span className="text-[#00cc33] text-xs">{item}</span>
                </div>
              ))}
              <p className="text-sm text-[#00cc33] leading-relaxed pt-2">
                <span className="text-[#00ff41]">&gt; </span>
                Whether you&apos;re running investigations in Ireland, Germany, Sydney, or anywhere
                in between, CrashPulseGLOBAL.com makes it simple to get the tools you need, with
                support that speaks your language.
              </p>
            </div>
          </div>
        )}
      </section>

      <footer className="border-t border-[#00ff41]/20 bg-[#0a0a0a] py-8 text-center">
        <p className="text-xs font-mono text-[#00ff41]/30 tracking-widest">
          &copy; {new Date().getFullYear()} CRASH_PULSE_TECHNOLOGIES :: ALL_RIGHTS_RESERVED
        </p>
      </footer>
    </main>
  );
}
