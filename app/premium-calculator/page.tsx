import type { Metadata } from "next";
import Link from "next/link";
import { contactEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: "Advanced calculator is not available",
  description: "The advanced calculator is an unfinished idea. Use the free calculator instead.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/" },
};

export default function PremiumCalculatorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-12 text-slate-900">
      <div className="mx-auto max-w-3xl space-y-6 rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-lg sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Not available</p>
        <h1 className="text-3xl font-bold text-slate-900">There is no paid calculator yet</h1>
        <p className="text-slate-700">
          This URL used to describe a future “advanced” product. Those features are not built, there is no checkout,
          and there is no broker workspace to join. Please use the free calculator on the homepage.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Use the free calculator
          </Link>
          <a
            href={`mailto:${contactEmail}`}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Email us
          </a>
        </div>
      </div>
    </main>
  );
}
