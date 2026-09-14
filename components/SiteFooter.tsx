import Image from "next/image";
import Link from "next/link";
import { navLinks, sisterSites } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <Image src="/logo-wordmark.svg" alt="World Mortgage Calculator" width={210} height={36} />
            <p className="text-sm text-slate-600">
              Fast, transparent mortgage estimates with clear assumptions and disclosures.
            </p>
            <p className="text-xs text-slate-500">Educational estimates only. This is not financial advice.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700">
            {navLinks.map((link) => (
              <Link key={link.href} className="rounded-full px-3 py-2 transition hover:bg-slate-100" href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="border-t border-slate-200 pt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Sister sites</p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
            {sisterSites.map((site) => (
              <a
                key={site.href}
                href={site.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-slate-100 px-4 py-2 text-slate-800 hover:bg-slate-200"
              >
                {site.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
