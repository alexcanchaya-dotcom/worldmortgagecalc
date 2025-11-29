import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About World Mortgage Calculator",
  description: "Mission, methodology, and data assumptions behind World Mortgage Calculator.",
};

export default function AboutPage() {
  return (
    <main className="bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-12 text-slate-900 sm:py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-10">
        <header className="space-y-3 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 shadow-inner shadow-sky-100">
            About
          </div>
          <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl sm:leading-tight">
            Mission and methodology
          </h1>
          <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
            We built World Mortgage Calculator to provide clear, global-friendly mortgage estimates with transparent assumptions, accessible design, and responsible disclosures.
          </p>
        </header>

        <section className="card-surface p-6">
          <h2 className="text-xl font-semibold text-slate-900">What we solve</h2>
          <p className="mt-2 text-slate-700">
            Mortgage shopping is confusing. Rates vary by country and compounding rules differ. We unify the basics: property price, down payment, APR, and term, then show monthly payments and total interest with clear assumptions.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="card-surface p-5">
            <h3 className="text-lg font-semibold text-slate-900">How the calculator works</h3>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>Applies a fixed-rate amortization formula with your selected compounding frequency.</li>
              <li>Updates in real time as you type with aria-live announcements for accessibility.</li>
              <li>Formats results using your chosen currency without storing your inputs.</li>
            </ul>
          </div>
          <div className="card-surface p-5">
            <h3 className="text-lg font-semibold text-slate-900">Data and assumptions</h3>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>No taxes, insurance, HOA fees, or PMI included.</li>
              <li>No currency conversion; we assume the currency you select is the loan currency.</li>
              <li>Payments are on time with no prepayment penalties considered.</li>
            </ul>
          </div>
        </section>

        <section className="card-surface p-6">
          <h3 className="text-lg font-semibold text-slate-900">Why trust us</h3>
          <p className="mt-2 text-slate-700">
            We avoid dark patterns, keep ads unobtrusive, and provide disclosure blocks directly next to results. Inputs stay on your device and any analytics are anonymized with consent.
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-slate-700">
            <span className="rounded-full bg-emerald-50 px-4 py-2 text-emerald-700">Transparent assumptions</span>
            <span className="rounded-full bg-blue-50 px-4 py-2 text-blue-700">Global currency support</span>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-slate-700">Accessible design</span>
          </div>
        </section>
      </div>
    </main>
  );
}
