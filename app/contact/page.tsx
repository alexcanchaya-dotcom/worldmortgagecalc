import type { Metadata } from "next";
import { contactEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact World Mortgage Calculator",
  description: "Email the World Mortgage Calculator team for support, partnership, or feedback.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-12 text-slate-900 sm:py-16">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-10">
        <header className="space-y-3 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 shadow-inner shadow-sky-100">
            Contact
          </div>
          <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl sm:leading-tight">
            Contact our team
          </h1>
          <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
            Questions about results, partnerships, or data accuracy? Email us and we will respond as soon as we can.
          </p>
        </header>

        <section className="card-surface flex flex-col gap-4 p-6">
          <h2 className="text-xl font-semibold text-slate-900">Email</h2>
          <p className="text-slate-700">
            There is no contact form on this site. Use email so your message actually reaches us.
          </p>
          <p className="break-all text-lg font-semibold text-slate-900">{contactEmail}</p>
          <a
            href={`mailto:${contactEmail}`}
            className="inline-flex w-fit items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-700"
          >
            Email us
          </a>
          <p className="text-sm text-slate-600">
            We cannot give loan approvals or personalized financial advice. For a live quote, speak with a licensed
            lender in your country.
          </p>
        </section>
      </div>
    </main>
  );
}
