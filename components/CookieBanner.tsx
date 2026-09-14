"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";

const CONSENT_KEY = "wmc-consent";

function subscribeToConsent(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getConsentSnapshot() {
  return window.localStorage.getItem(CONSENT_KEY);
}

function getServerConsentSnapshot() {
  return "acknowledged";
}

export default function CookieBanner() {
  const stored = useSyncExternalStore(subscribeToConsent, getConsentSnapshot, getServerConsentSnapshot);
  const [dismissed, setDismissed] = useState(false);
  const visible = !stored && !dismissed;

  const dismiss = () => {
    window.localStorage.setItem(CONSENT_KEY, "acknowledged");
    setDismissed(true);
  };

  if (!visible) return null;

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">
        <span className="font-semibold text-slate-900">Privacy. </span>
        Calculations stay in your browser. We do not use ad or tracking cookies.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
          onClick={dismiss}
        >
          Got it
        </button>
        <Link href="/privacy-policy" className="text-xs font-semibold text-blue-700 underline">
          Privacy
        </Link>
      </div>
    </div>
  );
}
