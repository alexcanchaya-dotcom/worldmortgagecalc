'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getCountryPreset, getStampDutyNote } from '@/lib/countryPresets';

const irelandPreset = getCountryPreset('IE');
const irelandStampDuty = getStampDutyNote('IE');

export default function IrelandCalculator() {
  const [loanAmount, setLoanAmount] = useState(irelandPreset?.price ? irelandPreset.price - irelandPreset.down : 315000);
  const [interestRate, setInterestRate] = useState(irelandPreset?.illustrativeRate ?? 3.8);
  const [loanTerm, setLoanTerm] = useState(irelandPreset?.termYears ?? 25);
  const [showSchedule, setShowSchedule] = useState(false);

  // Calculate monthly payment using mortgage formula
  const calculateMonthlyPayment = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    if (monthlyRate === 0) {
      return principal / numberOfPayments;
    }
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    return monthlyPayment;
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalPayment = monthlyPayment * loanTerm * 12;
  const totalInterest = totalPayment - loanAmount;
  const interestPercentage = (totalInterest / totalPayment) * 100;
  const payoffYear = new Date().getFullYear() + loanTerm;

  // Generate amortization schedule
  const generateSchedule = () => {
    const schedule = [];
    let balance = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    
    for (let year = 1; year <= loanTerm; year++) {
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;
      
      for (let month = 1; month <= 12; month++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        balance -= principalPayment;
        yearlyInterest += interestPayment;
        yearlyPrincipal += principalPayment;
      }
      
      schedule.push({
        year,
        interest: yearlyInterest,
        principal: yearlyPrincipal,
        balance: Math.max(0, balance)
      });
    }
    
    return schedule;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-white p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 border border-emerald-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <Link href="/?country=IE&currency=EUR" className="text-emerald-600 hover:text-emerald-700 flex items-center gap-2 text-sm font-semibold">
                <span>←</span> Open Ireland in the main calculator
              </Link>
              <h1 className="text-4xl font-bold text-gray-900">🇮🇪 Ireland Mortgage Calculator</h1>
              <p className="text-gray-600">
                Educational euro estimates. The starter rate is illustrative — not a live bank quote and not a promise of approval.
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold">Real-time updates</span>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold">Share-ready outputs</span>
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-semibold">Mobile friendly</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-xl p-4 shadow-md w-full md:w-72">
              <p className="text-sm uppercase tracking-wide text-emerald-50">At-a-glance</p>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Monthly</span>
                  <span className="font-semibold">{formatCurrency(monthlyPayment)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Payoff year</span>
                  <span className="font-semibold">{payoffYear}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Interest share</span>
                  <span className="font-semibold">{interestPercentage.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Mortgage details</h2>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold">Tweak sliders</span>
            </div>

            {/* Loan Amount */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Amount: {formatCurrency(loanAmount)}
              </label>
              <input
                type="range"
                min="50000"
                max="1000000"
                step="10000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>€50k</span>
                <span>€1M</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Illustrative annual rate: {interestRate}%
              </label>
              <p className="text-xs text-gray-500 mb-2">
                {irelandPreset?.rateBandLabel ?? 'Educational starter, not a live bank quote.'}
              </p>
              <input
                type="range"
                min="1"
                max="10"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1%</span>
                <span>10%</span>
              </div>
            </div>

            {/* Loan Term */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Term: {loanTerm} years
              </label>
              <input
                type="range"
                min="5"
                max="40"
                step="1"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5 years</span>
                <span>40 years</span>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-50 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Your mortgage snapshot</h2>
              <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold">Live updates</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                <p className="text-xs text-gray-600 mb-1">Monthly payment</p>
                <p className="text-2xl font-bold text-emerald-700">{formatCurrency(monthlyPayment)}</p>
                <p className="text-[11px] text-emerald-800/80 mt-1">Principal + interest only</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-xs text-gray-600 mb-1">Total interest</p>
                <p className="text-2xl font-bold text-blue-700">{formatCurrency(totalInterest)}</p>
                <p className="text-[11px] text-blue-700/80 mt-1">{interestPercentage.toFixed(1)}% of everything you would pay</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <p className="text-xs text-gray-600 mb-1">Total paid</p>
              <p className="text-xl font-semibold text-gray-800">{formatCurrency(totalPayment)}</p>
              <p className="text-[11px] text-gray-500 mt-1">Principal plus all interest over the term</p>
            </div>

            {/* Payment Breakdown Chart */}
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700 mb-2">Payment Breakdown</p>
              <div className="flex h-9 rounded-lg overflow-hidden ring-1 ring-emerald-100">
                <div
                  className="bg-emerald-500 flex items-center justify-center text-white text-xs font-medium"
                  style={{ width: `${((loanAmount / totalPayment) * 100).toFixed(1)}%` }}
                >
                  Principal
                </div>
                <div
                  className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
                  style={{ width: `${interestPercentage.toFixed(1)}%` }}
                >
                  Interest
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Principal: {formatCurrency(loanAmount)}</span>
                <span>Interest: {formatCurrency(totalInterest)}</span>
              </div>
            </div>

            {/* Show Schedule Button */}
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-950">
              <p className="text-xs font-semibold uppercase tracking-wide">{irelandStampDuty.title}</p>
              <p className="mt-2 text-sm">{irelandStampDuty.body}</p>
              {irelandStampDuty.guidanceUrl && (
                <a
                  href={irelandStampDuty.guidanceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex text-sm font-semibold underline"
                >
                  {irelandStampDuty.guidanceLabel ?? 'Official guidance'}
                </a>
              )}
            </div>

            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              {showSchedule ? 'Hide' : 'Show'} amortization table
            </button>
          </div>
        </div>

        {/* Amortization Schedule */}
        {showSchedule && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-50">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Amortization schedule</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-700">Year</th>
                    <th className="text-right py-3 px-4 text-gray-700">Interest Paid</th>
                    <th className="text-right py-3 px-4 text-gray-700">Principal Paid</th>
                    <th className="text-right py-3 px-4 text-gray-700">Remaining Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {generateSchedule().map((row) => (
                    <tr key={row.year} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-800">{row.year}</td>
                      <td className="text-right py-3 px-4 text-blue-600">{formatCurrency(row.interest)}</td>
                      <td className="text-right py-3 px-4 text-emerald-600">{formatCurrency(row.principal)}</td>
                      <td className="text-right py-3 px-4 text-gray-700">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-white rounded-2xl p-6 border border-emerald-50 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">💡 About Irish Mortgages</h3>
            <span className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-semibold">Guidance only</span>
          </div>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Most Irish mortgages are offered with terms between 20-30 years.</li>
            <li>• Fixed rates are typically offered for 2-5 year periods. The rate on this page is an educational starter, not a live quote.</li>
            <li>• Variable rates can move with ECB decisions. We do not fetch bank rates.</li>
            <li>• First-time buyers may qualify for Help to Buy — check official Revenue guidance.</li>
            <li>• Irish stamp duty usually applies on purchase. This page does not calculate it. See <a className="font-semibold text-emerald-700 underline" href="https://www.revenue.ie/en/property/stamp-duty/property/residential-property.aspx" target="_blank" rel="noopener noreferrer">Revenue stamp duty guidance</a>.</li>
            <li>• This calculator uses a standard amortization formula and should be used for estimation purposes only.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
