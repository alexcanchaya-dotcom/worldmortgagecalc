"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  amortizationToCsv,
  buildAmortization,
  buildShareParams,
  countryForCurrency,
  countryOptions,
  currencyForCountry,
  currencyOptions,
  getCountryOption,
  getCurrencyFormatter,
  parseMoneyInput,
  readShareParams,
  summarizeLoan,
  svgChartY,
  validateLoanInputs,
} from "@/lib/mortgage";
import {
  countryPresets,
  getCountryPreset,
  getFieldHelpers,
  getStampDutyNote,
  type CountryPreset,
} from "@/lib/countryPresets";
import CookieBanner from "@/components/CookieBanner";
import { siteUrl } from "@/lib/site";

const defaultPreset = getCountryPreset("US") ?? countryPresets[0];
const defaultCurrencyCode = defaultPreset.currency;
const defaultCountryCode = defaultPreset.country;
const defaultPropertyPrice = defaultPreset.price;
const defaultDownPayment = defaultPreset.down;
const defaultRate = defaultPreset.illustrativeRate;
const defaultTerm = defaultPreset.termYears;
const defaultComparison = {
  price: 420000,
  down: 90000,
  rate: 4.1,
  term: 25,
};

const faqItems = [
  {
    question: "How do you calculate the monthly payment?",
    answer:
      "We use the standard amortization formula with country-specific compounding periods, then show the blended principal and interest portion per month.",
  },
  {
    question: "What costs are not included?",
    answer:
      "Property taxes, stamp duty or transfer tax, homeowner insurance, HOA dues, and currency fluctuations are not included. Add those to plan your true monthly outlay.",
  },
  {
    question: "What do the country starters do?",
    answer:
      "Ireland, UK, US, Spain, and Portugal buttons fill example price, deposit, term, and an illustrative rate band. Those rates are for education only — not live bank quotes and not a promise of approval.",
  },
  {
    question: "Do you include stamp duty or transfer tax?",
    answer:
      "No. Where those taxes usually apply, we show a short note and a link to official guidance. We do not calculate the tax or add it to the monthly payment.",
  },
  {
    question: "Can I compare two scenarios?",
    answer: "Yes. Toggle comparison mode to enter Loan B and see a side-by-side summary of monthly payments and totals.",
  },
  {
    question: "Do you store my inputs?",
    answer:
      "No. Calculations happen in your browser. We only save a local notice preference if you dismiss the compact privacy note under the results.",
  },
  {
    question: "Is this financial advice?",
    answer: "No. This tool is for education. Please speak with a licensed lender or advisor before making decisions.",
  },
];

const defaultShareState = {
  price: defaultPropertyPrice,
  down: defaultDownPayment,
  rate: defaultRate,
  term: defaultTerm,
  currency: defaultCurrencyCode,
  country: defaultCountryCode,
  compare: false,
  bPrice: defaultComparison.price,
  bDown: defaultComparison.down,
  bRate: defaultComparison.rate,
  bTerm: defaultComparison.term,
};

