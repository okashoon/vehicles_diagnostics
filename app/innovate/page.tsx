"use client";

import { useState } from "react";

export default function InnovatePage() {
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
    <main className="min-h-screen bg-[#0a0e1a] text-white">
      <section className="mx-auto max-w-4xl px-4 py-16 space-y-10">
        <h1 className="text-3xl font-extrabold text-white">Have an innovative idea?</h1>

        <p className="text-zinc-300 leading-relaxed">
          Crash Pulse Technologies was built by a practitioner who saw a problem and engineered a
          solution. If you have an idea that could move forensic engineering or crash data
          technology forward — we want to hear it.
        </p>

        <p className="text-zinc-300 leading-relaxed">
          Whether it&apos;s a hardware concept, a software tool, a new vehicle compatibility
          challenge, or something else entirely — reach out. Real ideas from real investigators
          are what drive innovation in this field.
        </p>

        <div className="rounded-2xl border border-zinc-800 bg-[#111827] p-8">
          {submitted ? (
            <div className="py-10 text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20 mx-auto">
                <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Idea Received!</h2>
              <p className="text-zinc-400 text-sm max-w-xs mx-auto">
                Thank you for sharing. We&apos;ll be in touch if it&apos;s a strong fit.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", org: "", idea: "" }); }}
                className="text-sm text-[#e63946] hover:underline"
              >
                Submit another idea
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-lg font-bold text-white mb-2">Share Your Idea</h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Your Name <span className="text-[#e63946]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-zinc-700 bg-[#0d1220] px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-[#e63946] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Email <span className="text-[#e63946]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-zinc-700 bg-[#0d1220] px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-[#e63946] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Organization / Affiliation{" "}
                  <span className="text-zinc-600">(optional)</span>
                </label>
                <input
                  type="text"
                  name="org"
                  value={form.org}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-700 bg-[#0d1220] px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-[#e63946] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Describe Your Idea <span className="text-[#e63946]">*</span>
                </label>
                <textarea
                  name="idea"
                  value={form.idea}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="What problem does it solve? How does it work?"
                  className="w-full rounded-lg border border-zinc-700 bg-[#0d1220] px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-[#e63946] focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-[#e63946] px-6 py-3 text-sm font-bold text-white hover:bg-[#c1121f] transition-colors"
              >
                Submit Idea
              </button>
            </form>
          )}
        </div>

        <p className="text-zinc-500 text-sm text-center">
          You can also reach us directly at{" "}
          <a href="mailto:admin@crashpulse.com" className="text-[#e63946] hover:underline">
            admin@crashpulse.com
          </a>
        </p>
      </section>

      <footer className="border-t border-zinc-800 bg-[#080b14] py-8 text-center">
        <p className="text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} Crash Pulse Technologies. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}
