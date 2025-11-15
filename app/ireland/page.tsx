'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function IrelandCalculator() {
  const [loanAmount, setLoanAmount] = useState(300000);
  const [interestRate, setInterestRate] = useState(3.5);
  const [loanTerm, setLoanTerm] = useState(25);
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-green-600 hover:text-green-700 flex items-center gap-2 mb-4">
            <span>←</span> Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🇮🇪 Ireland Mortgage Calculator</h1>
          <p className="text-gray-600">Calculate your monthly mortgage payments with current ECB rates</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Mortgage Details</h2>
            
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
                className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>€50k</span>
                <span>€1M</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Interest Rate: {interestRate}%
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1%</span>
                <span>10%</span>
              </div>
            </div>

            {/* Loan Term */}
            <div className="mb-6">
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
                className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5 years</span>
                <span>40 years</span>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Mortgage Breakdown</h2>
            
            <div className="space-y-4">
              {/* Monthly Payment */}
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                <p className="text-sm text-gray-600 mb-1">Monthly Payment</p>
                <p className="text-3xl font-bold text-green-700">{formatCurrency(monthlyPayment)}</p>
              </div>

              {/* Total Payment */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Total Amount Paid</p>
                <p className="text-2xl font-semibold text-gray-800">{formatCurrency(totalPayment)}</p>
              </div>

              {/* Total Interest */}
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Total Interest</p>
                <p className="text-2xl font-semibold text-blue-700">{formatCurrency(totalInterest)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  ({interestPercentage.toFixed(1)}% of total payment)
                </p>
              </div>

              {/* Payment Breakdown Chart */}
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Payment Breakdown</p>
                <div className="flex h-8 rounded-lg overflow-hidden">
                  <div 
                    className="bg-green-500 flex items-center justify-center text-white text-xs font-medium"
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
              <button
                onClick={() => setShowSchedule(!showSchedule)}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {showSchedule ? 'Hide' : 'Show'} Amortization Schedule
              </button>
            </div>
          </div>
        </div>

        {/* Amortization Schedule */}
        {showSchedule && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Amortization Schedule</h2>
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
                      <td className="text-right py-3 px-4 text-green-600">{formatCurrency(row.principal)}</td>
                      <td className="text-right py-3 px-4 text-gray-700">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">💡 About Irish Mortgages</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Most Irish mortgages are offered with terms between 20-30 years</li>
            <li>• Fixed rates are typically offered for 2-5 year periods</li>
            <li>• Variable rates fluctuate with ECB base rates</li>
            <li>• First-time buyers may qualify for Help to Buy scheme</li>
            <li>• This calculator uses a standard amortization formula and should be used for estimation purposes only</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
