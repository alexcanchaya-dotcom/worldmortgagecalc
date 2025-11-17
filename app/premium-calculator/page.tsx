import Link from 'next/link';

const featureHighlights = [
  {
    title: 'Scenario layering',
    description: 'Stack multiple down payment, rate, and term options to see the optimal monthly profile.',
    icon: '✨'
  },
  {
    title: 'Broker-grade exports',
    description: 'Generate polished PDF and CSV outputs that are easy to send to buyers and lending partners.',
    icon: '📤'
  },
  {
    title: 'Market-aware defaults',
    description: 'Preloaded spreads for ECB, BoE, and Fed benchmarks so calculations stay realistic.',
    icon: '🌐'
  },
  {
    title: 'Stress testing',
    description: 'Simulate rate shocks, payment holidays, and lump-sum prepayments with a single click.',
    icon: '🛡️'
  },
  {
    title: 'Portfolio view',
    description: 'Track multiple properties side-by-side with currency-aware totals and trendlines.',
    icon: '📊'
  },
  {
    title: 'White-glove support',
    description: 'Priority responses, onboarding sessions, and roadmap influence for your team.',
    icon: '🤝'
  }
];

const comparisonRows = [
  {
    label: 'Regions covered',
    standard: 'Ireland (public roadmap for more)',
    advanced: 'Ireland + early access to UK, US, Canada, Spain'
  },
  {
    label: 'Scenario saves',
    standard: 'Single scenario',
    advanced: 'Unlimited named scenarios with sharing links'
  },
  {
    label: 'Exports',
    standard: 'Basic CSV export',
    advanced: 'Branded PDF, CSV, and Google Sheets sync'
  },
  {
    label: 'Support',
    standard: 'Email within 48h',
    advanced: 'Same-day priority chat + onboarding call'
  },
  {
    label: 'Collaboration',
    standard: '—',
    advanced: 'Team workspaces with permissions'
  },
  {
    label: 'Stress tests',
    standard: 'Manual inputs only',
    advanced: 'Preset shocks, holidays, prepayment toggles'
  }
];

const faqs = [
  {
    question: 'Who is the advanced calculator for?',
    answer: 'It is built for brokers, buyer agents, and financial planners who need reliable scenarios to share with clients.'
  },
  {
    question: 'Can we customize currencies and branding?',
    answer: 'Yes. Advanced plans include currency toggles, logo placement, and brand color accents on exports.'
  },
  {
    question: 'Do you support enterprise security reviews?',
    answer: 'We provide data handling docs, uptime commitments, and optional SSO add-ons for enterprise teams.'
  },
  {
    question: 'How quickly can we get access?',
    answer: 'You can start within 1 business day. Early access to new regions is granted as soon as they are staged.'
  }
];

