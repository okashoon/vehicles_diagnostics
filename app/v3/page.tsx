"use client";

import { useState } from "react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"us" | "intl">("us");

  return (
    <main className="min-h-screen bg-[#0a0e1a] text-white">

      {/* ── Hero — video background ── */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        {/* Background video */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="https://crashpulse.com/wp-content/uploads/2025/10/CDX-Video.mp4"
          autoPlay
          muted
          playsInline
          loop
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Hero content */}
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <img
            src="https://crashpulse.com/wp-content/uploads/2025/05/Crash-Pulse-1-1.png"
            alt="Crash Pulse Technologies"
            className="mx-auto mb-8 h-12 w-auto"
          />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Crash Pulse Technologies
          </h1>
          <p className="mt-6 text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto">
            The legacy tools were discontinued. The forensic engineering community was left without
            a viable path forward.{" "}
            <span className="text-white font-semibold">We built the solution.</span>
          </p>
        </div>
      </section>

      {/* ── Tab switcher ── */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <button
            onClick={() => setActiveTab("us")}
            className={[
              "flex-1 sm:flex-none px-6 py-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200",
              activeTab === "us"
                ? "border-[#e63946] bg-[#e63946]/10 text-white shadow-lg"
                : "border-zinc-700 bg-[#111827] text-zinc-400 hover:border-zinc-500 hover:text-white",
            ].join(" ")}
          >
            In the U.S.? You&apos;re in the Right Place.
          </button>
          <button
            onClick={() => setActiveTab("intl")}
            className={[
              "flex-1 sm:flex-none px-6 py-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200",
              activeTab === "intl"
                ? "border-[#e63946] bg-[#e63946]/10 text-white shadow-lg"
                : "border-zinc-700 bg-[#111827] text-zinc-400 hover:border-zinc-500 hover:text-white",
            ].join(" ")}
          >
            Outside the U.S.? We&apos;ve Got You Covered.
          </button>
        </div>

        {/* ── US Tab ── */}
        {activeTab === "us" && (
          <div className="space-y-8">
            <div className="text-center">
              <a
                href="https://crashpulseus.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#e63946] px-8 py-3 text-base font-bold text-white shadow-lg hover:bg-[#c1121f] transition-colors"
              >
                US Shop — Click Here
              </a>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-[#111827] p-8 space-y-6">
              <h2 className="text-2xl font-extrabold text-white">Crash Pulse Technologies</h2>

              <p className="text-zinc-300 leading-relaxed">
                The legacy tools were discontinued. The forensic engineering community was left
                without a viable path forward. We built the solution.
              </p>

              <p className="text-zinc-300 leading-relaxed">
                We have secured a limited supply of discontinued components to produce a batch of
                legacy-compatible VCIs designed to deliver equivalent crash data retrieval
                functionality previously provided by the discontinued CANplus VCI, allowing
                continued use of existing Bosch CDR software.
              </p>

              <p className="text-zinc-300 leading-relaxed">
                With this limited release of CDX modules, the legacy gap is addressed. Supply chain
                limitations are no longer the barrier they once were, and access to critical crash
                data is restored for the forensic engineering community.
              </p>

              <p className="text-xl font-bold text-white italic text-center">
                Unlocking the Past. Engineering the Future.
              </p>

              {/* Validation image — full width, centered */}
              <img
                src="https://crashpulse.com/wp-content/uploads/2026/03/Validation_Image.webp"
                alt="Validation — SAE Published"
                className="w-full rounded-xl"
              />

              {/* Summit image — full width, centered */}
              <img
                src="https://crashpulse.com/wp-content/uploads/2026/03/summit.webp"
                alt="2026 EDR Summit — Houston"
                className="w-full rounded-xl"
              />

              <div className="space-y-4 pt-2">
                <p className="text-zinc-300 leading-relaxed">
                  The Crash Pulse CDX was presented at the 2026 EDR Summit, in Houston, on the
                  development and validation of the CDX, an SAE-published, functionally equivalent
                  solution to the discontinued CANplus.
                </p>

                <p className="text-white font-semibold">Topics included:</p>
                <ul className="space-y-1.5">
                  {[
                    "Building the CDX",
                    "Beta testing",
                    "Validation testing",
                    "SAE Technical Paper",
                    "Upcoming ARJ Technical Paper",
                    "Seamless compatibility with the CDR ecosystem",
                    "Software",
                    "Cables",
                    "Adapters",
                    "CDX Programmer's Edition",
                    "Extensive QA/QC process and 3-year warranty",
                    "Solved – Nissan: Double Ignition Cycle Anomaly Explained",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-zinc-300 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e63946]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ── International Tab ── */}
        {activeTab === "intl" && (
          <div className="space-y-8">
            <div className="text-center">
              <a
                href="https://crashpulseglobal.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#e63946] px-8 py-3 text-base font-bold text-white shadow-lg hover:bg-[#c1121f] transition-colors"
              >
                International Shop — Click Here
              </a>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-[#111827] p-8 space-y-5">
              <p className="text-zinc-300 leading-relaxed">
                Global pre-orders will be live soon at CrashPulseGLOBAL.com. This is the only way
                to lock in your CDX unit before they&apos;re gone. Please visit our International
                Shop and add your email address to be notified as soon as international CDX units
                are ready to ship!
              </p>

              <p className="text-zinc-300 leading-relaxed">
                <strong className="text-white">CrashPulseGLOBAL.com</strong> is the official store
                for all international orders. Serving forensic engineers, crash reconstructionists,
                and investigative teams across Europe, Australia, United Kingdom, and beyond.
              </p>

              <p className="text-zinc-300 leading-relaxed">
                We ship globally from our European distribution center, so you can avoid U.S.
                export hassles, steep customs fees, and unnecessary delays.
              </p>

              <div>
                <p className="text-white font-semibold mb-3">
                  On CrashPulseGLOBAL.com you&apos;ll find:
                </p>
                <ul className="space-y-2">
                  {[
                    "The CDX Vehicle Communication Interface — a rugged, field-ready tool built to support legacy crash data workflows in a wide range of global vehicles",
                    "Complete eXtraction Kits — includes precision-engineered cables and adapters that streamline your data access",
                    "Localized Checkout Options — major currencies, secure payments, VAT-friendly B2B transactions",
                    "Fast Global Shipping — trusted couriers, real-time tracking, no surprises",
                    "Built for Investigators, by Investigators — we know what matters in the field, because we've worked it",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-zinc-300 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e63946]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-zinc-300 leading-relaxed">
                Whether you&apos;re running investigations in Ireland, Germany, Sydney, or anywhere
                in between, CrashPulseGLOBAL.com makes it simple to get the tools you need, with
                support that speaks your language.
              </p>
            </div>
          </div>
        )}
      </section>

      <footer className="border-t border-zinc-800 bg-[#080b14] py-8 text-center">
        <p className="text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} Crash Pulse Technologies. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}
