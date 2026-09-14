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
    <div className="cookie-banner card-surface flex flex-col gap-3 bg-white p-4 shadow-2xl shadow-slate-500/20">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700" aria-hidden>
          🍪
        </span>
        <div>
          <p className="text-base font-semibold text-slate-900">Privacy notice</p>
          <p className="text-sm text-slate-600">
            Calculations run in your browser. We do not store your loan inputs, and we do not use advertising or
            tracking cookies. If you dismiss this notice, we save that choice on this device so we do not keep showing
            it. See the Privacy Policy for the full story.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-blue-700"
          onClick={dismiss}
        >
          Got it
        </button>
        <Link href="/privacy-policy" className="text-sm font-semibold text-blue-700 underline">
          Privacy policy
        </Link>
      </div>
    </div>
  );
}
