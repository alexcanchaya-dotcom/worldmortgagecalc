import type { Metadata } from "next";
import { contactEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How World Mortgage Calculator handles data, cookies, and analytics.",
  alternates: { canonical: "/privacy-policy" },
};

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
            We built World Mortgage Calculator to give you quick mortgage estimates while keeping your data private.
            This page explains what we collect (very little), why, and how we protect your privacy.
          </p>
          <p className="text-sm text-slate-600">Effective date: September 14, 2026</p>
        </header>

        <section className="space-y-3 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-6 shadow-lg shadow-slate-200/80">
          <h2 className="text-2xl font-semibold text-slate-900">What data we collect</h2>
          <ul className="list-disc space-y-2 pl-5 text-slate-700">
            <li>
              <strong className="text-slate-900">No personal loan data stored:</strong> Mortgage calculations run
              entirely in your browser. We do not store your property details, payment assumptions, or any identifiers
              on our servers.
            </li>
            <li>
              <strong className="text-slate-900">Temporary inputs:</strong> Values you type are held in your current
              session only to perform calculations and are not sent to us.
            </li>
            <li>
              <strong className="text-slate-900">Share links:</strong> If you copy a share URL, the loan inputs are in
              the link itself so anyone with the URL can see those numbers. We do not log those links.
            </li>
          </ul>
        </section>

        <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/80">
          <h2 className="text-2xl font-semibold text-slate-900">Cookies and local storage</h2>
          <p className="text-slate-700">
            We do not use advertising cookies or tracking cookies. We do not currently show ads. The only local storage
            we set is a small privacy-notice preference after you dismiss the banner, so we do not keep showing it on
            that device. Calculator inputs are not written to cookies.
          </p>
        </section>

        <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/80">
          <h2 className="text-2xl font-semibold text-slate-900">Analytics and ads</h2>
          <p className="text-slate-700">
            We do not currently run third-party ads or ad pixels. Hosting and basic request logs from our provider may
            include standard technical data such as IP address and browser type. If we later add privacy-respecting
            analytics or labeled ads, we will update this page first and describe what changed.
          </p>
        </section>

        <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/80">
          <h2 className="text-2xl font-semibold text-slate-900">GDPR and data rights</h2>
          <p className="text-slate-700">
            Because we do not collect personal calculator data, there is typically no loan data to access, correct, or
            delete. You can clear the privacy-notice preference by deleting site data in your browser. If you have
            questions about your privacy rights, email us and we will respond promptly.
          </p>
        </section>

        <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/80">
          <h2 className="text-2xl font-semibold text-slate-900">How to contact us</h2>
          <p className="text-slate-700">
            If you have questions about this policy or your privacy, email us at{" "}
            <a
              className="font-semibold text-sky-700 underline decoration-sky-200 hover:decoration-sky-400"
              href={`mailto:${contactEmail}`}
            >
              {contactEmail}
            </a>
            .
          </p>
        </section>

        <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-sm text-emerald-900 shadow-inner shadow-emerald-100">
          We keep this policy concise and transparent. If we make material changes, we will update this page with a new
          effective date.
        </div>
      </div>
    </main>
  );
}
