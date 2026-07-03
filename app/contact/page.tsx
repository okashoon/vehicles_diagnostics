"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[#0a0e1a] text-white">
      <section className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-3xl font-extrabold text-white mb-10">Contact Us</h1>

        <div className="grid gap-12 lg:grid-cols-2 items-start">
          {/* Left — image + email */}
          <div className="space-y-6">
            <img
              src="https://crashpulse.com/wp-content/uploads/2025/05/frfr.png"
              alt="Crash Pulse CDX"
              className="w-full rounded-xl border border-zinc-800"
            />
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Email</h2>
              <a
                href="mailto:admin@crashpulse.com"
                className="text-[#e63946] hover:underline text-sm"
              >
                admin@crashpulse.com
              </a>
            </div>
          </div>

          {/* Right — form */}
          <div>
            {submitted ? (
              <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-12 text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20 mx-auto">
                  <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Message Sent!</h2>
                <p className="text-zinc-400 text-sm">
                  Thank you for reaching out. We&apos;ll be in touch shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ firstName: "", lastName: "", email: "", phone: "", message: "" });
                  }}
                  className="text-sm text-[#e63946] hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    First Name <span className="text-[#e63946]">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-zinc-700 bg-[#111827] px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-[#e63946] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Last Name <span className="text-[#e63946]">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-zinc-700 bg-[#111827] px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-[#e63946] focus:outline-none transition-colors"
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
                    className="w-full rounded-lg border border-zinc-700 bg-[#111827] px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-[#e63946] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Phone No
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-zinc-700 bg-[#111827] px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-[#e63946] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Your message (optional)
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full rounded-lg border border-zinc-700 bg-[#111827] px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-[#e63946] focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#e63946] px-6 py-3 text-sm font-bold text-white hover:bg-[#c1121f] transition-colors"
                >
                  Contact Us
                </button>
              </form>
            )}
          </div>
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
