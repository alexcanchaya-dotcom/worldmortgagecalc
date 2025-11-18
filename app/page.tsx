"use client";

import { useCallback, useMemo, useState } from "react";

const defaultCurrencyCode = "USD";
const defaultPropertyPrice = 400000;
const defaultDownPayment = 80000;

const currencyOptions = [
  { code: "USD", label: "US Dollar", locale: "en-US" },
  { code: "EUR", label: "Euro", locale: "de-DE" },
  { code: "CAD", label: "Canadian Dollar", locale: "en-CA" },
  { code: "AUD", label: "Australian Dollar", locale: "en-AU" },
];

const countryOptions = [
  { code: "US", label: "United States", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "EU", label: "European Union", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "CA", label: "Canada", compoundingPeriods: 2, frequencyLabel: "Semi-annual" },
  { code: "AU", label: "Australia", compoundingPeriods: 12, frequencyLabel: "Monthly" },
];

const getCurrencyFormatter = (code: string) => {
  const option = currencyOptions.find((item) => item.code === code) ?? currencyOptions[0];

  return new Intl.NumberFormat(option.locale, {
    style: "currency",
    currency: option.code,
    maximumFractionDigits: 0,
  });
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

  const countryOption = useMemo(
    () => countryOptions.find((option) => option.code === selectedCountry) ?? countryOptions[0],
    [selectedCountry],
  );

  const currencyFormatter = useMemo(() => getCurrencyFormatter(selectedCurrency), [selectedCurrency]);

  const ctaButton =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-200";

  const loanAmount = Math.max(0, propertyPrice - downPayment);

  const monthlyPayment = useMemo(() => {
    const compoundingPeriods = countryOption.compoundingPeriods;
    const effectiveMonthlyRate =
      interestRate === 0
        ? 0
        : Math.pow(1 + interestRate / 100 / compoundingPeriods, compoundingPeriods / 12) - 1;
    const totalPayments = loanTerm * 12;

    if (effectiveMonthlyRate === 0) {
      return totalPayments === 0 ? 0 : loanAmount / totalPayments;
    }

    return (
      loanAmount *
      ((effectiveMonthlyRate * Math.pow(1 + effectiveMonthlyRate, totalPayments)) /
        (Math.pow(1 + effectiveMonthlyRate, totalPayments) - 1))
    );
  }, [countryOption.compoundingPeriods, interestRate, loanAmount, loanTerm]);

  const totalPaid = monthlyPayment * loanTerm * 12;
  const totalInterest = totalPaid - loanAmount;

  const formatCurrency = useCallback((value: number) => currencyFormatter.format(value), [currencyFormatter]);

  const handleCurrencyInput = (
    value: string,
    setNumericValue: (n: number) => void,
    setDisplayValue: (s: string) => void,
  ) => {
    const numericValue = Number(value.replace(/[^0-9.]/g, ""));
    setNumericValue(Number.isFinite(numericValue) ? numericValue : 0);
    setDisplayValue(value.trim() === "" ? "" : formatCurrency(Number.isFinite(numericValue) ? numericValue : 0));
  };

  const handleCurrencyChange = (code: string) => {
    setSelectedCurrency(code);
    const formatter = getCurrencyFormatter(code);
    setPropertyPriceDisplay(propertyPrice ? formatter.format(propertyPrice) : "");
    setDownPaymentDisplay(downPayment ? formatter.format(downPayment) : "");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 px-4 py-12 sm:py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col space-y-12 rounded-[28px] border border-slate-300 bg-white/90 p-6 shadow-lg shadow-[0_25px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-10">
        <header className="flex flex-col gap-5 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 shadow-inner shadow-sky-100">
            World Mortgage Calculator
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-5xl sm:leading-tight">
              Global mortgage estimator — simple, fast, and focused
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-relaxed text-slate-700 sm:text-lg">
              Start with the calculator below. Adjust price, down payment, APR, and term to instantly see your estimated monthly payment and total costs.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#calculator"
              className={`${ctaButton} h-12 bg-gradient-to-r from-blue-600 via-blue-600 to-emerald-400 shadow-blue-600/40 active:scale-[0.99]`}
            >
              Go to calculator
              <span className="h-5 w-5 rounded-full bg-white/40 text-sky-800 backdrop-blur-sm">→</span>
            </a>
            <span className="text-sm text-slate-700">
              Estimates only — not financial advice.
            </span>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.05fr,0.95fr]" id="calculator">
          <section className="relative overflow-hidden rounded-3xl border border-slate-300 bg-white p-6 shadow-lg shadow-slate-200/70 backdrop-blur-xl sm:p-8">
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900" htmlFor="currency">
                    Currency
                  </label>
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
                <div className="space-y-2">
                  <input
                    id="property-price"
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g., $450,000"
                    value={propertyPriceDisplay}
                    onChange={(e) =>
                      handleCurrencyInput(
                        e.target.value,
                        setPropertyPrice,
                        setPropertyPriceDisplay,
                      )
                    }
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-inner shadow-slate-100 outline-none ring-0 transition duration-300 hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-[0_12px_30px_rgba(56,189,248,0.18)] focus:-translate-y-0.5 focus:border-emerald-300 focus:ring-4 focus:ring-blue-200"
                  />
                  <p className="text-xs text-slate-600">Enter the total home price in your currency. Large numbers automatically format with separators.</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900" htmlFor="down-payment">
                  Down payment
                </label>
                <div className="space-y-2">
                  <input
                    id="down-payment"
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g., $80,000"
                    value={downPaymentDisplay}
                    onChange={(e) =>
                      handleCurrencyInput(
                        e.target.value,
                        setDownPayment,
                        setDownPaymentDisplay,
                      )
                    }
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-inner shadow-slate-100 outline-none transition duration-300 hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-[0_12px_30px_rgba(56,189,248,0.18)] focus:-translate-y-0.5 focus:border-emerald-300 focus:ring-4 focus:ring-blue-200"
                  />
                  <p className="text-xs text-slate-600">Loan amount updates automatically (price minus down payment).</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900" htmlFor="interest-rate">
                    Interest rate (APR)
                  </label>
                  <input
                    id="interest-rate"
                    type="number"
                    min={0}
                    step={0.1}
                    placeholder="e.g., 6.25"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-inner shadow-slate-100 outline-none transition duration-300 hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-[0_12px_30px_rgba(56,189,248,0.18)] focus:-translate-y-0.5 focus:border-emerald-300 focus:ring-4 focus:ring-blue-200"
                  />
                  <p className="text-xs text-slate-600">Annual percentage rate before fees; adjust to test scenarios.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900" htmlFor="loan-term">
                    Loan term (years, e.g., 30)
                  </label>
                  <input
                    id="loan-term"
                    type="number"
                    min={1}
                    placeholder="Loan length in years"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value) || 0)}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-inner shadow-slate-100 outline-none transition duration-300 hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-[0_12px_30px_rgba(56,189,248,0.18)] focus:-translate-y-0.5 focus:border-emerald-300 focus:ring-4 focus:ring-blue-200"
                  />
                  <p className="text-xs text-slate-600">How long you will repay the loan. Typical fixed-rate terms are 15–30 years.</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-600">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-emerald-50 px-3 py-2 shadow-inner shadow-emerald-100/60">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> Real-time recalculations
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-3 py-2 shadow-inner shadow-sky-100/60">
                  <span className="h-2 w-2 rounded-full bg-blue-600" /> Crisp financial breakdowns
                </span>
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-3xl border border-slate-300 bg-gradient-to-br from-slate-100 via-white to-emerald-50 p-6 shadow-2xl shadow-slate-200/70 sm:p-8">
            <div className="relative space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-sky-700">Live preview</p>
                  <p className="text-3xl font-bold text-slate-900 sm:text-4xl">
                    {formatCurrency(monthlyPayment || 0)}
                  </p>
                  <p className="text-sm text-slate-600">Estimated monthly payment</p>
                  <p className="text-xs text-slate-600">
                    {countryOption.label} — {countryOption.frequencyLabel} compounding, paid monthly
                  </p>
                </div>
              </div>

              <div className="grid gap-3 text-sm text-slate-900">
                <div className="rounded-2xl border border-slate-300 bg-white px-4 py-3 shadow-lg shadow-slate-200/70">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-700">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" /> Loan amount
                    </span>
                    <span className="text-lg font-semibold text-slate-900">{formatCurrency(loanAmount)}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-300 bg-white px-4 py-3 shadow-lg shadow-slate-200/70">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-700">
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> Total paid over {loanTerm} years
                    </span>
                    <span className="text-lg font-semibold text-slate-900">{formatCurrency(totalPaid || 0)}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-300 bg-white px-4 py-3 shadow-lg shadow-slate-200/70">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-700">
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> Total interest over term
                    </span>
                    <span className="text-lg font-semibold text-slate-900">{formatCurrency(totalInterest || 0)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
                <p className="font-semibold uppercase tracking-[0.2em] text-amber-600">Important</p>
                <p>Calculations are estimates only and do not include taxes, insurance, or fees.</p>
                <p>This tool is for planning purposes and does not constitute financial advice.</p>
              </div>
            </div>
          </section>
        </div>

        <footer className="flex flex-col gap-4 rounded-3xl border border-slate-300 bg-white p-6 text-sm text-slate-700 shadow-lg shadow-slate-200/70 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="space-y-2">
            <h4 className="text-lg font-semibold text-slate-900">World Mortgage Calculator</h4>
            <p className="max-w-xl leading-relaxed text-slate-700">
              Secure & private. This tool provides estimated figures for planning purposes only and is not financial advice.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <a className="rounded-full border border-slate-300 bg-slate-100 px-3 py-2 text-slate-900 transition hover:-translate-y-0.5 hover:border-blue-500 hover:text-slate-900" href="mailto:hello@worldmortgagecalc.com">
              Contact us
            </a>
            <a className="rounded-full border border-slate-300 bg-slate-100 px-3 py-2 text-slate-900 transition hover:-translate-y-0.5 hover:border-blue-500 hover:text-slate-900" href="/privacy-policy">
              Privacy Policy
            </a>
            <a className="rounded-full border border-slate-300 bg-slate-100 px-3 py-2 text-slate-900 transition hover:-translate-y-0.5 hover:border-blue-500 hover:text-slate-900" href="/terms">
              Terms of Service
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
