"use client";

import { useMemo, useState } from "react";

export default function HomePage() {
  const [propertyPrice, setPropertyPrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [interestRate, setInterestRate] = useState(3.5);
  const [loanTerm, setLoanTerm] = useState(30);

  const loanAmount = Math.max(0, propertyPrice - downPayment);

  const monthlyPayment = useMemo(() => {
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;

    if (monthlyRate === 0) {
      return loanAmount / totalPayments;
    }

    return (
      loanAmount *
      ((monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1))
    );
  }, [interestRate, loanAmount, loanTerm]);

  const totalPaid = monthlyPayment * loanTerm * 12;
  const totalInterest = totalPaid - loanAmount;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-4 py-10 sm:py-16 scroll-smooth">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.15),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.15),transparent_30%),radial-gradient(circle_at_70%_80%,rgba(14,165,233,0.2),transparent_32%)]" />
        <div className="pointer-events-none absolute inset-y-0 left-1/3 w-[40vw] blur-3xl bg-gradient-to-b from-indigo-500/20 via-emerald-400/20 to-transparent" />
        <div className="pointer-events-none absolute -top-24 right-0 w-64 h-64 rounded-full bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-emerald-400/20 blur-3xl" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col space-y-12 rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-12">
        <header className="flex flex-col gap-6 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100 shadow-inner shadow-white/10 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-300 animate-pulse" />
            Premium mortgage insights
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold leading-tight text-white sm:text-5xl sm:leading-tight">
              Get a crystal-clear view of your monthly mortgage payment
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-relaxed text-slate-200 sm:text-lg">
              Model scenarios in seconds with a refined calculator built for modern homeowners and advisors. Adjust inputs and instantly see how your monthly payment, total payoff, and interest respond.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#calculator"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-emerald-400/30 active:scale-[0.99]"
            >
              Start calculating
              <span className="h-5 w-5 rounded-full bg-white/20 backdrop-blur-sm transition group-hover:translate-x-1">→</span>
            </a>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white shadow-inner shadow-white/5 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-200/50 hover:bg-white/10 hover:shadow-lg hover:shadow-emerald-400/30 active:scale-[0.99]"
            >
              Save scenario
            </button>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]" id="calculator">
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/40 backdrop-blur-xl sm:p-8">
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-white/5 via-transparent to-transparent" />
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-100" htmlFor="property-price">
                  Property price
                </label>
                <input
                  id="property-price"
                  type="number"
                  min={0}
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(Number(e.target.value) || 0)}
                  className="w-full rounded-2xl border border-white/15 bg-slate-900/60 px-4 py-3 text-base text-white shadow-inner shadow-black/60 outline-none ring-0 transition duration-300 hover:-translate-y-0.5 hover:border-indigo-200/60 hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)] focus:-translate-y-0.5 focus:border-emerald-300/80 focus:ring-4 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-100" htmlFor="down-payment">
                  Down payment
                </label>
                <input
                  id="down-payment"
                  type="number"
                  min={0}
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value) || 0)}
                  className="w-full rounded-2xl border border-white/15 bg-slate-900/60 px-4 py-3 text-base text-white shadow-inner shadow-black/60 outline-none transition duration-300 hover:-translate-y-0.5 hover:border-indigo-200/60 hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)] focus:-translate-y-0.5 focus:border-emerald-300/80 focus:ring-4 focus:ring-indigo-500/20"
                />
                <p className="text-xs text-slate-300">Loan amount is automatically calculated from price minus down payment.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-100" htmlFor="interest-rate">
                    Interest rate (APR)
                  </label>
                  <input
                    id="interest-rate"
                    type="number"
                    min={0}
                    step={0.1}
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                    className="w-full rounded-2xl border border-white/15 bg-slate-900/60 px-4 py-3 text-base text-white shadow-inner shadow-black/60 outline-none transition duration-300 hover:-translate-y-0.5 hover:border-indigo-200/60 hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)] focus:-translate-y-0.5 focus:border-emerald-300/80 focus:ring-4 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-100" htmlFor="loan-term">
                    Loan term (years)
                  </label>
                  <input
                    id="loan-term"
                    type="number"
                    min={1}
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value) || 0)}
                    className="w-full rounded-2xl border border-white/15 bg-slate-900/60 px-4 py-3 text-base text-white shadow-inner shadow-black/60 outline-none transition duration-300 hover:-translate-y-0.5 hover:border-indigo-200/60 hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)] focus:-translate-y-0.5 focus:border-emerald-300/80 focus:ring-4 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 shadow-inner shadow-white/5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> Real-time recalculations
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 shadow-inner shadow-white/5">
                  <span className="h-2 w-2 rounded-full bg-indigo-400" /> Crisp financial breakdowns
                </span>
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/70 to-indigo-900/80 p-6 shadow-2xl shadow-black/50 transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(0,0,0,0.55)] sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.05),transparent_25%),radial-gradient(circle_at_80%_30%,rgba(99,102,241,0.1),transparent_30%)]" />
            <div className="relative space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-indigo-200">Live preview</p>
                  <p className="text-3xl font-bold text-white sm:text-4xl">{formatCurrency(monthlyPayment || 0)}</p>
                  <p className="text-sm text-slate-300">Estimated monthly payment</p>
                </div>
                <div className="flex flex-col items-end gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-right text-xs font-semibold uppercase tracking-widest text-emerald-100 shadow-inner shadow-white/10">
                  <span className="text-[11px] text-slate-200">Confidence</span>
                  <span className="flex items-center gap-1 text-base text-emerald-300">
                    98%
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  </span>
                </div>
              </div>

              <div className="grid gap-4 text-sm text-slate-100">
                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-lg shadow-black/40 transition duration-300 hover:-translate-y-1 hover:border-emerald-200/60 hover:shadow-emerald-400/30">
                  <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-emerald-400/10 via-transparent to-transparent" />
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-200">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" /> Loan amount
                    </span>
                    <span className="text-lg font-semibold text-white">{formatCurrency(loanAmount)}</span>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-lg shadow-black/40 transition duration-300 hover:-translate-y-1 hover:border-indigo-200/60 hover:shadow-indigo-400/30">
                  <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-indigo-400/10 via-transparent to-transparent" />
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-200">
                      <span className="h-2.5 w-2.5 rounded-full bg-indigo-300" /> Total paid over {loanTerm} years
                    </span>
                    <span className="text-lg font-semibold text-white">{formatCurrency(totalPaid || 0)}</span>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-lg shadow-black/40 transition duration-300 hover:-translate-y-1 hover:border-purple-200/60 hover:shadow-purple-400/30">
                  <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-purple-400/10 via-transparent to-transparent" />
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-200">
                      <span className="h-2.5 w-2.5 rounded-full bg-purple-300" /> Total interest
                    </span>
                    <span className="text-lg font-semibold text-white">{formatCurrency(totalInterest || 0)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
                <p className="max-w-xl leading-relaxed">
                  This calculator uses a standard amortization formula. Values are estimates and for general guidance only.
                </p>
                <a
                  href="#calculator"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 font-semibold text-emerald-200 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-200/60 hover:bg-emerald-400/10 hover:text-white hover:shadow-lg hover:shadow-emerald-400/30 active:scale-[0.99]"
                >
                  View breakdown
                  <span className="text-lg">↗</span>
                </a>
              </div>
            </div>
          </section>
        </div>

        <section className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/40 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200">Built for clarity</p>
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">Feature highlights</h2>
              <p className="max-w-2xl text-sm text-slate-200 sm:text-base">
                Everything you need to evaluate a mortgage with confidence. Each card responds with soft hover states for delightful micro-interactions.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-slate-200 shadow-inner shadow-white/10">
              Smooth transitions • Premium palette
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {["Precision inputs", "Scenario ready", "Instant insights", "Modern visuals", "Actionable breakdown", "Always on"]
              .map((title, index) => (
                <article
                  key={title}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 p-4 shadow-lg shadow-black/35 transition duration-300 hover:-translate-y-1 hover:border-emerald-200/60 hover:shadow-2xl hover:shadow-emerald-400/30"
                >
                  <div className="absolute -right-10 -top-12 h-24 w-24 rounded-full bg-gradient-to-br from-indigo-400/30 via-purple-400/30 to-emerald-300/30 blur-2xl transition duration-500 group-hover:scale-150" />
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900/70 text-lg font-semibold text-white shadow-inner shadow-black/50 transition duration-300 group-hover:scale-105 group-hover:bg-slate-900/90">
                      {index + 1}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-indigo-100 transition duration-300 group-hover:border-indigo-200/60 group-hover:bg-indigo-500/20">
                      Premium
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <p className="text-sm leading-relaxed text-slate-200">
                      Fine-tuned controls and thoughtful visuals keep every calculation crisp, whether you are advising clients or planning your next move.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-200 transition duration-300 hover:text-white"
                  >
                    Explore
                    <span className="transition duration-300 group-hover:translate-x-1">→</span>
                  </button>
                </article>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}
