"use client";

import { useState } from "react";

export default function ContactV3() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const inputClass = "w-full border border-[#00ff41]/30 bg-[#111111] px-4 py-2.5 text-sm font-mono text-[#00ff41] placeholder-[#00ff41]/20 focus:border-[#00ff41] focus:outline-none transition-colors";

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e0ffe0] font-mono">
      <section className="mx-auto max-w-4xl px-4 py-16">
        <div className="mb-10">
          <p className="text-xs tracking-[0.3em] text-[#00ff41]/50 mb-2">// COMMS_CHANNEL</p>
          <h1 className="text-2xl font-black tracking-widest text-[#00ff41] uppercase">Contact Us</h1>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 items-start">
          {/* Left */}
          <div className="space-y-6">
            <div className="border border-[#00ff41]/20">
              <img
                src="https://crashpulse.com/wp-content/uploads/2025/05/frfr.png"
                alt="Crash Pulse CDX"
                className="w-full"
              />
            </div>
            <div className="border border-[#00ff41]/30 bg-[#111111] p-5">
              <p className="text-xs tracking-widest text-[#00ff41]/50 mb-2">// EMAIL</p>
              <a href="mailto:admin@crashpulse.com"
                className="text-[#00ff41] hover:underline text-sm">
                admin@crashpulse.com
              </a>
            </div>
          </div>

          {/* Right — form */}
          <div>
            {submitted ? (
              <div className="border border-[#00ff41]/40 bg-[#00ff41]/5 p-12 text-center space-y-4">
                <p className="text-[#00ff41] text-2xl font-black tracking-widest">[ OK ]</p>
                <h2 className="text-base font-bold tracking-widest text-[#e0ffe0] uppercase">
                  Message Transmitted
                </h2>
                <p className="text-[#00cc33] text-sm">
                  &gt; Thank you for reaching out. We&apos;ll be in touch shortly.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ firstName: "", lastName: "", email: "", phone: "", message: "" }); }}
                  className="text-xs text-[#00ff41] hover:underline tracking-widest"
                >
                  [SEND_ANOTHER]
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-xs tracking-[0.3em] text-[#00ff41]/50 mb-4">// INPUT_FIELDS</p>
                {[
                  { label: "FIRST_NAME", name: "firstName", type: "text", required: true },
                  { label: "LAST_NAME", name: "lastName", type: "text", required: true },
                  { label: "EMAIL_ADDR", name: "email", type: "email", required: true },
                  { label: "PHONE_NO", name: "phone", type: "tel", required: false },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-xs font-mono text-[#00cc33] mb-1.5 tracking-widest">
                      {field.label}{field.required && <span className="text-[#00ff41]"> *</span>}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={form[field.name as keyof typeof form]}
                      onChange={handleChange}
                      required={field.required}
                      className={inputClass}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-mono text-[#00cc33] mb-1.5 tracking-widest">
                    MESSAGE <span className="text-[#00ff41]/40">(OPTIONAL)</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full border border-[#00ff41] bg-[#00ff41]/10 px-6 py-3 text-xs font-bold font-mono tracking-widest text-[#00ff41] hover:bg-[#00ff41] hover:text-[#0a0a0a] transition-colors uppercase"
                >
                  [ TRANSMIT_MESSAGE ]
                </button>
              </form>
            )}
          </div>
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
