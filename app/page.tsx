"use client";

import { useMemo, useState } from "react";

export default function HomePage() {
  const [propertyPrice, setPropertyPrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [interestRate, setInterestRate] = useState(3.5);
  const [loanTerm, setLoanTerm] = useState(30);

  const loanAmount = Math.max(0, propertyPrice - downPayment);

  const monthlyPayment = useMemo(() => {
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;

    if (monthlyRate === 0) {
      return loanAmount / totalPayments;
    }

    return (
      loanAmount *
      ((monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1))
    );
  }, [interestRate, loanAmount, loanTerm]);

  const totalPaid = monthlyPayment * loanTerm * 12;
  const totalInterest = totalPaid - loanAmount;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-indigo-100 p-8 space-y-10">
        <header className="space-y-2 text-center">
          <p className="text-sm font-semibold text-indigo-600">Mortgage calculator</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Get a clear view of your monthly payment
          </h1>
          <p className="text-gray-600">
            Enter your property details to estimate payments. No extra tools or region-specific add-ons—just a simple mortgage
            calculator.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="property-price">
                Property price
              </label>
              <input
                id="property-price"
                type="number"
                min={0}
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value) || 0)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="down-payment">
                Down payment
              </label>
              <input
                id="down-payment"
                type="number"
                min={0}
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value) || 0)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <p className="text-xs text-gray-500">Loan amount is automatically calculated from price minus down payment.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="interest-rate">
                  Interest rate (APR)
                </label>
                <input
                  id="interest-rate"
                  type="number"
                  min={0}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="loan-term">
                  Loan term (years)
                </label>
                <input
                  id="loan-term"
                  type="number"
                  min={1}
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value) || 0)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-6 shadow-inner space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Estimated monthly payment</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(monthlyPayment || 0)}</p>
              </div>
              <div className="rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm font-semibold shadow-sm">
                Simple & focused
              </div>
            </div>

            <div className="grid gap-3 text-sm text-gray-700">
              <div className="flex items-center justify-between rounded-xl bg-white/70 px-4 py-3 border border-indigo-100">
                <span>Loan amount</span>
                <span className="font-semibold text-gray-900">{formatCurrency(loanAmount)}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/70 px-4 py-3 border border-indigo-100">
                <span>Total paid over {loanTerm} years</span>
                <span className="font-semibold text-gray-900">{formatCurrency(totalPaid || 0)}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/70 px-4 py-3 border border-indigo-100">
                <span>Total interest</span>
                <span className="font-semibold text-gray-900 text-right">{formatCurrency(totalInterest || 0)}</span>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              This calculator uses a standard amortization formula. Values are estimates and for general guidance only.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
