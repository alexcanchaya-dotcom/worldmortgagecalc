import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact World Mortgage Calculator",
  description: "Reach our team for support, partnership, or feedback on the mortgage calculator.",
};

export default function ContactPage() {
  return (
    <main className="bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-12 text-slate-900 sm:py-16">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-10">
        <header className="space-y-3 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 shadow-inner shadow-sky-100">
            Contact
          </div>
          <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl sm:leading-tight">Contact our team</h1>
          <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
            Questions about results, partnerships, or data accuracy? Send us a message and we will respond quickly.
          </p>
        </header>

        <form className="card-surface flex flex-col gap-4 p-6" aria-labelledby="contact-form-heading">
          <h2 id="contact-form-heading" className="text-xl font-semibold text-slate-900">
            Send a message
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-slate-900" htmlFor="name">
              Name
              <input
                id="name"
                type="text"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-inner shadow-slate-100 focus:border-blue-500"
                placeholder="Jane Doe"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-slate-900" htmlFor="email">
              Email
              <input
                id="email"
                type="email"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-inner shadow-slate-100 focus:border-blue-500"
                placeholder="you@example.com"
              />
            </label>
          </div>
          <label className="space-y-2 text-sm font-semibold text-slate-900" htmlFor="phone">
            Phone (optional)
            <input
              id="phone"
              type="tel"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-inner shadow-slate-100 focus:border-blue-500"
              placeholder="+1 (555) 123-4567"
            />
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate-900" htmlFor="message">
            Message
            <textarea
              id="message"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-inner shadow-slate-100 focus:border-blue-500"
              rows={5}
              placeholder="Tell us how we can help"
            />
          </label>
          <div className="relative h-0 overflow-hidden">
            <label className="absolute left-[-9999px]" htmlFor="honeypot">
              Leave this field empty
            </label>
            <input
              id="honeypot"
              name="honeypot"
              className="absolute left-[-9999px] top-0 h-px w-px opacity-0"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Spam protection enabled</span>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">We reply within 24h</span>
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-700"
          >
            Submit message
          </button>
        </form>
      </div>
    </main>
  );
}
