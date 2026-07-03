"use client";

import { useState } from "react";

export default function HomeV2() {
  const [activeTab, setActiveTab] = useState<"us" | "intl">("us");

  return (
    <main className="min-h-screen bg-[#0f1117] text-[#e2e8f0]">
      {/* Hero — video background */}
      <section className="relative flex min-h-[65vh] items-center justify-center overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="https://crashpulse.com/wp-content/uploads/2025/10/CDX-Video.mp4"
          autoPlay muted playsInline loop
        />
        <div className="absolute inset-0 bg-[#0f1117]/70" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#3b82f6]/30 bg-[#3b82f6]/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3b82f6]" />
            <span className="text-xs font-medium text-[#93c5fd]">SAE 2026-01-5009 Published</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight text-white">
            Crash Pulse<br /><span className="text-[#3b82f6]">Technologies</span>
          </h1>
          <p className="mt-5 text-base text-[#94a3b8] leading-relaxed max-w-xl mx-auto">
            The legacy tools were discontinued. The forensic engineering community was left without
            a viable path forward. We built the solution.
          </p>
        </div>
      </section>

      {/* Tab switcher */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        <div className="flex justify-center mb-8">
          <div className="flex bg-[#1e2330] border border-[#2d3748] rounded-full p-1 gap-1">
            {(["us", "intl"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={[
                  "px-5 py-2 rounded-full text-sm font-medium transition-all",
                  activeTab === t
                    ? "bg-[#3b82f6] text-white"
                    : "text-[#64748b] hover:text-white",
                ].join(" ")}
              >
                {t === "us" ? "In the U.S.? You're in the Right Place." : "Outside the U.S.? We've Got You Covered."}
              </button>
            ))}
          </div>
        </div>

        {/* US Tab */}
        {activeTab === "us" && (
          <div className="space-y-6">
            <div className="text-center">
              <a href="https://crashpulseus.com" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#3b82f6] px-7 py-3 text-sm font-semibold text-white hover:bg-[#2563eb] transition-colors">
                US Shop — Click Here →
              </a>
            </div>

            <div className="rounded-2xl border border-[#2d3748] bg-[#1e2330] p-8 space-y-5">
              <h2 className="text-xl font-bold text-white">Crash Pulse Technologies</h2>
              <p className="text-[#94a3b8] leading-relaxed text-sm">
                The legacy tools were discontinued. The forensic engineering community was left
                without a viable path forward. We built the solution.
              </p>
              <p className="text-[#94a3b8] leading-relaxed text-sm">
                We have secured a limited supply of discontinued components to produce a batch of
                legacy-compatible VCIs designed to deliver equivalent crash data retrieval
                functionality previously provided by the discontinued CANplus VCI, allowing continued
                use of existing Bosch CDR software.
              </p>
              <p className="text-[#94a3b8] leading-relaxed text-sm">
                With this limited release of CDX modules, the legacy gap is addressed. Supply chain
                limitations are no longer the barrier they once were, and access to critical crash
                data is restored for the forensic engineering community.
              </p>
              <p className="text-base font-semibold text-white text-center italic">
                Unlocking the Past. Engineering the Future.
              </p>
              <img
                src="https://crashpulse.com/wp-content/uploads/2026/03/Validation_Image.webp"
                alt="Validation — SAE Published"
                className="w-full rounded-xl"
              />
              <img
                src="https://crashpulse.com/wp-content/uploads/2026/03/summit.webp"
                alt="2026 EDR Summit — Houston"
                className="w-full rounded-xl"
              />
              <div className="space-y-3 pt-1">
                <p className="text-[#94a3b8] text-sm leading-relaxed">
                  The Crash Pulse CDX was presented at the 2026 EDR Summit, in Houston, on the
                  development and validation of the CDX, an SAE-published, functionally equivalent
                  solution to the discontinued CANplus.
                </p>
                <p className="text-sm font-semibold text-white">Topics included:</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {[
                    "Building the CDX", "Beta testing", "Validation testing", "SAE Technical Paper",
                    "Upcoming ARJ Technical Paper", "Seamless compatibility with the CDR ecosystem",
                    "Software", "Cables", "Adapters", "CDX Programmer's Edition",
                    "Extensive QA/QC process and 3-year warranty",
                    "Solved – Nissan: Double Ignition Cycle Anomaly Explained",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3b82f6]" />
                      <span className="text-[#94a3b8] text-sm">{item}</span>
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
                className="inline-flex items-center gap-2 rounded-full bg-[#3b82f6] px-7 py-3 text-sm font-semibold text-white hover:bg-[#2563eb] transition-colors">
                International Shop — Click Here →
              </a>
            </div>
            <div className="rounded-2xl border border-[#2d3748] bg-[#1e2330] p-8 space-y-4">
              <p className="text-[#94a3b8] leading-relaxed text-sm">
                Global pre-orders will be live soon at CrashPulseGLOBAL.com. This is the only way
                to lock in your CDX unit before they&apos;re gone. Please visit our International
                Shop and add your email address to be notified as soon as international CDX units
                are ready to ship!
              </p>
              <p className="text-[#94a3b8] leading-relaxed text-sm">
                <span className="text-white font-medium">CrashPulseGLOBAL.com</span> is the official
                store for all international orders. Serving forensic engineers, crash reconstructionists,
                and investigative teams across Europe, Australia, United Kingdom, and beyond.
              </p>
              <p className="text-[#94a3b8] leading-relaxed text-sm">
                We ship globally from our European distribution center, so you can avoid U.S. export
                hassles, steep customs fees, and unnecessary delays.
              </p>
              <p className="text-sm font-semibold text-white">On CrashPulseGLOBAL.com you&apos;ll find:</p>
              <div className="space-y-2">
                {[
                  "The CDX Vehicle Communication Interface — a rugged, field-ready tool built to support legacy crash data workflows in a wide range of global vehicles",
                  "Complete eXtraction Kits — includes precision-engineered cables and adapters that streamline your data access",
                  "Localized Checkout Options — major currencies, secure payments, VAT-friendly B2B transactions",
                  "Fast Global Shipping — trusted couriers, real-time tracking, no surprises",
                  "Built for Investigators, by Investigators — we know what matters in the field, because we've worked it",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3b82f6]" />
                    <span className="text-[#94a3b8] text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-[#94a3b8] leading-relaxed text-sm">
                Whether you&apos;re running investigations in Ireland, Germany, Sydney, or anywhere
                in between, CrashPulseGLOBAL.com makes it simple to get the tools you need, with
                support that speaks your language.
              </p>
            </div>
          </div>
        )}
      </section>

      <footer className="border-t border-[#1e2330] py-8 text-center">
        <p className="text-xs text-[#334155]">
          &copy; {new Date().getFullYear()} Crash Pulse Technologies. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}
