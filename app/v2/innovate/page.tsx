"use client";

import { useState } from "react";

export default function InnovateV2() {
  const [form, setForm] = useState({ name: "", email: "", org: "", idea: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[#0f1117] text-[#e2e8f0]">
      <section className="mx-auto max-w-4xl px-4 py-16 space-y-8">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#3b82f6]/30 bg-[#3b82f6]/10 px-3 py-1">
            <span className="text-xs font-medium text-[#93c5fd]">Collaborate</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Have an innovative idea?</h1>
        </div>

        <p className="text-[#94a3b8] text-sm leading-relaxed">
          Crash Pulse Technologies was built by a practitioner who saw a problem and engineered a
          solution. If you have an idea that could move forensic engineering or crash data
          technology forward — we want to hear it.
        </p>

        <p className="text-[#94a3b8] text-sm leading-relaxed">
          Whether it&apos;s a hardware concept, a software tool, a new vehicle compatibility
          challenge, or something else entirely — reach out. Real ideas from real investigators
          are what drive innovation in this field.
        </p>

        <div className="rounded-2xl border border-[#2d3748] bg-[#1e2330] p-8">
          {submitted ? (
            <div className="py-10 text-center space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 mx-auto">
                <svg className="h-7 w-7 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-white">Idea Received!</h2>
              <p className="text-[#64748b] text-sm max-w-xs mx-auto">
                Thank you for sharing. We&apos;ll be in touch if it&apos;s a strong fit.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", org: "", idea: "" }); }}
                className="text-sm text-[#3b82f6] hover:text-[#93c5fd] hover:underline"
              >
                Submit another idea
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-base font-bold text-white mb-2">Share Your Idea</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-[#64748b] mb-1.5">
                    Your Name <span className="text-[#3b82f6]">*</span>
                  </label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required
                    className="w-full rounded-xl border border-[#2d3748] bg-[#0f1117] px-4 py-2.5 text-sm text-white placeholder-[#334155] focus:border-[#3b82f6] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#64748b] mb-1.5">
                    Email <span className="text-[#3b82f6]">*</span>
                  </label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required
                    className="w-full rounded-xl border border-[#2d3748] bg-[#0f1117] px-4 py-2.5 text-sm text-white placeholder-[#334155] focus:border-[#3b82f6] focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#64748b] mb-1.5">
                  Organization / Affiliation{" "}
                  <span className="text-[#334155]">(optional)</span>
                </label>
                <input type="text" name="org" value={form.org} onChange={handleChange}
                  className="w-full rounded-xl border border-[#2d3748] bg-[#0f1117] px-4 py-2.5 text-sm text-white placeholder-[#334155] focus:border-[#3b82f6] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#64748b] mb-1.5">
                  Describe Your Idea <span className="text-[#3b82f6]">*</span>
                </label>
                <textarea name="idea" value={form.idea} onChange={handleChange} required rows={6}
                  placeholder="What problem does it solve? How does it work?"
                  className="w-full rounded-xl border border-[#2d3748] bg-[#0f1117] px-4 py-2.5 text-sm text-white placeholder-[#334155] focus:border-[#3b82f6] focus:outline-none transition-colors resize-none"
                />
              </div>
              <button type="submit"
                className="w-full rounded-full bg-[#3b82f6] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2563eb] transition-colors">
                Submit Idea
              </button>
            </form>
          )}
        </div>

        <p className="text-[#475569] text-xs text-center">
          You can also reach us directly at{" "}
          <a href="mailto:admin@crashpulse.com" className="text-[#3b82f6] hover:text-[#93c5fd] hover:underline">
            admin@crashpulse.com
          </a>
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
