"use client";

import { useState } from "react";

export default function ContactV2() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", message: "" });
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
      <section className="mx-auto max-w-4xl px-4 py-16">
        <div className="mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#3b82f6]/30 bg-[#3b82f6]/10 px-3 py-1">
            <span className="text-xs font-medium text-[#93c5fd]">Get in Touch</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Contact Us</h1>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 items-start">
          {/* Left — image + email */}
          <div className="space-y-6">
            <img
              src="https://crashpulse.com/wp-content/uploads/2025/05/frfr.png"
              alt="Crash Pulse CDX"
              className="w-full rounded-2xl border border-[#2d3748]"
            />
            <div className="rounded-2xl border border-[#2d3748] bg-[#1e2330] p-5">
              <p className="text-xs font-medium text-[#64748b] mb-1 uppercase tracking-wide">Email</p>
              <a href="mailto:admin@crashpulse.com"
                className="text-[#3b82f6] hover:text-[#93c5fd] hover:underline text-sm font-medium">
                admin@crashpulse.com
              </a>
            </div>
          </div>

          {/* Right — form */}
          <div>
            {submitted ? (
              <div className="rounded-2xl border border-[#3b82f6]/20 bg-[#3b82f6]/5 p-12 text-center space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 mx-auto">
                  <svg className="h-7 w-7 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-white">Message Sent!</h2>
                <p className="text-[#64748b] text-sm">Thank you for reaching out. We&apos;ll be in touch shortly.</p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ firstName: "", lastName: "", email: "", phone: "", message: "" }); }}
                  className="text-sm text-[#3b82f6] hover:text-[#93c5fd] hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: "First Name", name: "firstName", type: "text", required: true },
                  { label: "Last Name", name: "lastName", type: "text", required: true },
                  { label: "Email", name: "email", type: "email", required: true },
                  { label: "Phone No", name: "phone", type: "tel", required: false },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-xs font-medium text-[#64748b] mb-1.5">
                      {field.label}{" "}
                      {field.required && <span className="text-[#3b82f6]">*</span>}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={form[field.name as keyof typeof form]}
                      onChange={handleChange}
                      required={field.required}
                      className="w-full rounded-xl border border-[#2d3748] bg-[#1e2330] px-4 py-2.5 text-sm text-white placeholder-[#334155] focus:border-[#3b82f6] focus:outline-none transition-colors"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-[#64748b] mb-1.5">
                    Your message (optional)
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full rounded-xl border border-[#2d3748] bg-[#1e2330] px-4 py-2.5 text-sm text-white placeholder-[#334155] focus:border-[#3b82f6] focus:outline-none transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#3b82f6] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2563eb] transition-colors"
                >
                  Contact Us
                </button>
              </form>
            )}
          </div>
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