export default function MortgageCalculator({ initialSearch = "" }: { initialSearch?: string }) {
  const initial = readShareParams(initialSearch, defaultShareState);
  const initialFormatter = getCurrencyFormatter(initial.currency);
  const [propertyPrice, setPropertyPrice] = useState(initial.price);
  const [propertyPriceDisplay, setPropertyPriceDisplay] = useState(() => initialFormatter.format(initial.price));
  const [downPayment, setDownPayment] = useState(initial.down);
  const [downPaymentDisplay, setDownPaymentDisplay] = useState(() => initialFormatter.format(initial.down));
  const [interestRate, setInterestRate] = useState(initial.rate);
  const [loanTerm, setLoanTerm] = useState(initial.term);
  const [selectedCurrency, setSelectedCurrency] = useState(initial.currency);
  const [selectedCountry, setSelectedCountry] = useState(initial.country);
  const [showComparison, setShowComparison] = useState(initial.compare);
  const [comparisonRate, setComparisonRate] = useState(initial.bRate);
  const [comparisonTerm, setComparisonTerm] = useState(initial.bTerm);
  const [comparisonDown, setComparisonDown] = useState(initial.bDown);
  const [comparisonPrice, setComparisonPrice] = useState(initial.bPrice);
  const [copyStatus, setCopyStatus] = useState("");
  const [exportStatus, setExportStatus] = useState("");

  const countryOption = useMemo(() => getCountryOption(selectedCountry), [selectedCountry]);
  const selectedPreset = useMemo(() => getCountryPreset(selectedCountry), [selectedCountry]);
  const stampDutyNote = useMemo(() => getStampDutyNote(selectedCountry), [selectedCountry]);
  const fieldHelpers = useMemo(() => getFieldHelpers(selectedCountry), [selectedCountry]);
  const currencyFormatter = useMemo(() => getCurrencyFormatter(selectedCurrency), [selectedCurrency]);
  const formatCurrency = useCallback(
    (value: number) => currencyFormatter.format(Number.isFinite(value) ? Math.round(value) : 0),
    [currencyFormatter],
  );

  useEffect(() => {
    const query = buildShareParams({
      price: propertyPrice,
      down: downPayment,
      rate: interestRate,
      term: loanTerm,
      currency: selectedCurrency,
      country: selectedCountry,
      compare: showComparison,
      bPrice: comparisonPrice,
      bDown: comparisonDown,
      bRate: comparisonRate,
      bTerm: comparisonTerm,
    });
    window.history.replaceState(null, "", `/?${query}`);
  }, [
    propertyPrice,
    downPayment,
    interestRate,
    loanTerm,
    selectedCurrency,
    selectedCountry,
    showComparison,
    comparisonPrice,
    comparisonDown,
    comparisonRate,
    comparisonTerm,
  ]);

  const errors = useMemo(
    () => ({
      ...validateLoanInputs({ price: propertyPrice, down: downPayment, rate: interestRate, termYears: loanTerm }),
      ...validateLoanInputs(
        { price: comparisonPrice, down: comparisonDown, rate: comparisonRate, termYears: comparisonTerm },
        "compare",
      ),
    }),
    [propertyPrice, downPayment, interestRate, loanTerm, comparisonPrice, comparisonDown, comparisonRate, comparisonTerm],
  );

  const loanA = useMemo(
    () => summarizeLoan(propertyPrice, downPayment, interestRate, loanTerm, countryOption.compoundingPeriods),
    [countryOption.compoundingPeriods, downPayment, interestRate, loanTerm, propertyPrice],
  );

  const loanB = useMemo(
    () =>
      summarizeLoan(
        comparisonPrice,
        comparisonDown,
        comparisonRate,
        comparisonTerm,
        countryOption.compoundingPeriods,
      ),
    [comparisonDown, comparisonPrice, comparisonRate, comparisonTerm, countryOption.compoundingPeriods],
  );

  const amortizationSchedule = useMemo(
    () => buildAmortization(propertyPrice, downPayment, interestRate, loanTerm, countryOption.compoundingPeriods),
    [countryOption.compoundingPeriods, downPayment, interestRate, loanTerm, propertyPrice],
  );

  const applyCurrency = (code: string) => {
    const formatter = getCurrencyFormatter(code);
    setPropertyPriceDisplay(formatter.format(propertyPrice));
    setDownPaymentDisplay(formatter.format(downPayment));
  };

  const handleCurrencyChange = (code: string) => {
    setSelectedCurrency(code);
    setSelectedCountry(countryForCurrency(code, selectedCountry));
    applyCurrency(code);
  };

  const handleCountryChange = (code: string) => {
    const nextCurrency = currencyForCountry(code);
    setSelectedCountry(code);
    if (nextCurrency !== selectedCurrency) {
      setSelectedCurrency(nextCurrency);
      applyCurrency(nextCurrency);
    }
  };

  const applyPreset = (preset: CountryPreset) => {
    const formatter = getCurrencyFormatter(preset.currency);
    setSelectedCountry(preset.country);
    setSelectedCurrency(preset.currency);
    setPropertyPrice(preset.price);
    setPropertyPriceDisplay(formatter.format(preset.price));
    setDownPayment(preset.down);
    setDownPaymentDisplay(formatter.format(preset.down));
    setInterestRate(preset.illustrativeRate);
    setLoanTerm(preset.termYears);
  };

  const handleMoneyChange = (
    raw: string,
    setNumericValue: (n: number) => void,
    setDisplayValue: (s: string) => void,
  ) => {
    setDisplayValue(raw);
    setNumericValue(parseMoneyInput(raw));
  };

  const handleMoneyFocus = (numericValue: number, setDisplayValue: (s: string) => void) => {
    setDisplayValue(numericValue === 0 ? "0" : String(numericValue));
  };

  const handleMoneyBlur = (numericValue: number, setDisplayValue: (s: string) => void) => {
    setDisplayValue(formatCurrency(numericValue));
  };

  const handleExportCsv = () => {
    if (amortizationSchedule.length === 0) {
      setExportStatus("Enter a valid term to export a schedule.");
      return;
    }
    const csv = amortizationToCsv(amortizationSchedule);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "amortization.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setExportStatus(`Exported ${amortizationSchedule.length} monthly rows.`);
  };

  const handleCopyShareLink = async () => {
    const query = buildShareParams({
      price: propertyPrice,
      down: downPayment,
      rate: interestRate,
      term: loanTerm,
      currency: selectedCurrency,
      country: selectedCountry,
      compare: showComparison,
      bPrice: comparisonPrice,
      bDown: comparisonDown,
      bRate: comparisonRate,
      bTerm: comparisonTerm,
    });
    const url = `${siteUrl}/?${query}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopyStatus("Copied a link with your current inputs.");
    } catch {
      setCopyStatus(url);
    }
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
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Calculator",
        item: `${siteUrl}/`,
      },
    ],
  };

  const chartPoints = amortizationSchedule.filter((_, idx) =>
    amortizationSchedule.length ? idx % Math.max(1, Math.ceil(amortizationSchedule.length / 24)) === 0 : false,
  );
  const maxBalance = chartPoints.length
    ? Math.max(...chartPoints.map((p) => p.balance), Math.max(1, loanA.principal))
    : Math.max(1, loanA.principal);

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 pb-16 pt-4 sm:pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-3 rounded-full bg-sky-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
              Trusted, transparent, global
            </div>
            <h1 className="section-heading text-3xl leading-tight text-slate-900 sm:text-4xl">
              Plan your mortgage with clear assumptions and instant results
            </h1>
            <p className="max-w-2xl text-lg text-slate-700">
              Input your price, {fieldHelpers.depositLabel.toLowerCase()}, APR, and term to see a real-time payment
              estimate, an amortization snapshot, and the total interest you could pay.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-700 to-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:text-white shadow-lg transition hover:shadow-xl"
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
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  ✓
                </span>
                No sign-up, no spam
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:gap-3">
              <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-inner shadow-slate-100">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  SSL
                </span>
                <div>
                  <p className="text-xs text-slate-500">Security</p>
                  <p className="text-sm font-semibold text-slate-800">Secure & encrypted</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-inner shadow-slate-100">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  ISO
                </span>
                <div>
                  <p className="text-xs text-slate-500">Data</p>
                  <p className="text-sm font-semibold text-slate-800">No storage of inputs</p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50 p-6 shadow-lg shadow-slate-200/80">
            <p className="text-sm font-semibold text-slate-700">Country starters</p>
            <p className="text-lg font-bold text-slate-900">Ireland, UK, US, Spain, or Portugal</p>
            <p className="text-sm text-slate-600">
              Each button fills example price, deposit, term, and an illustrative rate band. These are educational
              starters — not live bank quotes and not a promise of approval.
            </p>
            <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Country starter presets">
              {countryPresets.map((preset) => {
                const isActive = selectedCountry === preset.country;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    aria-pressed={isActive}
                    className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold shadow-sm ${
                      isActive
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
                    }`}
                    onClick={() => applyPreset(preset)}
                  >
                    {preset.shortLabel}
                  </button>
                );
              })}
            </div>
            {selectedPreset && (
              <p className="mt-3 text-xs font-semibold text-slate-600">{selectedPreset.rateBandLabel}</p>
            )}
            {selectedCountry === "IE" && (
              <Link
                href="/ireland"
                className="mt-3 inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Open the Ireland page
              </Link>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr,0.95fr]" id="calculator">
          <section className="card-surface relative overflow-hidden p-6 sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.06),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.08),transparent_30%)]" />
            <div className="relative space-y-6">
              <div className="flex items-center justify-between gap-4">
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
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-inner shadow-slate-100 outline-none transition duration-300 hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-[0_12px_30px_rgba(56,189,248,0.18)] focus:-translate-y-0.5 focus:border-emerald-300 focus:ring-4 focus:ring-blue-200"
                  >
                    {countryOptions.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.label} — {option.frequencyLabel} compounding
                      </option>
                    ))}
                  </select>
                  {selectedPreset && (
                    <p className="helper">
                      {selectedPreset.label} starter uses {selectedPreset.currency} and{" "}
                      {selectedPreset.termYears}-year example numbers.{" "}
                      {selectedCountry === "IE" && (
                        <>
                          You can also use the{" "}
                          <Link href="/ireland" className="font-semibold text-blue-700 underline">
                            Ireland calculator
                          </Link>
                          .
                        </>
                      )}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900" htmlFor="property-price">
                  Property price
                </label>
                <p className="helper">{fieldHelpers.priceHint}</p>
                <input
                  id="property-price"
                  type="text"
                  inputMode="decimal"
                  aria-describedby="property-price-helper"
                  value={propertyPriceDisplay}
                  onFocus={() => handleMoneyFocus(propertyPrice, setPropertyPriceDisplay)}
                  onBlur={() => handleMoneyBlur(propertyPrice, setPropertyPriceDisplay)}
                  onChange={(e) => handleMoneyChange(e.target.value, setPropertyPrice, setPropertyPriceDisplay)}
                  className={`w-full rounded-2xl border bg-white px-4 py-3 text-lg font-semibold text-slate-900 shadow-inner shadow-slate-100 outline-none transition duration-300 focus:-translate-y-0.5 focus:border-blue-500 focus:shadow-[0_12px_30px_rgba(56,189,248,0.18)] ${errors.propertyPrice ? "input-error" : ""}`}
                />
                <p id="property-price-helper" className={`helper ${errors.propertyPrice ? "text-red-600" : ""}`}>
                  {errors.propertyPrice ?? fieldHelpers.priceHelper}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900" htmlFor="down-payment">
                    {fieldHelpers.depositLabel}
                  </label>
                  <p className="helper">{fieldHelpers.downHint}</p>
                  <input
                    id="down-payment"
                    type="text"
                    inputMode="decimal"
                    aria-describedby="down-payment-helper"
                    value={downPaymentDisplay}
                    onFocus={() => handleMoneyFocus(downPayment, setDownPaymentDisplay)}
                    onBlur={() => handleMoneyBlur(downPayment, setDownPaymentDisplay)}
                    onChange={(e) => handleMoneyChange(e.target.value, setDownPayment, setDownPaymentDisplay)}
                    className={`w-full rounded-2xl border bg-white px-4 py-3 text-lg font-semibold text-slate-900 shadow-inner shadow-slate-100 outline-none transition duration-300 focus:-translate-y-0.5 focus:border-blue-500 focus:shadow-[0_12px_30px_rgba(56,189,248,0.18)] ${errors.downPayment ? "input-error" : "input-success"}`}
                  />
                  <p id="down-payment-helper" className={`helper ${errors.downPayment ? "text-red-600" : ""}`}>
                    {errors.downPayment ?? fieldHelpers.downHelper}
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
                    value={Number.isFinite(interestRate) ? interestRate : 0}
                    onChange={(e) => setInterestRate(e.target.value === "" ? 0 : Number(e.target.value))}
                    className={`w-full rounded-2xl border bg-white px-4 py-3 text-lg font-semibold text-slate-900 shadow-inner shadow-slate-100 outline-none transition duration-300 focus:-translate-y-0.5 focus:border-blue-500 focus:shadow-[0_12px_30px_rgba(56,189,248,0.18)] ${errors.interestRate ? "input-error" : ""}`}
                  />
                  <p id="interest-rate-helper" className={`helper ${errors.interestRate ? "text-red-600" : ""}`}>
                    {errors.interestRate ??
                      (selectedPreset
                        ? selectedPreset.rateBandLabel
                        : "Use a quoted APR or a conservative estimate. Preset rates are illustrative only.")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900" htmlFor="loan-term">
                    Loan term (years)
                  </label>
                  <p className="helper">{fieldHelpers.termHint}</p>
                  <input
                    id="loan-term"
                    type="number"
                    min="1"
                    aria-describedby="loan-term-helper"
                    value={Number.isFinite(loanTerm) ? loanTerm : 0}
                    onChange={(e) => setLoanTerm(e.target.value === "" ? 0 : Number(e.target.value))}
                    className={`w-full rounded-2xl border bg-white px-4 py-3 text-lg font-semibold text-slate-900 shadow-inner shadow-slate-100 outline-none transition duration-300 focus:-translate-y-0.5 focus:border-blue-500 focus:shadow-[0_12px_30px_rgba(56,189,248,0.18)] ${errors.loanTerm ? "input-error" : ""}`}
                  />
                  <p id="loan-term-helper" className={`helper ${errors.loanTerm ? "text-red-600" : ""}`}>
                    {errors.loanTerm ?? "Shorter terms increase monthly payments but lower total interest."}
                  </p>
                </div>
                <div className="space-y-2 rounded-2xl border border-dashed border-slate-200 bg-white/70 p-4 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">How we calculate</p>
                  <p>
                    We apply the standard amortization formula using your country{"'"}s compounding frequency. Results
                    update instantly and are shown in your selected currency.
                  </p>
                </div>
              </div>

              {showComparison && (
                <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-inner shadow-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Loan B (what-if)</h3>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Comparison</span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="space-y-2 text-sm font-semibold text-slate-900" htmlFor="compare-price">
                      Price
                      <input
                        id="compare-price"
                        type="number"
                        min="0"
                        value={Number.isFinite(comparisonPrice) ? comparisonPrice : 0}
                        onChange={(e) => setComparisonPrice(e.target.value === "" ? 0 : Number(e.target.value))}
                        className={`w-full rounded-2xl border bg-white px-4 py-3 text-base font-semibold text-slate-900 shadow-inner shadow-slate-100 outline-none transition duration-300 focus:border-blue-500 ${errors.comparePrice ? "input-error" : ""}`}
                      />
                      {errors.comparePrice && <span className="helper text-red-600">{errors.comparePrice}</span>}
                    </label>
                    <label className="space-y-2 text-sm font-semibold text-slate-900" htmlFor="compare-down">
                      {fieldHelpers.depositLabel}
                      <input
                        id="compare-down"
                        type="number"
                        min="0"
                        value={Number.isFinite(comparisonDown) ? comparisonDown : 0}
                        onChange={(e) => setComparisonDown(e.target.value === "" ? 0 : Number(e.target.value))}
                        className={`w-full rounded-2xl border bg-white px-4 py-3 text-base font-semibold text-slate-900 shadow-inner shadow-slate-100 outline-none transition duration-300 focus:border-blue-500 ${errors.compareDown ? "input-error" : ""}`}
                      />
                      {errors.compareDown && <span className="helper text-red-600">{errors.compareDown}</span>}
                    </label>
                    <label className="space-y-2 text-sm font-semibold text-slate-900" htmlFor="compare-rate">
                      APR
                      <input
                        id="compare-rate"
                        type="number"
                        step="0.01"
                        min="0"
                        value={Number.isFinite(comparisonRate) ? comparisonRate : 0}
                        onChange={(e) => setComparisonRate(e.target.value === "" ? 0 : Number(e.target.value))}
                        className={`w-full rounded-2xl border bg-white px-4 py-3 text-base font-semibold text-slate-900 shadow-inner shadow-slate-100 outline-none transition duration-300 focus:border-blue-500 ${errors.compareRate ? "input-error" : ""}`}
                      />
                    </label>
                    <label className="space-y-2 text-sm font-semibold text-slate-900" htmlFor="compare-term">
                      Term (years)
                      <input
                        id="compare-term"
                        type="number"
                        min="1"
                        value={Number.isFinite(comparisonTerm) ? comparisonTerm : 0}
                        onChange={(e) => setComparisonTerm(e.target.value === "" ? 0 : Number(e.target.value))}
                        className={`w-full rounded-2xl border bg-white px-4 py-3 text-base font-semibold text-slate-900 shadow-inner shadow-slate-100 outline-none transition duration-300 focus:border-blue-500 ${errors.compareTerm ? "input-error" : ""}`}
                      />
                      {errors.compareTerm && <span className="helper text-red-600">{errors.compareTerm}</span>}
                    </label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-blue-50 p-4 text-slate-900">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Loan A</p>
                      <p className="text-2xl font-bold">{formatCurrency(loanA.monthlyPayment)}</p>
                      <p className="text-sm text-slate-600">
                        Monthly · Total interest {formatCurrency(loanA.totalInterest)}
                      </p>
                      <p className="text-sm text-slate-600">Total paid {formatCurrency(loanA.totalPaid)}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-emerald-50 p-4 text-slate-900">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Loan B</p>
                      <p className="text-2xl font-bold">{formatCurrency(loanB.monthlyPayment)}</p>
                      <p className="text-sm text-slate-600">
                        Monthly · Total interest {formatCurrency(loanB.totalInterest)}
                      </p>
                      <p className="text-sm text-slate-600">Total paid {formatCurrency(loanB.totalPaid)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="space-y-6" id="results">
            <div className="card-surface relative overflow-hidden p-6 sm:p-8">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(14,165,233,0.08),transparent_30%),radial-gradient(circle_at_70%_0%,rgba(16,185,129,0.12),transparent_30%)]" />
              <div className="relative space-y-4" aria-live="polite">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Results</p>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {showComparison ? "Side-by-side summary" : "Amortization summary"}
                    </h2>
                    <p className="helper">Updated live as you type. Currency: {selectedCurrency}.</p>
                  </div>
                  <div className="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-slate-700 shadow-inner shadow-slate-100">
                    {countryOption.frequencyLabel} compounding
                  </div>
                </div>

                {showComparison ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-blue-50 p-4 shadow-inner shadow-slate-100">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Loan A</p>
                      <div className="mt-2 grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-3xl font-bold text-slate-900">{formatCurrency(loanA.monthlyPayment)}</p>
                          <p className="text-sm text-slate-600">Monthly payment</p>
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-slate-900">{formatCurrency(loanA.totalInterest)}</p>
                          <p className="text-sm text-slate-600">Total interest</p>
                        </div>
                      </div>
                      <ul className="mt-3 space-y-1 text-sm text-slate-700">
                        <li>Total paid: {formatCurrency(loanA.totalPaid)}</li>
                        <li>Principal: {formatCurrency(loanA.principal)}</li>
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-emerald-50 p-4 shadow-inner shadow-slate-100">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Loan B</p>
                      <div className="mt-2 grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-3xl font-bold text-slate-900">{formatCurrency(loanB.monthlyPayment)}</p>
                          <p className="text-sm text-slate-600">Monthly payment</p>
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-slate-900">{formatCurrency(loanB.totalInterest)}</p>
                          <p className="text-sm text-slate-600">Total interest</p>
                        </div>
                      </div>
                      <ul className="mt-3 space-y-1 text-sm text-slate-700">
                        <li>Total paid: {formatCurrency(loanB.totalPaid)}</li>
                        <li>Principal: {formatCurrency(loanB.principal)}</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-inner shadow-slate-100">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Monthly payment</p>
                        <p className="text-3xl font-bold text-slate-900">{formatCurrency(loanA.monthlyPayment)}</p>
                        <p className="text-sm text-slate-600">Principal + interest only</p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-inner shadow-slate-100">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Total interest</p>
                        <p className="text-3xl font-bold text-slate-900">{formatCurrency(loanA.totalInterest)}</p>
                        <p className="text-sm text-slate-600">Over the full {loanTerm > 0 ? loanTerm : 0}-year term</p>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-inner shadow-slate-100">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Total paid</p>
                      <p className="text-2xl font-bold text-slate-900">{formatCurrency(loanA.totalPaid)}</p>
                      <p className="text-sm text-slate-600">Principal plus all interest. Amortization below stays honest about the split.</p>
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">
                    {stampDutyNote.title}
                  </p>
                  <p className="mt-2 text-sm">{stampDutyNote.body}</p>
                  {stampDutyNote.guidanceUrl && (
                    <a
                      href={stampDutyNote.guidanceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex text-sm font-semibold text-amber-900 underline"
                    >
                      {stampDutyNote.guidanceLabel ?? "Official guidance"}
                    </a>
                  )}
                </div>

                {selectedCountry === "IE" && (
                  <p className="text-sm text-slate-600">
                    Buying in Ireland?{" "}
                    <a
                      href="https://myirishtax.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-slate-800 underline underline-offset-2 hover:text-slate-900"
                    >
                      See your take-home pay first
                    </a>
                  </p>
                )}

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                    onClick={handleExportCsv}
                  >
                    Export CSV
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    onClick={handleCopyShareLink}
                  >
                    Copy link
                  </button>
                  {exportStatus && <p className="self-center text-sm text-slate-600">{exportStatus}</p>}
                  {copyStatus && <p className="self-center text-sm text-slate-600">{copyStatus}</p>}
                </div>

                <CookieBanner />

                <div className="grid gap-3">
                  <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-inner shadow-slate-100">
                    <h3 className="text-lg font-semibold text-slate-900">Assumptions</h3>
                    <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
                      <li>
                        {selectedCountry === "IE"
                          ? "No stamp duty, solicitor fees, insurance, or other cash-to-close costs included."
                          : "No taxes, stamp duty, insurance, PMI, HOA fees, or currency fluctuations included."}
                      </li>
                      <li>Fixed-rate loan with level payments; compounding per selected country.</li>
                      <li>Payments made on time with no prepayments or fees.</li>
                    </ul>
                  </div>
                  <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-inner shadow-amber-100">
                    <h3 className="text-lg font-semibold">Disclaimers</h3>
                    <p className="text-sm">
                      This is an educational tool, not financial advice. Confirm details with a licensed lender before
                      committing to a loan.
                    </p>
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
                    We keep calculator inputs on your device and show exactly how we calculate your results. Explore the
                    About and Privacy pages for more.
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
          </section>
        </div>

        <div className="card-surface p-6 sm:p-8" id="amortization-chart">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">After the calculator</p>
              <h3 className="text-xl font-semibold text-slate-900">How the loan changes over time</h3>
              <p className="helper">
                This chart sits below the calculator so the monthly payment and total interest stay first. Lines show the
                split of each payment and the remaining balance.
              </p>
            </div>
          </div>
          <ul className="mt-4 flex flex-wrap gap-4 text-sm text-slate-700">
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-500" /> Blue: principal share of the payment
            </li>
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500" /> Green: interest share of the payment
            </li>
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-slate-400" /> Grey: remaining balance
            </li>
          </ul>
          <div className="mt-4 h-64 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="h-full w-full"
              role="img"
              aria-label="Chart of principal share, interest share, and remaining balance over the loan term"
            >
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1.8"
                strokeLinecap="round"
                points={chartPoints
                  .map((p, idx) => {
                    const x = (idx / Math.max(1, chartPoints.length - 1)) * 100;
                    const y = svgChartY(p.principal, loanA.monthlyPayment || 1);
                    return `${x},${y}`;
                  })
                  .join(" ")}
              />
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="1.8"
                strokeLinecap="round"
                points={chartPoints
                  .map((p, idx) => {
                    const x = (idx / Math.max(1, chartPoints.length - 1)) * 100;
                    const y = svgChartY(p.interest, loanA.monthlyPayment || 1);
                    return `${x},${y}`;
                  })
                  .join(" ")}
              />
              <polyline
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.8"
                strokeLinecap="round"
                points={chartPoints
                  .map((p, idx) => {
                    const x = (idx / Math.max(1, chartPoints.length - 1)) * 100;
                    const y = svgChartY(p.balance, maxBalance);
                    return `${x},${y}`;
                  })
                  .join(" ")}
              />
            </svg>
          </div>
        </div>

        <div className="card-surface p-6 sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Knowledge</p>
            <h3 className="text-xl font-semibold text-slate-900">FAQs</h3>
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

        <div className="card-surface p-6">
          <h3 className="text-lg font-semibold text-slate-900">Trust badges</h3>
          <div className="mt-3 flex flex-wrap gap-3">
            {["Secure", "Transparent", "No spam", "Educational only"].map((badge) => (
              <span key={badge} className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700">
                {badge}
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-700">
            Results update with aria-live announcements for screen readers, and all inputs include descriptive labels.
            This is not financial advice.
          </p>
        </div>
      </section>
    </div>
  );
}
