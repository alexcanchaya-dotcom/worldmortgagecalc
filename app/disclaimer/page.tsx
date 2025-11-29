import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Important disclaimers about the World Mortgage Calculator results and content.",
};

export default function DisclaimerPage() {
  return (
    <main className="bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-12 text-slate-900 sm:py-16">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-10">
        <header className="space-y-3 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 shadow-inner shadow-sky-100">
            Disclaimer
          </div>
          <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl sm:leading-tight">Calculator disclaimer</h1>
          <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
            The calculator provides educational estimates only. It is not financial advice and should not replace conversations with licensed professionals.
          </p>
        </header>

        <section className="card-surface p-6">
          <h2 className="text-xl font-semibold text-slate-900">Key points</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
            <li>Results exclude taxes, insurance, fees, currency fluctuations, and lender-specific charges.</li>
            <li>Inputs remain on your device; no personal data is stored.</li>
            <li>Always confirm eligibility, rates, and closing costs with a lender.</li>
          </ul>
        </section>

        <section className="card-surface p-6">
          <h2 className="text-xl font-semibold text-slate-900">Advertising note</h2>
          <p className="text-sm text-slate-700">
            We reserve space for advertising that complies with Google AdSense guidelines. Ads are labeled and placed away from critical interactions to minimize distractions.
          </p>
        </section>
      </div>
    </main>
  );
}
