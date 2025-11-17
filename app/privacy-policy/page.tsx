export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-12 text-slate-900 sm:py-16">
      <div className="mx-auto flex w-full max-w-4xl flex-col space-y-8 rounded-[28px] border border-slate-300 bg-white/90 p-6 shadow-lg shadow-[0_25px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-10">
        <header className="space-y-3 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 shadow-inner shadow-sky-100">
            Privacy Policy
          </div>
          <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl sm:leading-tight">
            World Mortgage Calculator Privacy Policy
          </h1>
          <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
            We built World Mortgage Calculator to give you quick mortgage estimates while keeping your data private. This page explains what we collect (very little), why, and how we protect your privacy.
          </p>
          <p className="text-sm text-slate-600">Effective date: November 17, 2025</p>
        </header>

        <section className="space-y-3 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-6 shadow-lg shadow-slate-200/80">
          <h2 className="text-2xl font-semibold text-slate-900">What data we collect</h2>
          <ul className="list-disc space-y-2 pl-5 text-slate-700">
            <li>
              <strong className="text-slate-900">No personal data stored:</strong> Mortgage calculations run entirely in your browser. We do not store your property details, payment assumptions, or any identifiers on our servers.
            </li>
            <li>
              <strong className="text-slate-900">Temporary inputs:</strong> Values you type are held in your current session only to perform calculations and are not sent to us.
            </li>
          </ul>
        </section>

        <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/80">
          <h2 className="text-2xl font-semibold text-slate-900">Cookies and local storage</h2>
          <p className="text-slate-700">
            Our calculator is designed to avoid tracking. We do not intentionally set cookies or persist your calculator inputs. If we ever add optional features that use cookies (for example, saving your last scenario), we will clearly explain the purpose and provide a way to opt out.
          </p>
        </section>

        <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/80">
          <h2 className="text-2xl font-semibold text-slate-900">Analytics</h2>
          <p className="text-slate-700">
            We may use privacy-respecting analytics to understand overall usage, such as total visits and anonymized performance metrics. These analytics do not include personal information and are used solely to improve the experience.
          </p>
        </section>

        <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/80">
          <h2 className="text-2xl font-semibold text-slate-900">GDPR and data rights</h2>
          <p className="text-slate-700">
            Because we do not collect personal data, there is typically no data to access, correct, or delete. If you have questions about your privacy rights or how we handle data, contact us and we will respond promptly.
          </p>
        </section>

        <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/80">
          <h2 className="text-2xl font-semibold text-slate-900">How to contact us</h2>
          <p className="text-slate-700">
            If you have questions about this policy or your privacy, email us at <a className="font-semibold text-sky-700 underline decoration-sky-200 hover:decoration-sky-400" href="mailto:hello@worldmortgagecalc.com">hello@worldmortgagecalc.com</a>.
          </p>
        </section>

        <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-sm text-emerald-900 shadow-inner shadow-emerald-100">
          We keep this policy concise and transparent. If we make material changes, we will update this page with a new effective date.
        </div>
      </div>
    </main>
  );
}
