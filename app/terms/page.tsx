export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-12 text-slate-900 sm:py-16">
      <div className="mx-auto flex w-full max-w-4xl flex-col space-y-8 rounded-[28px] border border-slate-300 bg-white/90 p-6 shadow-lg shadow-[0_25px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-10">
        <header className="space-y-3 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 shadow-inner shadow-sky-100">
            Terms of Service
          </div>
          <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl sm:leading-tight">
            World Mortgage Calculator Terms of Service
          </h1>
          <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
            Please read these terms before using the calculator. By using the site, you agree to these conditions.
          </p>
          <p className="text-sm text-slate-600">Effective date: November 17, 2025</p>
        </header>

        <section className="space-y-3 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-6 shadow-lg shadow-slate-200/80">
          <h2 className="text-2xl font-semibold text-slate-900">Purpose of the tool</h2>
          <p className="text-slate-700">
            The calculator provides mortgage payment estimates for informational and educational purposes only. It does not constitute financial, legal, or tax advice.
          </p>
        </section>

        <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/80">
          <h2 className="text-2xl font-semibold text-slate-900">Accuracy and limitations</h2>
          <ul className="list-disc space-y-2 pl-5 text-slate-700">
            <li><strong className="text-slate-900">Estimates only:</strong> Results are approximations based on the inputs you provide and may not reflect actual loan offers.</li>
            <li><strong className="text-slate-900">Excluded costs:</strong> Taxes, insurance, fees, and currency fluctuations may change your real payment.</li>
            <li><strong className="text-slate-900">No warranty:</strong> We make no guarantees about the accuracy, completeness, or reliability of calculations or content.</li>
          </ul>
        </section>

        <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/80">
          <h2 className="text-2xl font-semibold text-slate-900">User responsibilities</h2>
          <ul className="list-disc space-y-2 pl-5 text-slate-700">
            <li>Verify results with a qualified lender or advisor before making decisions.</li>
            <li>Use the tool lawfully and without attempting to disrupt or reverse-engineer the service.</li>
            <li>Maintain your own device and network security while using the site.</li>
          </ul>
        </section>

        <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/80">
          <h2 className="text-2xl font-semibold text-slate-900">Liability</h2>
          <p className="text-slate-700">
            World Mortgage Calculator and its contributors are not liable for any decisions, losses, or damages resulting from your use of the tool or reliance on its outputs.
          </p>
        </section>

        <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/80">
          <h2 className="text-2xl font-semibold text-slate-900">Intellectual property</h2>
          <p className="text-slate-700">
            The site, its design, and content are protected by copyright. You may use the calculator for personal or internal business purposes, but you may not reproduce or redistribute the site without permission.
          </p>
        </section>

        <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/80">
          <h2 className="text-2xl font-semibold text-slate-900">Changes</h2>
          <p className="text-slate-700">
            We may update these terms from time to time. Continued use after updates constitutes acceptance of the revised terms.
          </p>
        </section>

        <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5 text-sm text-amber-900 shadow-inner shadow-amber-100">
          By using World Mortgage Calculator, you acknowledge that the tool provides estimates only and agree that you are responsible for any decisions made based on those estimates.
        </div>
      </div>
    </main>
  );
}
