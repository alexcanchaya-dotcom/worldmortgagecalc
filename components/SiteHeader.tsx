"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { navLinks } from "@/lib/site";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="World Mortgage Calculator home">
          <Image src="/logo-wordmark.svg" alt="World Mortgage Calculator" width={240} height={40} priority />
        </Link>
        <nav className="hidden items-center gap-4 text-sm font-semibold text-slate-700 sm:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <Link key={link.href} className="rounded-full px-3 py-2 transition hover:bg-slate-100" href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 sm:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>
      {menuOpen && (
        <nav
          id="mobile-nav"
          className="border-t border-slate-200 bg-white px-4 py-3 sm:hidden"
          aria-label="Mobile"
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 text-sm font-semibold text-slate-800">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                className="rounded-2xl px-3 py-3 hover:bg-slate-100"
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
