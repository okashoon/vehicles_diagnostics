"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { label: "HOME", href: "/" },
  { label: "VALIDATION", href: "/validation" },
  { label: "ABOUT", href: "/about" },
  { label: "GALLERY", href: "/gallery" },
  { label: "CONTACT", href: "/contact" },
  { label: "INNOVATE", href: "/innovate" },
  // { label: "SETUP", href: "/setup-guide" },
  { label: "LOOKUP", href: "/lookup" },
];

export function NavBarV3() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b border-[#00ff41]/20 bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <img
              src="/crush_pulse_logo.jpeg"
              alt="Crash Pulse Technologies"
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "px-3 py-1 font-mono text-[11px] tracking-widest transition-colors",
                    isActive
                      ? "text-[#0a0a0a] bg-[#00ff41]"
                      : "text-[#00cc33] hover:text-[#00ff41] hover:bg-[#00ff41]/10",
                  ].join(" ")}
                >
                  {isActive ? `[${link.label}]` : link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 font-mono text-[#00cc33] hover:text-[#00ff41]"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? "[X]" : "[=]"}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[#00ff41]/20 py-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={[
                    "block px-4 py-2 font-mono text-xs tracking-widest transition-colors",
                    isActive
                      ? "text-[#0a0a0a] bg-[#00ff41]"
                      : "text-[#00cc33] hover:text-[#00ff41] hover:bg-[#00ff41]/10",
                  ].join(" ")}
                >
                  {isActive ? `> ${link.label}` : `  ${link.label}`}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