export default function AdvancedCalculator() {
  return (
    <main className="min-h-screen bg-[#0b1021] text-white pb-16">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.24),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.2),transparent_30%)]" />
        <div className="absolute -left-10 -top-10 h-60 w-60 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -right-16 top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 pt-10 space-y-12">
          <header className="flex items-center justify-between text-sm text-indigo-100/80">
            <Link href="/" className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 ring-1 ring-white/15 hover:bg-white/20 transition">
              <span>←</span> Back to home
            </Link>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-100 ring-1 ring-emerald-300/40">Advanced preview</span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 ring-1 ring-white/10">Last updated: Jan 2025</span>
            </div>
          </header>

          <section className="grid lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-3 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 ring-1 ring-white/15 text-sm text-indigo-100">
                <span className="text-lg">💫</span>
                Advanced calculator experience
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-white">
                  Precision-built mortgage workflows with concierge visuals
                </h1>
                <p className="text-lg text-indigo-100/90 leading-relaxed">
                  Upgrade to a broker-grade workspace that pairs elegant UI with serious calculation controls. Deliver export-ready scenarios, compare regions side-by-side, and stress test in seconds—all within a focused, distraction-free layout.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                <Link
                  href="/ireland"
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 text-[#0b1021] font-semibold shadow-emerald-500/30 shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
                >
                  Try the live calculator
                </Link>
                <a
                  href="mailto:hello@worldmortgagecalc.com"
                  className="px-5 py-3 rounded-2xl border border-white/30 text-white font-semibold bg-white/5 hover:bg-white/10 transition"
                >
                  Book a demo
                </a>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-indigo-100/90 ring-1 ring-white/10">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  Concierge onboarding available
                </span>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 text-sm text-indigo-100/90">
                <div className="p-4 rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <p className="text-xs uppercase tracking-wide text-indigo-200/80">Regions</p>
                  <p className="text-xl font-semibold text-white">Ireland + early access to UK, US, Canada, Spain</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <p className="text-xs uppercase tracking-wide text-indigo-200/80">Exports</p>
                  <p className="text-xl font-semibold text-white">PDF, CSV, Sheets sync with brand accents</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <p className="text-xs uppercase tracking-wide text-indigo-200/80">Support</p>
                  <p className="text-xl font-semibold text-white">Priority chat and setup within 1 business day</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="relative rounded-3xl bg-white/5 ring-1 ring-white/10 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-emerald-500/20" />
                <div className="relative p-6 space-y-6">
                  <div className="flex items-center justify-between text-sm text-indigo-100/90">
                    <span className="px-3 py-1 rounded-full bg-indigo-400/20 ring-1 ring-indigo-300/40">Live preview</span>
                    <span className="text-xs">EUR · GBP · USD</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-indigo-100">
                      <span className="text-sm">Sample monthly</span>
                      <span className="text-3xl font-semibold text-white">€1,586</span>
                    </div>
                    <div className="flex items-center justify-between text-indigo-100/90 text-sm">
                      <span>Rate stress (+1.5%)</span>
                      <span className="font-semibold text-amber-200">€1,742</span>
                    </div>
                    <div className="flex items-center justify-between text-indigo-100/90 text-sm">
                      <span>Prepayment (5k/yr)</span>
                      <span className="font-semibold text-emerald-200">Saves 2.1 years</span>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 space-y-2">
                    <div className="flex items-center justify-between text-sm text-indigo-100/80">
                      <span>Principal</span>
                      <span className="text-white font-semibold">€320k</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-indigo-100/80">
                      <span>Rate</span>
                      <span className="text-white font-semibold">3.5% (ECB + 1.2%)</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-indigo-100/80">
                      <span>Term</span>
                      <span className="text-white font-semibold">28 years</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-indigo-100/80">
                      <span>Prepay cadence</span>
                      <span className="text-white font-semibold">€5k / year</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center text-xs text-indigo-100/80">
                    <div className="p-3 rounded-xl bg-indigo-400/15 ring-1 ring-indigo-300/30">
                      <p className="text-[11px] uppercase tracking-wide">Interest share</p>
                      <p className="text-lg font-semibold text-white">43%</p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-400/15 ring-1 ring-emerald-300/30">
                      <p className="text-[11px] uppercase tracking-wide">Payoff</p>
                      <p className="text-lg font-semibold text-white">Aug 2053</p>
                    </div>
                    <div className="p-3 rounded-xl bg-sky-400/15 ring-1 ring-sky-300/30">
                      <p className="text-[11px] uppercase tracking-wide">Savings vs base</p>
                      <p className="text-lg font-semibold text-emerald-100">€18.4k</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-indigo-100/80">
                    <span>Share with buyers</span>
                    <button className="px-4 py-2 rounded-full bg-white text-[#0b1021] font-semibold hover:-translate-y-0.5 transform transition shadow-lg shadow-white/30">
                      Copy link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid md:grid-cols-3 gap-6">
            {featureHighlights.map((item) => (
              <div key={item.title} className="group rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 space-y-3 hover:bg-white/8 transition">
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 text-sm text-indigo-100">
                  <span className="text-lg">{item.icon}</span>
                  {item.title}
                </div>
                <p className="text-indigo-100/90 leading-relaxed text-sm">{item.description}</p>
              </div>
            ))}
          </section>

          <section className="grid lg:grid-cols-2 gap-6 items-start">
            <div className="rounded-3xl bg-gradient-to-br from-indigo-600/80 via-indigo-500/80 to-sky-500/80 p-8 shadow-xl ring-1 ring-white/10">
              <div className="flex items-center justify-between text-sm text-indigo-100/90 mb-6">
                <span className="px-3 py-1 rounded-full bg-white/10 ring-1 ring-white/20">Advanced plan</span>
                <span className="px-3 py-1 rounded-full bg-emerald-400/20 ring-1 ring-emerald-300/50 text-emerald-50">Limited early access</span>
              </div>
              <h2 className="text-3xl font-semibold text-white mb-3">Concierge-grade mortgage calculator</h2>
              <p className="text-indigo-100/90 mb-6 leading-relaxed">
                The advanced experience is for teams that need elevated visuals, rapid scenario building, and export-ready reporting. We tailor onboarding to your markets and help you stand up templates that match your brand.
              </p>
              <div className="space-y-3 text-sm text-white/90">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  Unlimited saved scenarios with sharing links
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  Export-ready PDF, CSV, and Google Sheets sync
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  Region expansion priority + custom branding
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  Stress tests, prepayments, and holiday toggles
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="mailto:hello@worldmortgagecalc.com"
                  className="px-5 py-3 rounded-2xl bg-white text-[#0b1021] font-semibold shadow-lg shadow-black/30 hover:-translate-y-0.5 transform transition"
                >
                  Talk to us
                </a>
                <Link
                  href="/ireland"
                  className="px-5 py-3 rounded-2xl bg-white/10 text-white font-semibold ring-1 ring-white/20 hover:bg-white/15 transition"
                >
                  Explore Ireland calculator
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-6 space-y-4">
              <div className="flex items-center justify-between text-sm text-indigo-100/90">
                <h3 className="text-xl font-semibold text-white">Advanced vs standard</h3>
                <span className="px-3 py-1 rounded-full bg-white/10 ring-1 ring-white/20">Transparent inclusions</span>
              </div>
              <div className="divide-y divide-white/10">
                {comparisonRows.map((row) => (
                  <div key={row.label} className="py-4 grid grid-cols-3 gap-3 text-sm">
                    <div className="text-indigo-100/80">{row.label}</div>
                    <div className="text-indigo-100">{row.standard}</div>
                    <div className="text-white font-semibold">{row.advanced}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-8 space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-indigo-200/80">FAQs</p>
                <h3 className="text-2xl font-semibold text-white">What to expect from the advanced experience</h3>
              </div>
              <a
                href="mailto:hello@worldmortgagecalc.com"
                className="px-4 py-2 rounded-full bg-white text-[#0b1021] font-semibold shadow-lg shadow-white/30 hover:-translate-y-0.5 transform transition"
              >
                Ask a question
              </a>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {faqs.map((item) => (
                <div key={item.question} className="p-4 rounded-2xl bg-white/5 ring-1 ring-white/10 space-y-2">
                  <p className="text-sm font-semibold text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-300" />
                    {item.question}
                  </p>
                  <p className="text-sm text-indigo-100/90 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
