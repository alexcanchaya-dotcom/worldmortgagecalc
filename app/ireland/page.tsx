'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function IrelandCalculator() {
  const [loanAmount, setLoanAmount] = useState(300000);
  const [interestRate, setInterestRate] = useState(3.5);
  const [loanTerm, setLoanTerm] = useState(25);
  const [showSchedule, setShowSchedule] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-6 transition-all hover:gap-3"
          >
            <span className="text-xl">←</span> 
            <span>Back to Home</span>
          </Link>
          <div className="space-y-3">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              🇮🇪 Ireland Mortgage Calculator
            </h1>
            <p className="text-xl text-gray-600">Calculate your monthly mortgage payments with current ECB rates</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-8 hover:shadow-3xl transition-shadow duration-300">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">Mortgage Details</h2>
            
            {/* Loan Amount */}
            <div className="mb-8">
              <label className="block text-base font-semibold text-gray-800 mb-3">
                Loan Amount: <span className="text-2xl text-emerald-600">{formatCurrency(loanAmount)}</span>
              </label>
              <input
                type="range"
                min="50000"
                max="1000000"
                step="10000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-full appearance-none cursor-pointer accent-emerald-600 transition-all hover:from-emerald-300 hover:to-teal-300"
                style={{
                  background: `linear-gradient(to right, rgb(16 185 129) 0%, rgb(16 185 129) ${((loanAmount - 50000) / 950000) * 100}%, rgb(209 250 229) ${((loanAmount - 50000) / 950000) * 100}%, rgb(209 250 229) 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2 font-medium">
                <span>€50k</span>
                <span>€1M</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="mb-8">
              <label className="block text-base font-semibold text-gray-800 mb-3">
                Annual Interest Rate: <span className="text-2xl text-teal-600">{interestRate}%</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-teal-200 to-cyan-200 rounded-full appearance-none cursor-pointer accent-teal-600"
                style={{
                  background: `linear-gradient(to right, rgb(20 184 166) 0%, rgb(20 184 166) ${((interestRate - 1) / 9) * 100}%, rgb(204 251 241) ${((interestRate - 1) / 9) * 100}%, rgb(204 251 241) 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2 font-medium">
                <span>1%</span>
                <span>10%</span>
              </div>
            </div>

            {/* Loan Term */}
            <div className="mb-8">
              <label className="block text-base font-semibold text-gray-800 mb-3">
                Loan Term: <span className="text-2xl text-cyan-600">{loanTerm} years</span>
              </label>
              <input
                type="range"
                min="5"
                max="40"
                step="1"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full appearance-none cursor-pointer accent-cyan-600"
                style={{
                  background: `linear-gradient(to right, rgb(6 182 212) 0%, rgb(6 182 212) ${((loanTerm - 5) / 35) * 100}%, rgb(207 250 254) ${((loanTerm - 5) / 35) * 100}%, rgb(207 250 254) 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2 font-medium">
                <span>5 years</span>
                <span>40 years</span>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-8 hover:shadow-3xl transition-shadow duration-300">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">Your Mortgage Breakdown</h2>
            
            <div className="space-y-6">
              {/* Monthly Payment - Hero Card */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-transform duration-200">
                <p className="text-emerald-100 text-sm font-medium mb-2">Monthly Payment</p>
                <p className="text-5xl font-bold text-white">{formatCurrency(monthlyPayment)}</p>
                <p className="text-emerald-100 text-sm mt-2">per month for {loanTerm} years</p>
              </div>

              {/* Total Payment */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border-2 border-gray-200 hover:border-gray-300 transition-colors">
                <p className="text-sm font-medium text-gray-600 mb-1">Total Amount Paid</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalPayment)}</p>
              </div>

              {/* Total Interest */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-blue-200 hover:border-blue-300 transition-colors">
                <p className="text-sm font-medium text-gray-600 mb-1">Total Interest</p>
                <p className="text-3xl font-bold text-blue-700">{formatCurrency(totalInterest)}</p>
                <p className="text-sm text-gray-500 mt-1">
                  ({interestPercentage.toFixed(1)}% of total payment)
                </p>
              </div>

              {/* Payment Breakdown Chart */}
              <div className="mt-6">
                <p className="text-base font-semibold text-gray-800 mb-3">Payment Breakdown</p>
                <div className="flex h-12 rounded-xl overflow-hidden shadow-lg">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-sm font-bold hover:from-emerald-600 hover:to-emerald-700 transition-colors"
                    style={{ width: `${((loanAmount / totalPayment) * 100).toFixed(1)}%` }}
                  >
                    Principal
                  </div>
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center text-white text-sm font-bold hover:from-blue-600 hover:to-cyan-700 transition-colors"
                    style={{ width: `${interestPercentage.toFixed(1)}%` }}
                  >
                    Interest
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-3 font-medium">
                  <span>Principal: {formatCurrency(loanAmount)}</span>
                  <span>Interest: {formatCurrency(totalInterest)}</span>
                </div>
              </div>

              {/* Show Schedule Button */}
              <button
                onClick={() => setShowSchedule(!showSchedule)}
                className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {showSchedule ? '📊 Hide' : '📈 Show'} Amortization Schedule
              </button>
            </div>
          </div>
        </div>

        {/* Amortization Schedule */}
        {showSchedule && (
          <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-8 animate-fadeIn">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Amortization Schedule</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-emerald-600 to-teal-600">
                  <tr>
                    <th className="text-left py-4 px-6 text-white font-bold">Year</th>
                    <th className="text-right py-4 px-6 text-white font-bold">Interest Paid</th>
                    <th className="text-right py-4 px-6 text-white font-bold">Principal Paid</th>
                    <th className="text-right py-4 px-6 text-white font-bold">Remaining Balance</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {generateSchedule().map((row, index) => (
                    <tr 
                      key={row.year} 
                      className={`border-b border-gray-100 hover:bg-emerald-50 transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                    >
                      <td className="py-4 px-6 font-bold text-gray-900">{row.year}</td>
                      <td className="text-right py-4 px-6 text-blue-600 font-semibold">{formatCurrency(row.interest)}</td>
                      <td className="text-right py-4 px-6 text-emerald-600 font-semibold">{formatCurrency(row.principal)}</td>
                      <td className="text-right py-4 px-6 text-gray-700 font-semibold">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            💡 About Irish Mortgages
          </h3>
          <ul className="text-base text-gray-700 space-y-3 leading-relaxe
