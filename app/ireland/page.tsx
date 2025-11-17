'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

type PayFrequency = 'annual' | 'monthly' | 'weekly';
type MaritalStatus = 'single' | 'married';

const payFrequencyLabels: Record<PayFrequency, string> = {
  annual: 'Annual',
  monthly: 'Monthly',
  weekly: 'Weekly',
};

const payFrequencyMultipliers: Record<PayFrequency, number> = {
  annual: 1,
  monthly: 12,
  weekly: 52,
};

const defaultState = {
  income: 60000,
  payFrequency: 'annual' as PayFrequency,
  maritalStatus: 'single' as MaritalStatus,
  pensionRate: 5,
  includeUsc: true,
  includePrsi: true,
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(isFinite(value) ? value : 0);
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

export default function IrelandCalculator() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paramsFromUrl = useMemo(() => {
    const incomeParam = Number(searchParams.get('income'));
    const payFrequencyParam = searchParams.get('frequency') as PayFrequency | null;
    const maritalStatusParam = searchParams.get('marital') as MaritalStatus | null;
    const pensionRateParam = Number(searchParams.get('pension'));
    const uscParam = searchParams.get('usc');
    const prsiParam = searchParams.get('prsi');

    return {
      income: !Number.isNaN(incomeParam) && incomeParam > 0 ? incomeParam : defaultState.income,
      payFrequency:
        payFrequencyParam && payFrequencyMultipliers[payFrequencyParam]
          ? payFrequencyParam
          : defaultState.payFrequency,
      maritalStatus:
        maritalStatusParam === 'single' || maritalStatusParam === 'married'
          ? maritalStatusParam
          : defaultState.maritalStatus,
      pensionRate:
        !Number.isNaN(pensionRateParam) && pensionRateParam >= 0 ? pensionRateParam : defaultState.pensionRate,
      includeUsc: uscParam ? uscParam === '1' : defaultState.includeUsc,
      includePrsi: prsiParam ? prsiParam === '1' : defaultState.includePrsi,
    };
  }, [searchParams]);

  const [income, setIncome] = useState<number>(() => paramsFromUrl.income);
  const [payFrequency, setPayFrequency] = useState<PayFrequency>(() => paramsFromUrl.payFrequency);
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>(() => paramsFromUrl.maritalStatus);
  const [pensionRate, setPensionRate] = useState<number>(() => paramsFromUrl.pensionRate);
  const [includeUsc, setIncludeUsc] = useState<boolean>(() => paramsFromUrl.includeUsc);
  const [includePrsi, setIncludePrsi] = useState<boolean>(() => paramsFromUrl.includePrsi);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const [errors, setErrors] = useState<{ income?: string; pensionRate?: string }>({});

  const annualGross = useMemo(() => income * payFrequencyMultipliers[payFrequency], [income, payFrequency]);

  const pensionAmount = useMemo(() => Math.max(0, annualGross * (pensionRate / 100)), [annualGross, pensionRate]);

  const paye = useMemo(() => {
    const standardBand = maritalStatus === 'married' ? 51000 : 42000;
    const standardTax = Math.min(annualGross, standardBand) * 0.2;
    const higherTax = Math.max(0, annualGross - standardBand) * 0.4;
    return standardTax + higherTax;
  }, [annualGross, maritalStatus]);

  const usc = useMemo(() => {
    if (!includeUsc) return 0;
    const bands = [
      { upTo: 12012, rate: 0.005 },
      { upTo: 25760, rate: 0.02 },
      { upTo: 100000, rate: 0.045 },
      { upTo: Infinity, rate: 0.08 },
    ];

    let remaining = annualGross;
    let total = 0;
    let previousLimit = 0;

    for (const band of bands) {
      const taxable = Math.max(0, Math.min(remaining, band.upTo - previousLimit));
      total += taxable * band.rate;
      remaining -= taxable;
      previousLimit = band.upTo;
      if (remaining <= 0) break;
    }

    return total;
  }, [annualGross, includeUsc]);

  const prsi = useMemo(() => (includePrsi ? annualGross * 0.04 : 0), [annualGross, includePrsi]);

  const totalDeductions = pensionAmount + paye + usc + prsi;
  const netAnnual = Math.max(0, annualGross - totalDeductions);
  const effectiveRate = annualGross > 0 ? totalDeductions / annualGross : 0;

  const payeMarginal = annualGross > (maritalStatus === 'married' ? 51000 : 42000) ? 0.4 : 0.2;
  const marginalRate = payeMarginal + (includePrsi ? 0.04 : 0) + (includeUsc ? 0.08 : 0);

  const periodTakeHome = (multiplier: number) => (netAnnual > 0 ? netAnnual / multiplier : 0);

  const validateFields = (value: number, type: 'income' | 'pensionRate') => {
    if (type === 'income') {
      if (Number.isNaN(value) || value <= 0) {
        setErrors((prev) => ({ ...prev, income: 'Please enter an income greater than 0.' }));
      } else {
        setErrors((prev) => ({ ...prev, income: undefined }));
      }
    }

    if (type === 'pensionRate') {
      if (Number.isNaN(value) || value < 0 || value > 70) {
        setErrors((prev) => ({ ...prev, pensionRate: 'Pension rate should be between 0% and 70%.' }));
      } else {
        setErrors((prev) => ({ ...prev, pensionRate: undefined }));
      }
    }
  };

  const handleShare = async () => {
    const params = new URLSearchParams({
      income: income.toString(),
      frequency: payFrequency,
      marital: maritalStatus,
      pension: pensionRate.toString(),
      usc: includeUsc ? '1' : '0',
      prsi: includePrsi ? '1' : '0',
    });

    router.replace(`?${params.toString()}`, { scroll: false });

    try {
      await navigator.clipboard.writeText(`${window.location.origin}/ireland?${params.toString()}`);
      setStatusMessage('Link copied with your selections.');
    } catch {
      setStatusMessage('URL updated with your selections. Copy manually if needed.');
    }
  };

  const handleReset = () => {
    setIncome(defaultState.income);
    setPayFrequency(defaultState.payFrequency);
    setMaritalStatus(defaultState.maritalStatus);
    setPensionRate(defaultState.pensionRate);
    setIncludeUsc(defaultState.includeUsc);
    setIncludePrsi(defaultState.includePrsi);
    setStatusMessage('');
    setErrors({});
    router.replace('/ireland', { scroll: false });
  };

  const payeBreakdown = [
    { label: 'PAYE', value: paye },
    { label: 'USC', value: usc },
    { label: 'PRSI', value: prsi },
    { label: 'Pension', value: pensionAmount },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-emerald-700 hover:text-emerald-800 flex items-center gap-2 mb-4 font-semibold">
          <span>←</span> Back to Home
        </Link>

        <header className="mb-8">
          <p className="text-sm uppercase tracking-wide text-emerald-700 font-semibold">Ireland</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Net Pay & Tax Calculator</h1>
          <p className="text-gray-600 max-w-3xl">
            Enter your salary and get a clear breakdown of PAYE, USC, PRSI and pension deductions. Use the shareable link to
            keep your settings or send them to a colleague.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <section className="bg-white rounded-2xl shadow-lg p-6 space-y-6 border border-emerald-100">
            <h2 className="text-2xl font-semibold text-gray-900">Income details</h2>

            <div className="space-y-4">
              <label className="block">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-800">Gross income</span>
                  <span className="text-xs text-gray-500">Example: 60,000</span>
                </div>
                <input
                  type="number"
                  className={`w-full rounded-lg border px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.income ? 'border-red-400' : 'border-gray-200'
                  }`}
                  value={Number.isNaN(income) ? '' : income}
                  placeholder="Enter your salary"
                  min={0}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    setIncome(value);
                    validateFields(value, 'income');
                  }}
                />
                {errors.income && <p className="text-sm text-red-600 mt-1">{errors.income}</p>}
              </label>

              <div className="grid md:grid-cols-2 gap-4">
                <label className="block">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800">Pay frequency</span>
                    <span className="text-xs text-gray-500">Choose how income is entered</span>
                  </div>
                  <select
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={payFrequency}
                    onChange={(event) => setPayFrequency(event.target.value as PayFrequency)}
                  >
                    <option value="annual">Annual salary</option>
                    <option value="monthly">Monthly income</option>
                    <option value="weekly">Weekly income</option>
                  </select>
                </label>

                <label className="block">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800">Marital status</span>
                    <span className="text-xs text-gray-500">Impacts tax bands</span>
                  </div>
                  <select
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={maritalStatus}
                    onChange={(event) => setMaritalStatus(event.target.value as MaritalStatus)}
                  >
                    <option value="single">Single / Widowed</option>
                    <option value="married">Married / Civil Partner</option>
                  </select>
                </label>
              </div>

              <div className="border rounded-xl border-gray-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsAdvancedOpen((prev) => !prev)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left bg-emerald-50 hover:bg-emerald-100"
                >
                  <span className="font-semibold text-gray-800">Advanced options</span>
                  <span className="text-sm text-emerald-700">{isAdvancedOpen ? 'Hide' : 'Show'}</span>
                </button>

                {isAdvancedOpen && (
                  <div className="p-4 space-y-4 bg-white">
                    <label className="block">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-800">Pension contribution</span>
                        <span className="text-xs text-gray-500">Example: 5%</span>
                      </div>
                      <div className="flex gap-3 items-center">
                        <input
                          type="number"
                          className={`w-full rounded-lg border px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                            errors.pensionRate ? 'border-red-400' : 'border-gray-200'
                          }`}
                          value={pensionRate}
                          placeholder="% of gross salary"
                          min={0}
                          max={70}
                          onChange={(event) => {
                            const value = Number(event.target.value);
                            setPensionRate(value);
                            validateFields(value, 'pensionRate');
                          }}
                        />
                        <span className="text-sm text-gray-600">%</span>
                      </div>
                      {errors.pensionRate && <p className="text-sm text-red-600 mt-1">{errors.pensionRate}</p>}
                    </label>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-emerald-300">
                        <input
                          type="checkbox"
                          checked={includeUsc}
                          onChange={(event) => setIncludeUsc(event.target.checked)}
                          className="h-4 w-4 text-emerald-600"
                        />
                        <div>
                          <p className="font-medium text-gray-800">Include USC</p>
                          <p className="text-xs text-gray-500">Universal Social Charge</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-emerald-300">
                        <input
                          type="checkbox"
                          checked={includePrsi}
                          onChange={(event) => setIncludePrsi(event.target.checked)}
                          className="h-4 w-4 text-emerald-600"
                        />
                        <div>
                          <p className="font-medium text-gray-800">Include PRSI</p>
                          <p className="text-xs text-gray-500">Pay Related Social Insurance</p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-sm"
              >
                Share results
              </button>
              {statusMessage && <p className="text-sm text-emerald-700 font-medium">{statusMessage}</p>}
            </div>
          </section>

          <section className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm uppercase text-emerald-700 font-semibold">Take-home pay</p>
                  <h2 className="text-3xl font-bold text-gray-900">{formatCurrency(netAnnual)}</h2>
                  <p className="text-sm text-gray-500">Based on {payFrequencyLabels[payFrequency].toLowerCase()} income</p>
                </div>
                <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-sm font-semibold border border-emerald-200">
                  Net
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {payeBreakdown.map((item) => (
                  <div key={item.label} className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                    <p className="text-sm text-gray-600">{item.label}</p>
                    <p className="text-xl font-semibold text-gray-900">{formatCurrency(item.value)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50">
                  <p className="text-sm text-emerald-700 font-semibold">Effective rate</p>
                  <p className="text-2xl font-bold text-emerald-900">{formatPercent(effectiveRate)}</p>
                </div>
                <div className="p-4 rounded-xl border border-blue-100 bg-blue-50">
                  <p className="text-sm text-blue-700 font-semibold">Marginal rate</p>
                  <p className="text-2xl font-bold text-blue-900">{formatPercent(marginalRate)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Take-home by pay period</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(payFrequencyMultipliers).map(([key, multiplier]) => (
                  <div key={key} className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                    <p className="text-sm text-gray-600">{payFrequencyLabels[key as PayFrequency]}</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(periodTakeHome(multiplier))}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-sm text-blue-900">
              <p className="font-semibold mb-1">About these calculations</p>
              <p>
                Figures use illustrative PAYE (20%/40% with expanded bands for couples), USC (0.5% / 2% / 4.5% / 8%), PRSI (4%),
                and a flat pension percentage. Use the advanced panel to toggle USC/PRSI or adjust pension contributions.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
