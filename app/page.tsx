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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            World Mortgage Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calculate your mortgage payments across multiple countries.
            Get accurate estimates for monthly payments, total interest, and amortization schedules.
          </p>
        </div>

        {/* Region Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map((region) => (
            <div key={region.slug}>
              {region.available ? (
                <Link
                  href={`/${region.slug}`}
                  className="block h-full"
                >
                  <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-8 h-full border-2 border-transparent hover:border-indigo-500">
                    <div className="text-6xl mb-4">{region.flag}</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {region.name}
                    </h2>
                    <p className="text-gray-600 mb-4">{region.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-indigo-600">
                        Currency: {region.currency}
                      </span>
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                        Available
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="bg-white rounded-xl shadow-md p-8 h-full opacity-60">
                  <div className="text-6xl mb-4 grayscale">{region.flag}</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {region.name}
                  </h2>
                  <p className="text-gray-600 mb-4">{region.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-500">
                      Currency: {region.currency}
                    </span>
                    <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                      Coming Soon
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Why Use World Mortgage Calculator?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Accurate Calculations</h3>
              <p className="text-gray-600">
                Get precise monthly payment estimates based on current mortgage rates
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Detailed Breakdown</h3>
              <p className="text-gray-600">
                View complete amortization schedules and interest vs. principal splits
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Multi-Region Support</h3>
              <p className="text-gray-600">
                Compare mortgage options across different countries and currencies
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600">
          <p>© 2025 World Mortgage Calculator. Start with Ireland, expanding globally.</p>
        </footer>
      </div>
    </main>
  );
}
