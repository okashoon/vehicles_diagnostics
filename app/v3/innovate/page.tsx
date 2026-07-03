"use client";

import { useState } from "react";

export default function InnovateV3() {
  const [form, setForm] = useState({ name: "", email: "", org: "", idea: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const inputClass = "w-full border border-[#00ff41]/30 bg-[#0a0a0a] px-4 py-2.5 text-sm font-mono text-[#00ff41] placeholder-[#00ff41]/20 focus:border-[#00ff41] focus:outline-none transition-colors";

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e0ffe0] font-mono">
      <section className="mx-auto max-w-4xl px-4 py-16 space-y-8">
        <div>
          <p className="text-xs tracking-[0.3em] text-[#00ff41]/50 mb-2">// INNOVATION_HUB</p>
          <h1 className="text-2xl font-black tracking-widest text-[#00ff41] uppercase">
            Have an innovative idea?
          </h1>
        </div>

        <p className="text-sm text-[#00cc33] leading-relaxed">
          <span className="text-[#00ff41]">&gt; </span>
          Crash Pulse Technologies was built by a practitioner who saw a problem and engineered a
          solution. If you have an idea that could move forensic engineering or crash data
          technology forward — we want to hear it.
        </p>

        <p className="text-sm text-[#00cc33] leading-relaxed">
          <span className="text-[#00ff41]">&gt; </span>
          Whether it&apos;s a hardware concept, a software tool, a new vehicle compatibility
          challenge, or something else entirely — reach out. Real ideas from real investigators
          are what drive innovation in this field.
        </p>

        <div className="border border-[#00ff41]/30 bg-[#111111] p-8">
          {submitted ? (
            <div className="py-10 text-center space-y-4">
              <p className="text-[#00ff41] text-2xl font-black tracking-widest">[ OK ]</p>
              <h2 className="text-base font-bold tracking-widest text-[#e0ffe0] uppercase">
                Idea Received
              </h2>
              <p className="text-[#00cc33] text-sm max-w-xs mx-auto">
                &gt; Thank you for sharing. We&apos;ll be in touch if it&apos;s a strong fit.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", org: "", idea: "" }); }}
                className="text-xs text-[#00ff41] hover:underline tracking-widest"
              >
                [SUBMIT_ANOTHER]
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-xs tracking-[0.3em] text-[#00ff41]/50 mb-4">// SUBMISSION_FORM</p>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-mono text-[#00cc33] mb-1.5 tracking-widest">
                    OPERATOR_NAME <span className="text-[#00ff41]">*</span>
                  </label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#00cc33] mb-1.5 tracking-widest">
                    EMAIL_ADDR <span className="text-[#00ff41]">*</span>
                  </label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-[#00cc33] mb-1.5 tracking-widest">
                  ORGANIZATION <span className="text-[#00ff41]/40">(OPTIONAL)</span>
                </label>
                <input type="text" name="org" value={form.org} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#00cc33] mb-1.5 tracking-widest">
                  CONCEPT_BRIEF <span className="text-[#00ff41]">*</span>
                </label>
                <textarea name="idea" value={form.idea} onChange={handleChange} required rows={6}
                  placeholder="What problem does it solve? How does it work?"
                  className={`${inputClass} resize-none`}
                />
              </div>
              <button
                type="submit"
                className="w-full border border-[#00ff41] bg-[#00ff41]/10 px-6 py-3 text-xs font-bold font-mono tracking-widest text-[#00ff41] hover:bg-[#00ff41] hover:text-[#0a0a0a] transition-colors uppercase"
              >
                [ TRANSMIT_IDEA ]
              </button>
            </form>
          )}
        </div>

        <p className="text-xs text-[#00ff41]/40 text-center tracking-widest">
          &gt; DIRECT_CHANNEL:{" "}
          <a href="mailto:admin@crashpulse.com" className="text-[#00ff41] hover:underline">
            admin@crashpulse.com
          </a>
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
