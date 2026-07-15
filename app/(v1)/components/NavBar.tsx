"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

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

type Me = { name: string | null; email: string; role: string } | null;

export function NavBarV3() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [me, setMe] = useState<Me>(undefined as unknown as Me);

  function refetchMe() {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setMe(data))
      .catch(() => setMe(null));
  }

  useEffect(() => {
    refetchMe();
    window.addEventListener("auth-change", refetchMe);
    return () => window.removeEventListener("auth-change", refetchMe);
  }, []);

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    await signOut({ redirect: false });
    setMe(null);
    window.dispatchEvent(new Event("auth-change"));
    router.push("/");
  }

  const displayName = me?.name ?? me?.email?.split("@")[0] ?? null;

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

          {/* User area (desktop) */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {me === (undefined as unknown as Me) ? (
              /* still loading — reserve space */
              <div className="w-24 h-5 rounded bg-[#00ff41]/10 animate-pulse" />
            ) : me ? (
              <>
                {me.role === "admin" && (
                  <Link
                    href="/admin"
                    className="font-mono text-[10px] tracking-widest text-red-400 hover:text-red-300 border border-red-800 hover:border-red-600 px-2 py-0.5 rounded transition-colors"
                  >
                    ADMIN
                  </Link>
                )}
                <span className="font-mono text-[11px] text-[#00cc33] truncate max-w-[140px]">
                  {displayName}
                </span>
                <button
                  onClick={handleSignOut}
                  className="font-mono text-[10px] tracking-widest text-[#00cc33] hover:text-[#00ff41] hover:bg-[#00ff41]/10 border border-[#00ff41]/30 hover:border-[#00ff41]/60 px-2 py-0.5 rounded transition-colors"
                >
                  SIGN OUT
                </button>
              </>
            ) : null}
          </div>

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

            {/* Mobile user area */}
            {me && (
              <div className="border-t border-[#00ff41]/20 mt-2 pt-2 px-4 flex items-center justify-between">
                <span className="font-mono text-[11px] text-[#00cc33] truncate">
                  {displayName}
                </span>
                <button
                  onClick={() => { setMobileOpen(false); handleSignOut(); }}
                  className="font-mono text-[10px] tracking-widest text-[#00cc33] hover:text-[#00ff41] border border-[#00ff41]/30 px-2 py-0.5 rounded transition-colors"
                >
                  SIGN OUT
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
