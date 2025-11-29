"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";

const defaultCurrencyCode = "USD";
const defaultPropertyPrice = 400000;
const defaultDownPayment = 80000;

const currencyOptions = [
  { code: "USD", label: "US Dollar", locale: "en-US" },
  { code: "EUR", label: "Euro", locale: "de-DE" },
  { code: "CAD", label: "Canadian Dollar", locale: "en-CA" },
  { code: "AUD", label: "Australian Dollar", locale: "en-AU" },
  { code: "GBP", label: "British Pound", locale: "en-GB" },
  { code: "CHF", label: "Swiss Franc", locale: "de-CH" },
  { code: "JPY", label: "Japanese Yen", locale: "ja-JP" },
  { code: "CNY", label: "Chinese Yuan", locale: "zh-CN" },
  { code: "INR", label: "Indian Rupee", locale: "en-IN" },
  { code: "MXN", label: "Mexican Peso", locale: "es-MX" },
  { code: "BRL", label: "Brazilian Real", locale: "pt-BR" },
  { code: "ZAR", label: "South African Rand", locale: "en-ZA" },
  { code: "NZD", label: "New Zealand Dollar", locale: "en-NZ" },
  { code: "SGD", label: "Singapore Dollar", locale: "en-SG" },
  { code: "HKD", label: "Hong Kong Dollar", locale: "zh-HK" },
  { code: "SEK", label: "Swedish Krona", locale: "sv-SE" },
  { code: "NOK", label: "Norwegian Krone", locale: "no-NO" },
  { code: "DKK", label: "Danish Krone", locale: "da-DK" },
  { code: "PLN", label: "Polish Zloty", locale: "pl-PL" },
  { code: "CZK", label: "Czech Koruna", locale: "cs-CZ" },
];

const countryOptions = [
  { code: "US", label: "United States", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "EU", label: "European Union", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "CA", label: "Canada", compoundingPeriods: 2, frequencyLabel: "Semi-annual" },
  { code: "AU", label: "Australia", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "GB", label: "United Kingdom", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "CH", label: "Switzerland", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "JP", label: "Japan", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "CN", label: "China", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "IN", label: "India", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "MX", label: "Mexico", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "BR", label: "Brazil", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "ZA", label: "South Africa", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "NZ", label: "New Zealand", compoundingPeriods: 2, frequencyLabel: "Semi-annual" },
  { code: "SG", label: "Singapore", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "HK", label: "Hong Kong", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "SE", label: "Sweden", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "NO", label: "Norway", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "DK", label: "Denmark", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "PL", label: "Poland", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "CZ", label: "Czech Republic", compoundingPeriods: 12, frequencyLabel: "Monthly" },
];

const faqItems = [
  {
    question: "How do you calculate the monthly payment?",
    answer:
      "We use the standard amortization formula with country-specific compounding periods, then show the blended principal and interest portion per month.",
  },
  {
    question: "What costs are not included?",
    answer:
      "Property taxes, homeowner insurance, HOA dues, and currency fluctuations are not included. Add those to plan your true monthly outlay.",
  },
  {
    question: "Can I compare two scenarios?",
    answer: "Yes. Toggle comparison mode to enter a second set of inputs and see a side-by-side summary of the totals.",
  },
  {
    question: "Do you store my inputs?",
    answer: "No. Calculations happen in your browser, and we only save consent preferences locally if you accept cookies.",
  },
  {
    question: "Is this financial advice?",
    answer: "No. This tool is for education. Please speak with a licensed lender or advisor before making decisions.",
  },
];

const getCurrencyFormatter = (code: string) => {
  const option = currencyOptions.find((item) => item.code === code) ?? currencyOptions[0];

  return new Intl.NumberFormat(option.locale, {
    style: "currency",
    currency: option.code,
    maximumFractionDigits: 0,
  });
};

const getMonthlyPayment = (
  price: number,
  down: number,
  rate: number,
  termYears: number,
  compoundingPeriods: number,
) => {
  const loanAmount = Math.max(0, price - down);
  const effectiveMonthlyRate =
    rate === 0 ? 0 : Math.pow(1 + rate / 100 / compoundingPeriods, compoundingPeriods / 12) - 1;
  const totalPayments = termYears * 12;

  if (effectiveMonthlyRate === 0) {
    return totalPayments === 0 ? 0 : loanAmount / totalPayments;
  }

  return (
    loanAmount *
    ((effectiveMonthlyRate * Math.pow(1 + effectiveMonthlyRate, totalPayments)) /
      (Math.pow(1 + effectiveMonthlyRate, totalPayments) - 1))
  );
};

