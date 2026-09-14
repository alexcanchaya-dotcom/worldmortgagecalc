import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Archived homepage",
  description: "This older homepage is kept only as an archive and should not be indexed.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/" },
};

export default function OldHomepage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-12 text-slate-900">
      <div className="mx-auto max-w-3xl space-y-6 rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-lg sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Archived page</p>
        <h1 className="text-3xl font-bold text-slate-900">This homepage is no longer current</h1>
        <p className="text-slate-700">
          You found an older landing page. The live calculator, including Ireland, now lives on the main site.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Go to the calculator
          </Link>
          <Link
            href="/ireland"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Ireland calculator
          </Link>
        </div>
      </div>
    </main>
  );
}
