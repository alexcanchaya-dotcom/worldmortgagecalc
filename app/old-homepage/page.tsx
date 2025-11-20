import Link from 'next/link';

const regions = [
  {
    name: 'Ireland',
    slug: 'ireland',
    flag: '🇮🇪',
    currency: 'EUR',
    description: 'Calculate your Irish mortgage with current ECB rates',
    available: true
  },
  {
    name: 'United Kingdom',
    slug: 'uk',
    flag: '🇬🇧',
    currency: 'GBP',
    description: 'UK mortgage calculator coming soon',
    available: false
  },
  {
    name: 'United States',
    slug: 'usa',
    flag: '🇺🇸',
    currency: 'USD',
    description: 'US mortgage calculator coming soon',
    available: false
  },
  {
    name: 'Canada',
    slug: 'canada',
    flag: '🇨🇦',
    currency: 'CAD',
    description: 'Canadian mortgage calculator coming soon',
    available: false
  },
  {
    name: 'Spain',
    slug: 'spain',
    flag: '🇪🇸',
    currency: 'EUR',
    description: 'Spanish mortgage calculator coming soon',
    available: false
  }
];

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Hero */}
        <div className="bg-white/80 backdrop-blur shadow-lg rounded-2xl p-8 border border-indigo-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium">
                <span className="text-lg">📈</span>
                Plan confidently with rate-aware projections
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                World Mortgage Calculator
              </h1>
              <p className="text-lg text-gray-600">
                Compare mortgages across markets with clear payment breakdowns, quick sensitivity checks,
                and transparent amortization schedules tailored for each region.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/ireland"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  Start with Ireland
                </Link>
                <a
                  href="#roadmap"
                  className="px-5 py-3 rounded-xl border border-indigo-200 text-indigo-700 font-semibold bg-indigo-50 hover:bg-indigo-100 transition"
                >
                  See upcoming markets
                </a>
                <Link
                  href="/"
                  className="px-5 py-3 rounded-xl bg-white/80 text-gray-900 font-semibold border border-indigo-100 shadow-sm hover:shadow-md transition-transform hover:-translate-y-0.5"
                >
                  Try the calculator
                </Link>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  ECB-aligned rate defaults
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  Instant amortization tables
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Modern, mobile-friendly UI
                </span>
              </div>
            </div>
            <div className="flex-1 bg-gradient-to-br from-indigo-500/90 to-blue-500 rounded-xl text-white p-6 shadow-lg">
              <div className="text-sm uppercase tracking-wide text-indigo-100 mb-2">Snapshot</div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-indigo-100">Active country</span>
                  <span className="font-semibold">Ireland 🇮🇪</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-indigo-100">Base rate reference</span>
                  <span className="font-semibold">ECB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-indigo-100">Explore next</span>
                  <span className="font-semibold">UK · US · Canada · Spain</span>
                </div>
                <div className="pt-2 text-sm text-indigo-100">
                  Built for worldwide house hunters, brokers, and expats who need clarity before committing.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Available & roadmap */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Coverage</p>
              <h2 className="text-2xl font-bold text-gray-900">Start calculating in seconds</h2>
            </div>
            <span className="text-sm text-gray-500">Tap a card to open the calculator</span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regions.map((region) => (
              <div key={region.slug} className="relative group h-full">
                {region.available ? (
                  <Link
                    href={`/${region.slug}`}
                    className="block h-full"
                  >
                    <div className="h-full bg-white rounded-2xl border border-indigo-100 shadow-sm group-hover:shadow-xl transition-all duration-300 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">{region.flag}</div>
                        <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">Live</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{region.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{region.description}</p>
                      <div className="text-sm text-indigo-700 font-semibold">
                        Currency: {region.currency}
                      </div>
                      <div className="mt-4 h-1.5 w-full rounded-full bg-indigo-50 overflow-hidden">
                        <span className="block h-full bg-gradient-to-r from-indigo-500 to-indigo-600 group-hover:scale-x-105 origin-left transition" />
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="h-full bg-white rounded-2xl border border-dashed border-gray-200 shadow-inner p-6 opacity-80">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-4xl grayscale">{region.flag}</div>
                      <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-semibold">In design</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{region.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{region.description}</p>
                    <div className="text-sm text-gray-500 font-medium">Currency: {region.currency}</div>
                    <div className="mt-4 text-xs text-gray-500">Notify us if you need this region sooner.</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Feature highlights */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="col-span-2 bg-white shadow-lg rounded-2xl p-6 border border-indigo-50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Clarity from the first slider move</h2>
              <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">Frictionless UX</span>
            </div>
            <p className="text-gray-600 mb-6">
              Real-time recalculations keep you oriented on affordability while contextual hints explain each metric.
              Export-friendly tables and mobile-friendly layouts make it easy to share with partners or brokers.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[{title:'Accurate calculations',desc:'Standard amortization math with clear assumptions.'},{title:'Data you can trust',desc:'Defaults tuned to ECB guidance and localized currency formatting.'},{title:'Explainable outputs',desc:'Monthly, total paid, and interest share all surfaced instantly.'},{title:'Built for speed',desc:'No clutter—just the numbers that matter to buyers.'}].map((item) => (
                <div key={item.title} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-sky-500 text-white rounded-2xl p-6 shadow-lg flex flex-col gap-4">
            <h3 className="text-xl font-semibold">Built for worldwide expansion</h3>
            <p className="text-indigo-50 text-sm">
              The layout is ready for additional countries with consistent UX, currency-aware formatting, and configurable
              rate presets to keep calculations aligned with local lending norms.
            </p>
            <ul className="text-sm space-y-2 text-indigo-50">
              <li className="flex items-center gap-2">✅ Mobile-first UI tested with sliders and tables</li>
              <li className="flex items-center gap-2">✅ Simple theming for regional colors and badges</li>
              <li className="flex items-center gap-2">✅ Clear roadmap so users know what is shipping next</li>
            </ul>
          </div>
        </div>

        {/* Premium CTA */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-indigo-200/40">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <p className="text-sm uppercase tracking-wide text-indigo-200">Advanced</p>
              <h2 className="text-2xl md:text-3xl font-bold">Preview the concierge-grade calculator experience</h2>
              <p className="text-indigo-100/90 text-sm md:text-base">
                Explore a darker, advanced layout with scenario layering, stress-test toggles, export-ready PDFs, and team collaboration features designed for brokers and advisors who need elevated visuals.
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-indigo-100/90">
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">Scenario layering</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">Branded exports</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">Priority support</span>
              </div>
            </div>
            <Link
              href="/"
              className="px-5 py-3 rounded-xl bg-white text-slate-900 font-semibold shadow-lg shadow-black/30 hover:-translate-y-0.5 transform transition"
            >
              View main calculator
            </Link>
          </div>
        </div>

        {/* Roadmap */}
        <div id="roadmap" className="bg-white shadow-lg rounded-2xl p-6 border border-indigo-50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Roadmap</p>
              <h2 className="text-2xl font-bold text-gray-900">Upcoming releases</h2>
            </div>
            <span className="text-sm text-gray-500">Prioritised by user demand</span>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {[{label:'United Kingdom',note:'Track Bank of England base rates and fixed terms'},{label:'United States',note:'Conventional vs FHA-style scenarios'},{label:'Canada',note:'Stress-test ready calculations'},{label:'Spain',note:'Euribor-aligned projections'}].map((item) => (
              <div key={item.label} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-600 mt-1">{item.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500">
          <p>© 2025 World Mortgage Calculator. Built for modern home buyers and brokers.</p>
        </footer>
      </div>
    </main>
  );
}