const buildAmortization = (
  price: number,
  down: number,
  rate: number,
  termYears: number,
  compoundingPeriods: number,
) => {
  const monthlyPayment = getMonthlyPayment(price, down, rate, termYears, compoundingPeriods);
  const totalPayments = termYears * 12;
  let balance = Math.max(0, price - down);
  const effectiveMonthlyRate =
    rate === 0 ? 0 : Math.pow(1 + rate / 100 / compoundingPeriods, compoundingPeriods / 12) - 1;

  const schedule: { month: number; interest: number; principal: number; balance: number }[] = [];

  for (let month = 1; month <= totalPayments; month += 1) {
    const interestPayment = balance * effectiveMonthlyRate;
    const principalPayment = Math.max(0, monthlyPayment - interestPayment);
    balance = Math.max(0, balance - principalPayment);
    schedule.push({ month, interest: interestPayment, principal: principalPayment, balance });
  }

  return schedule;
};

export default function HomePage() {
  const [propertyPrice, setPropertyPrice] = useState(defaultPropertyPrice);
  const [propertyPriceDisplay, setPropertyPriceDisplay] = useState(() =>
    getCurrencyFormatter(defaultCurrencyCode).format(defaultPropertyPrice),
  );
  const [downPayment, setDownPayment] = useState(defaultDownPayment);
  const [downPaymentDisplay, setDownPaymentDisplay] = useState(() =>
    getCurrencyFormatter(defaultCurrencyCode).format(defaultDownPayment),
  );
  const [interestRate, setInterestRate] = useState(3.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrencyCode);
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [errors, setErrors] = useState<Record<string, string>>( {});
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonRate, setComparisonRate] = useState(4.1);
  const [comparisonTerm, setComparisonTerm] = useState(25);
  const [comparisonDown, setComparisonDown] = useState(90000);
  const [consentVisible, setConsentVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return !window.localStorage.getItem("wmc-consent");
  });
  const [comparisonPrice, setComparisonPrice] = useState(420000);

  const countryOption = useMemo(
    () => countryOptions.find((option) => option.code === selectedCountry) ?? countryOptions[0],
    [selectedCountry],
  );

  const currencyFormatter = useMemo(() => getCurrencyFormatter(selectedCurrency), [selectedCurrency]);

  const loanAmount = Math.max(0, propertyPrice - downPayment);

  const monthlyPayment = useMemo(
    () => getMonthlyPayment(propertyPrice, downPayment, interestRate, loanTerm, countryOption.compoundingPeriods),
    [countryOption.compoundingPeriods, downPayment, interestRate, loanTerm, propertyPrice],
  );

  const totalPaid = monthlyPayment * loanTerm * 12;
  const totalInterest = totalPaid - loanAmount;

  const comparisonPayment = useMemo(
    () =>
      getMonthlyPayment(
        comparisonPrice,
        comparisonDown,
        comparisonRate,
        comparisonTerm,
        countryOption.compoundingPeriods,
      ),
    [comparisonDown, comparisonPrice, comparisonRate, comparisonTerm, countryOption.compoundingPeriods],
  );

  const comparisonTotals = {
    principal: Math.max(0, comparisonPrice - comparisonDown),
    total: comparisonPayment * comparisonTerm * 12,
  };

  const formatCurrency = useCallback((value: number) => currencyFormatter.format(Math.round(value)), [currencyFormatter]);

  const handleCurrencyInput = (
    value: string,
    setNumericValue: (n: number) => void,
    setDisplayValue: (s: string) => void,
    field: string,
  ) => {
    const numericValue = Number(value.replace(/[^0-9.]/g, ""));
    const parsed = Number.isFinite(numericValue) ? numericValue : 0;
    setNumericValue(parsed);
    setDisplayValue(value.trim() === "" ? "" : formatCurrency(parsed));
    if (parsed <= 0) {
      setErrors((prev) => ({ ...prev, [field]: "Enter a value greater than zero." }));
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleCurrencyChange = (code: string) => {
    setSelectedCurrency(code);
    const formatter = getCurrencyFormatter(code);
    setPropertyPriceDisplay(propertyPrice ? formatter.format(propertyPrice) : "");
    setDownPaymentDisplay(downPayment ? formatter.format(downPayment) : "");
  };

  const amortizationSchedule = useMemo(
    () => buildAmortization(propertyPrice, downPayment, interestRate, loanTerm, countryOption.compoundingPeriods),
    [countryOption.compoundingPeriods, downPayment, interestRate, loanTerm, propertyPrice],
  );

  const handleConsent = (value: string) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("wmc-consent", value);
    }
    setConsentVisible(false);
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://worldmortgagecalc.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Calculator",
        item: "https://worldmortgagecalc.com/",
      },
    ],
  };

  const chartPoints = amortizationSchedule.filter((_, idx) =>
    amortizationSchedule.length ? idx % Math.max(1, Math.ceil(amortizationSchedule.length / 24)) === 0 : false,
  );
  const maxBalance = chartPoints.length ? Math.max(...chartPoints.map((p) => p.balance), Math.max(1, loanAmount)) : Math.max(1, loanAmount);

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 pb-16 pt-6 sm:pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-3 rounded-full bg-sky-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
              Trusted, transparent, global
            </div>
            <h1 className="section-heading text-3xl leading-tight text-slate-900 sm:text-5xl">
              Plan your mortgage with clear assumptions and instant results
            </h1>
            <p className="max-w-2xl text-lg text-slate-700">
              Input your price, down payment, APR, and term to see a real-time payment estimate, an amortization snapshot, and the total interest you could pay.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
                href="#calculator"
              >
                Start calculating
              </a>
              <a
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                href="#results"
              >
                View results
              </a>
              <div className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-slate-600 shadow-inner shadow-slate-100">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">✓</span>
                No sign-up, no spam
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:gap-3">
              <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-inner shadow-slate-100">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">SSL</span>
                <div>
                  <p className="text-xs text-slate-500">Security</p>
                  <p className="text-sm font-semibold text-slate-800">Secure & encrypted</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-inner shadow-slate-100">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">ISO</span>
                <div>
                  <p className="text-xs text-slate-500">Data</p>
                  <p className="text-sm font-semibold text-slate-800">No storage of inputs</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="ad-slot" aria-label="Ad placeholder below hero">
              Reserved ad slot (responsive)
            </div>
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50 p-6 shadow-lg shadow-slate-200/80">
              <p className="text-sm font-semibold text-slate-700">Newsletter</p>
              <p className="text-lg font-bold text-slate-900">Stay ahead of rate changes.</p>
              <p className="text-sm text-slate-600">Get a monthly digest with rate trends and lender-friendly tips.</p>
              <form className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  aria-label="Email for newsletter"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-inner shadow-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-200"
                />
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700"
                >
                  Subscribe
                </button>
              </form>
              <p className="mt-2 text-xs text-slate-500">No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr,0.95fr]" id="calculator">
          <section className="card-surface relative overflow-hidden p-6 sm:p-8">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.06),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.08),transparent_30%)]" />
            <div className="relative space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Inputs</p>
                  <h2 className="text-2xl font-bold text-slate-900">Customize your scenario</h2>
                  <p className="helper">Inline helper text and validation guide every field.</p>
                </div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={showComparison}
                    onChange={(e) => setShowComparison(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600"
                  />
                  Compare loan B
                </label>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900" htmlFor="currency">
                    Currency
                  </label>
                  <p className="helper">We format results instantly for your preferred currency.</p>
                  <select
                    id="currency"
                    value={selectedCurrency}
                    onChange={(e) => handleCurrencyChange(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-inner shadow-slate-100 outline-none transition duration-300 hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-[0_12px_30px_rgba(56,189,248,0.18)] focus:-translate-y-0.5 focus:border-emerald-300 focus:ring-4 focus:ring-blue-200"
                  >
                    {currencyOptions.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900" htmlFor="country">
                    Country (compounding rules)
                  </label>
                  <p className="helper">Adjusts interest compounding to reflect local lending norms.</p>
                  <select
                    id="country"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-inner shadow-slate-100 outline-none transition duration-300 hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-[0_12px_30px_rgba(56,189,248,0.18)] focus:-translate-y-0.5 focus:border-emerald-300 focus:ring-4 focus:ring-blue-200"
                  >
                    {countryOptions.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.label} — {option.frequencyLabel} compounding
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900" htmlFor="property-price">
                  Property price
                </label>
                <p className="helper">Enter the purchase price before fees. Numbers only.</p>
                <input
                  id="property-price"
                  type="text"
                  inputMode="numeric"
                  aria-describedby="property-price-helper"
                  value={propertyPriceDisplay}
                  onChange={(e) => handleCurrencyInput(e.target.value, setPropertyPrice, setPropertyPriceDisplay, "propertyPrice")}
                  className={`w-full rounded-2xl border bg-white px-4 py-3 text-lg font-semibold text-slate-900 shadow-inner shadow-slate-100 outline-none transition duration-300 focus:-translate-y-0.5 focus:border-blue-500 focus:shadow-[0_12px_30px_rgba(56,189,248,0.18)] ${errors.propertyPrice ? "input-error" : ""}`}
                />
                <p id="property-price-helper" className={`helper ${errors.propertyPrice ? "text-red-600" : ""}`}>
                  {errors.propertyPrice ?? "Tip: add taxes and fees separately in your budget."}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900" htmlFor="down-payment">
                    Down payment
                  </label>
                  <p className="helper">A higher down payment lowers monthly costs.</p>
                  <input
                    id="down-payment"
                    type="text"
                    inputMode="numeric"
                    aria-describedby="down-payment-helper"
                    value={downPaymentDisplay}
                    onChange={(e) => handleCurrencyInput(e.target.value, setDownPayment, setDownPaymentDisplay, "downPayment")}
                    className={`w-full rounded-2xl border bg-white px-4 py-3 text-lg font-semibold text-slate-900 shadow-inner shadow-slate-100 outline-none transition duration-300 focus:-translate-y-0.5 focus:border-blue-500 focus:shadow-[0_12px_30px_rgba(56,189,248,0.18)] ${errors.downPayment ? "input-error" : "input-success"}`}
                  />
                  <p id="down-payment-helper" className={`helper ${errors.downPayment ? "text-red-600" : ""}`}>
                    {errors.downPayment ?? "Common target: 20% to avoid PMI (varies by lender)."}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900" htmlFor="interest-rate">
                    Interest rate (APR)
                  </label>
                  <p className="helper">Annual percentage rate. Try small adjustments to see impact.</p>
                  <input
                    id="interest-rate"
                    type="number"
                    step="0.01"
                    min="0"
                    aria-describedby="interest-rate-helper"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg font-semibold text-slate-900 shadow-inner shadow-slate-100 outline-none transition duration-300 focus:-translate-y-0.5 focus:border-blue-500 focus:shadow-[0_12px_30px_rgba(56,189,248,0.18)]"
                  />
                  <p id="interest-rate-helper" className="helper">
                    Use your quoted APR or a conservative estimate. We include compounding automatically.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900" htmlFor="loan-term">
                    Loan term (years)
                  </label>
                  <p className="helper">30 years is standard in the US; 15 years builds equity faster.</p>
                  <input
                    id="loan-term"
                    type="number"
                    min="1"
                    aria-describedby="loan-term-helper"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg font-semibold text-slate-900 shadow-inner shadow-slate-100 outline-none transition duration-300 focus:-translate-y-0.5 focus:border-blue-500 focus:shadow-[0_12px_30px_rgba(56,189,248,0.18)]"
                  />
                  <p id="loan-term-helper" className="helper">
                    Shorter terms increase monthly payments but lower total interest.
                  </p>
                </div>
                <div className="space-y-2 rounded-2xl border border-dashed border-slate-200 bg-white/70 p-4 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">How we calculate</p>
                  <p>
                    We apply the standard amortization formula using your country&apos;s compounding frequency. Results update instantly and are shown in your selected currency.
                  </p>
                </div>
              </div>

              {showComparison && (
                <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-inner shadow-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Scenario B (what-if)</h3>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Comparison</span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="space-y-2 text-sm font-semibold text-slate-900" htmlFor="compare-price">
                      Price
                      <input
                        id="compare-price"
                        type="number"
                        min="0"
                        value={comparisonPrice}
                        onChange={(e) => setComparisonPrice(Number(e.target.value))}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-900 shadow-inner shadow-slate-100 outline-none transition duration-300 focus:border-blue-500"
                      />
                    </label>
                    <label className="space-y-2 text-sm font-semibold text-slate-900" htmlFor="compare-down">
                      Down payment
                      <input
                        id="compare-down"
                        type="number"
                        min="0"
                        value={comparisonDown}
                        onChange={(e) => setComparisonDown(Number(e.target.value))}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-900 shadow-inner shadow-slate-100 outline-none transition duration-300 focus:border-blue-500"
                      />
                    </label>
                    <label className="space-y-2 text-sm font-semibold text-slate-900" htmlFor="compare-rate">
                      APR
                      <input
                        id="compare-rate"
                        type="number"
                        step="0.01"
                        min="0"
                        value={comparisonRate}
                        onChange={(e) => setComparisonRate(Number(e.target.value))}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-900 shadow-inner shadow-slate-100 outline-none transition duration-300 focus:border-blue-500"
                      />
                    </label>
                    <label className="space-y-2 text-sm font-semibold text-slate-900" htmlFor="compare-term">
                      Term (years)
                      <input
                        id="compare-term"
                        type="number"
                        min="1"
                        value={comparisonTerm}
                        onChange={(e) => setComparisonTerm(Number(e.target.value))}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-900 shadow-inner shadow-slate-100 outline-none transition duration-300 focus:border-blue-500"
                      />
                    </label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-blue-50 p-4 text-slate-900">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Scenario A</p>
                      <p className="text-2xl font-bold">{formatCurrency(monthlyPayment)}</p>
                      <p className="text-sm text-slate-600">Monthly | Total {formatCurrency(totalPaid)}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-emerald-50 p-4 text-slate-900">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Scenario B</p>
                      <p className="text-2xl font-bold">{formatCurrency(comparisonPayment)}</p>
                      <p className="text-sm text-slate-600">Monthly | Total {formatCurrency(comparisonTotals.total)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="space-y-6" id="results">
            <div className="card-surface relative overflow-hidden p-6 sm:p-8">
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_10%_15%,rgba(14,165,233,0.08),transparent_30%),radial-gradient(circle_at_70%_0%,rgba(16,185,129,0.12),transparent_30%)]" />
              <div className="relative space-y-4" aria-live="polite">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Results</p>
                    <h2 className="text-2xl font-bold text-slate-900">Amortization summary</h2>
                    <p className="helper">Updated live as you type. Currency: {selectedCurrency}.</p>
                  </div>
                  <div className="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-slate-700 shadow-inner shadow-slate-100">
                    {countryOption.frequencyLabel} compounding
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-inner shadow-slate-100">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Monthly payment</p>
                    <p className="text-3xl font-bold text-slate-900">{formatCurrency(monthlyPayment)}</p>
                    <p className="text-sm text-slate-600">Principal + interest only</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-inner shadow-slate-100">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Total interest</p>
                    <p className="text-3xl font-bold text-slate-900">{formatCurrency(totalInterest)}</p>
                    <p className="text-sm text-slate-600">Over {loanTerm} years</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-inner shadow-slate-100">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Total paid</p>
                    <p className="text-3xl font-bold text-slate-900">{formatCurrency(totalPaid)}</p>
                    <p className="text-sm text-slate-600">Includes original principal</p>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-inner shadow-slate-100">
                    <h3 className="text-lg font-semibold text-slate-900">Payment breakdown</h3>
                    <ul className="mt-2 space-y-2 text-sm text-slate-700">
                      <li className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-blue-500" /> Principal portion grows over time
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-emerald-500" /> Interest share declines each payment
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-slate-400" /> Balance trends toward zero before term end
                      </li>
                    </ul>
                    <div className="mt-4 h-56 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label="Principal and interest over time">
                        <polyline
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2"
                          points={chartPoints
                            .map((p, idx) => {
                              const x = (idx / Math.max(1, chartPoints.length - 1)) * 100;
                              const y = 100 - (p.principal / monthlyPayment) * 100;
                              return `${x},${y}`;
                            })
                            .join(" ")}
                        />
                        <polyline
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2"
                          points={chartPoints
                            .map((p, idx) => {
                              const x = (idx / Math.max(1, chartPoints.length - 1)) * 100;
                              const y = 100 - (p.interest / monthlyPayment) * 100;
                              return `${x},${y}`;
                            })
                            .join(" ")}
                        />
                        <polyline
                          fill="none"
                          stroke="#94a3b8"
                          strokeWidth="2"
                          points={chartPoints
                            .map((p, idx) => {
                              const x = (idx / Math.max(1, chartPoints.length - 1)) * 100;
                              const y = (p.balance / maxBalance) * 100;
                              return `${x},${y}`;
                            })
                            .join(" ")}
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-inner shadow-slate-100">
                      <h3 className="text-lg font-semibold text-slate-900">Assumptions</h3>
                      <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
                        <li>No taxes, insurance, PMI, HOA fees, or currency fluctuations included.</li>
                        <li>Fixed-rate loan with level payments; compounding per selected country.</li>
                        <li>Payments made on time with no prepayments or fees.</li>
                      </ul>
                    </div>
                    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-inner shadow-amber-100">
                      <h3 className="text-lg font-semibold">Disclaimers</h3>
                      <p className="text-sm">
                        This is an educational tool, not financial advice. Confirm details with a licensed lender before committing to a loan.
                      </p>
                    </div>
                    <div className="ad-slot" aria-label="Ad placeholder between sections">
                      Reserved ad slot (sidebar)
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-inner shadow-slate-100">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-slate-900">Trust & transparency</h3>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">Encrypted</span>
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">No data stored</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-slate-700">
                    We anonymize analytics, respect consent, and show exactly how we calculate your results. Explore the About and Privacy pages for more.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold text-blue-700">
                    <Link href="/about" className="rounded-full bg-blue-50 px-3 py-2 hover:bg-blue-100">
                      How the calculator works
                    </Link>
                    <Link href="/privacy-policy" className="rounded-full bg-emerald-50 px-3 py-2 hover:bg-emerald-100">
                      Privacy & data
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-surface p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Knowledge</p>
                  <h3 className="text-xl font-semibold text-slate-900">FAQs</h3>
                </div>
                <div className="ad-slot w-40 min-h-[80px] text-xs">Ad slot</div>
              </div>
              <div className="mt-4 space-y-3">
                {faqItems.map((item) => (
                  <details key={item.question} className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-inner shadow-slate-100">
                    <summary className="cursor-pointer text-sm font-semibold text-slate-900">{item.question}</summary>
                    <p className="mt-2 text-sm text-slate-700">{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="card-surface p-5">
            <h3 className="text-lg font-semibold text-slate-900">Lead CTA</h3>
            <p className="mt-2 text-sm text-slate-700">
              Ready to discuss financing? Share your scenario and we will connect you with a lender partner.
            </p>
            <button className="mt-3 inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-emerald-700">
              Speak with a lender
            </button>
          </div>
          <div className="card-surface p-5">
            <h3 className="text-lg font-semibold text-slate-900">Printable & export</h3>
            <p className="mt-2 text-sm text-slate-700">Download a CSV of your amortization schedule for record-keeping.</p>
            <a
              className="mt-3 inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 shadow-inner shadow-slate-100"
              href="data:text/csv;charset=utf-8,month,interest,principal,balance%0A"
              download="amortization.csv"
            >
              Export CSV
            </a>
          </div>
          <div className="card-surface p-5">
            <h3 className="text-lg font-semibold text-slate-900">Share results</h3>
            <p className="mt-2 text-sm text-slate-700">Copy a link to share your inputs (data stays local; link is generic).</p>
            <button
              type="button"
              className="mt-3 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-700"
              onClick={() => navigator.clipboard?.writeText("https://worldmortgagecalc.com/#results")}
            >
              Copy link
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card-surface p-6">
            <h3 className="text-lg font-semibold text-slate-900">Blog & guides</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {["Fixed vs variable", "Reading amortization", "Rate shopping", "Refinance timing"].map((topic) => (
                <article key={topic} className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-inner shadow-slate-100">
                  <p className="text-sm font-semibold text-slate-900">{topic}</p>
                  <p className="text-xs text-slate-600">Short primer with a link to learn more.</p>
                  <button className="mt-2 text-xs font-semibold text-blue-700">Read snippet</button>
                </article>
              ))}
            </div>
          </div>
          <div className="card-surface p-6">
            <h3 className="text-lg font-semibold text-slate-900">Trust badges</h3>
            <div className="mt-3 flex flex-wrap gap-3">
              {["Secure", "Transparent", "No spam", "Ad disclosure"].map((badge) => (
                <span key={badge} className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700">
                  {badge}
                </span>
              ))}
            </div>
            <p className="mt-3 text-sm text-slate-700">
              Results update with aria-live announcements for screen readers, and all inputs include descriptive labels.
            </p>
          </div>
        </div>
      </section>

      {consentVisible && (
        <div className="cookie-banner card-surface flex flex-col gap-3 bg-white p-4 shadow-2xl shadow-slate-500/20">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">🍪</span>
            <div>
              <p className="text-base font-semibold text-slate-900">Cookie & ad consent</p>
              <p className="text-sm text-slate-600">
                We use minimal analytics and may show ads. Accept to help us improve; you can opt out anytime.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-blue-700"
              onClick={() => handleConsent("accepted")}
            >
              Accept
            </button>
            <button
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              onClick={() => handleConsent("declined")}
            >
              Decline
            </button>
            <Link href="/privacy-policy" className="text-sm font-semibold text-blue-700 underline">
              Privacy policy
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
