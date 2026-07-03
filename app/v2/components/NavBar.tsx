"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "/v2" },
  { label: "About Us", href: "/v2/about" },
  { label: "Gallery", href: "/v2/gallery" },
  { label: "Validation", href: "/v2/validation" },
  { label: "Contact Us", href: "/v2/contact" },
  { label: "Have an innovative idea?", href: "/v2/innovate" },
  { label: "Setup", href: "/v2/setup-guide" },
  { label: "Lookup", href: "/v2/lookup" },
];

export function NavBarV2() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-[#0d1117] border-b border-[#1e2330]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/v2" className="shrink-0 text-sm font-bold tracking-tight text-white">
            crash<span className="text-[#3b82f6]">pulse</span>
          </Link>

          {/* Desktop nav — pill container */}
          <nav className="hidden lg:flex items-center bg-[#1e2330] border border-[#2d3748] rounded-full px-1.5 py-1 gap-0.5">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap",
                    isActive
                      ? "bg-[#3b82f6] text-white"
                      : "text-[#64748b] hover:text-white hover:bg-white/5",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg text-[#64748b] hover:text-white hover:bg-[#1e2330]"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[#1e2330] py-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={[
                    "block px-4 py-2 text-sm font-medium rounded-lg mx-1 transition-colors",
                    isActive
                      ? "bg-[#3b82f6] text-white"
                      : "text-[#64748b] hover:text-white hover:bg-[#1e2330]",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
