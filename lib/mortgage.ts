export type CurrencyOption = {
  code: string;
  label: string;
  locale: string;
  defaultCountry: string;
};

export type CountryOption = {
  code: string;
  label: string;
  currency: string;
  compoundingPeriods: number;
  frequencyLabel: string;
};

export const currencyOptions: CurrencyOption[] = [
  { code: "USD", label: "US Dollar", locale: "en-US", defaultCountry: "US" },
  { code: "EUR", label: "Euro", locale: "en-IE", defaultCountry: "IE" },
  { code: "CAD", label: "Canadian Dollar", locale: "en-CA", defaultCountry: "CA" },
  { code: "AUD", label: "Australian Dollar", locale: "en-AU", defaultCountry: "AU" },
  { code: "GBP", label: "British Pound", locale: "en-GB", defaultCountry: "GB" },
  { code: "CHF", label: "Swiss Franc", locale: "de-CH", defaultCountry: "CH" },
  { code: "JPY", label: "Japanese Yen", locale: "ja-JP", defaultCountry: "JP" },
  { code: "CNY", label: "Chinese Yuan", locale: "zh-CN", defaultCountry: "CN" },
  { code: "INR", label: "Indian Rupee", locale: "en-IN", defaultCountry: "IN" },
  { code: "MXN", label: "Mexican Peso", locale: "es-MX", defaultCountry: "MX" },
  { code: "BRL", label: "Brazilian Real", locale: "pt-BR", defaultCountry: "BR" },
  { code: "ZAR", label: "South African Rand", locale: "en-ZA", defaultCountry: "ZA" },
  { code: "NZD", label: "New Zealand Dollar", locale: "en-NZ", defaultCountry: "NZ" },
  { code: "SGD", label: "Singapore Dollar", locale: "en-SG", defaultCountry: "SG" },
  { code: "HKD", label: "Hong Kong Dollar", locale: "zh-HK", defaultCountry: "HK" },
  { code: "SEK", label: "Swedish Krona", locale: "sv-SE", defaultCountry: "SE" },
  { code: "NOK", label: "Norwegian Krone", locale: "no-NO", defaultCountry: "NO" },
  { code: "DKK", label: "Danish Krone", locale: "da-DK", defaultCountry: "DK" },
  { code: "PLN", label: "Polish Zloty", locale: "pl-PL", defaultCountry: "PL" },
  { code: "CZK", label: "Czech Koruna", locale: "cs-CZ", defaultCountry: "CZ" },
];

export const countryOptions: CountryOption[] = [
  { code: "US", label: "United States", currency: "USD", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "IE", label: "Ireland", currency: "EUR", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "EU", label: "European Union", currency: "EUR", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "CA", label: "Canada", currency: "CAD", compoundingPeriods: 2, frequencyLabel: "Semi-annual" },
  { code: "AU", label: "Australia", currency: "AUD", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "GB", label: "United Kingdom", currency: "GBP", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "CH", label: "Switzerland", currency: "CHF", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "JP", label: "Japan", currency: "JPY", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "CN", label: "China", currency: "CNY", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "IN", label: "India", currency: "INR", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "MX", label: "Mexico", currency: "MXN", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "BR", label: "Brazil", currency: "BRL", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "ZA", label: "South Africa", currency: "ZAR", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "NZ", label: "New Zealand", currency: "NZD", compoundingPeriods: 2, frequencyLabel: "Semi-annual" },
  { code: "SG", label: "Singapore", currency: "SGD", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "HK", label: "Hong Kong", currency: "HKD", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "SE", label: "Sweden", currency: "SEK", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "NO", label: "Norway", currency: "NOK", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "DK", label: "Denmark", currency: "DKK", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "PL", label: "Poland", currency: "PLN", compoundingPeriods: 12, frequencyLabel: "Monthly" },
  { code: "CZ", label: "Czech Republic", currency: "CZK", compoundingPeriods: 12, frequencyLabel: "Monthly" },
];

export type AmortizationRow = {
  month: number;
  interest: number;
  principal: number;
  balance: number;
};

export type LoanInputs = {
  price: number;
  down: number;
  rate: number;
  termYears: number;
};

export function getCurrencyOption(code: string): CurrencyOption {
  return currencyOptions.find((item) => item.code === code) ?? currencyOptions[0];
}

export function getCountryOption(code: string): CountryOption {
  return countryOptions.find((item) => item.code === code) ?? countryOptions[0];
}

export function getCurrencyFormatter(code: string) {
  const option = getCurrencyOption(code);

  return new Intl.NumberFormat(option.locale, {
    style: "currency",
    currency: option.code,
    maximumFractionDigits: 0,
  });
}

export function parseMoneyInput(value: string): number {
  const cleaned = value.replace(/[^0-9.]/g, "");
  if (cleaned === "" || cleaned === ".") return 0;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function getLoanAmount(price: number, down: number): number {
  if (!Number.isFinite(price) || price <= 0) return 0;
  if (!Number.isFinite(down) || down <= 0) return price;
  return Math.max(0, price - down);
}

export function getMonthlyPayment(
  price: number,
  down: number,
  rate: number,
  termYears: number,
  compoundingPeriods: number,
): number {
  const loanAmount = getLoanAmount(price, down);
  const periods = Number.isFinite(compoundingPeriods) && compoundingPeriods > 0 ? compoundingPeriods : 12;
  const totalPayments = termYears * 12;

  if (!Number.isFinite(loanAmount) || loanAmount <= 0) return 0;
  if (!Number.isFinite(termYears) || termYears <= 0 || totalPayments <= 0) return 0;
  if (!Number.isFinite(rate) || rate < 0) return 0;

  const effectiveMonthlyRate =
    rate === 0 ? 0 : Math.pow(1 + rate / 100 / periods, periods / 12) - 1;

  if (effectiveMonthlyRate === 0) {
    return loanAmount / totalPayments;
  }

  const factor = Math.pow(1 + effectiveMonthlyRate, totalPayments);
  return loanAmount * ((effectiveMonthlyRate * factor) / (factor - 1));
}

export function buildAmortization(
  price: number,
  down: number,
  rate: number,
  termYears: number,
  compoundingPeriods: number,
): AmortizationRow[] {
  const monthlyPayment = getMonthlyPayment(price, down, rate, termYears, compoundingPeriods);
  const totalPayments = termYears * 12;
  const periods = Number.isFinite(compoundingPeriods) && compoundingPeriods > 0 ? compoundingPeriods : 12;

  if (!Number.isFinite(termYears) || termYears <= 0 || totalPayments <= 0) {
    return [];
  }

  let balance = getLoanAmount(price, down);
  const effectiveMonthlyRate =
    rate === 0 ? 0 : Math.pow(1 + rate / 100 / periods, periods / 12) - 1;
  const schedule: AmortizationRow[] = [];

  for (let month = 1; month <= totalPayments; month += 1) {
    const interestPayment = balance * effectiveMonthlyRate;
    const principalPayment = Math.max(0, monthlyPayment - interestPayment);
    balance = Math.max(0, balance - principalPayment);
    schedule.push({ month, interest: interestPayment, principal: principalPayment, balance });
  }

  return schedule;
}

export function summarizeLoan(
  price: number,
  down: number,
  rate: number,
  termYears: number,
  compoundingPeriods: number,
) {
  const principal = getLoanAmount(price, down);
  const monthlyPayment = getMonthlyPayment(price, down, rate, termYears, compoundingPeriods);
  const months = termYears > 0 ? termYears * 12 : 0;
  const totalPaid = monthlyPayment * months;
  const totalInterest = Math.max(0, totalPaid - principal);

  return { principal, monthlyPayment, totalPaid, totalInterest, months };
}

export function validateLoanInputs(inputs: LoanInputs, fieldPrefix = ""): Record<string, string> {
  const errors: Record<string, string> = {};
  const priceKey = fieldPrefix ? `${fieldPrefix}Price` : "propertyPrice";
  const downKey = fieldPrefix ? `${fieldPrefix}Down` : "downPayment";
  const termKey = fieldPrefix ? `${fieldPrefix}Term` : "loanTerm";
  const rateKey = fieldPrefix ? `${fieldPrefix}Rate` : "interestRate";

  if (!Number.isFinite(inputs.price) || inputs.price <= 0) {
    errors[priceKey] = "Enter a purchase price greater than zero.";
  }
  if (!Number.isFinite(inputs.down) || inputs.down < 0) {
    errors[downKey] = "Down payment cannot be negative.";
  } else if (Number.isFinite(inputs.price) && inputs.down > inputs.price) {
    errors[downKey] = "Down payment cannot be greater than the purchase price.";
  }
  if (!Number.isFinite(inputs.termYears) || inputs.termYears <= 0) {
    errors[termKey] = "Enter a loan term of at least 1 year.";
  }
  if (!Number.isFinite(inputs.rate) || inputs.rate < 0) {
    errors[rateKey] = "Interest rate cannot be negative.";
  }

  return errors;
}

export function countryForCurrency(currencyCode: string, currentCountry: string): string {
  const current = getCountryOption(currentCountry);
  if (current.currency === currencyCode) return current.code;
  return getCurrencyOption(currencyCode).defaultCountry;
}

export function currencyForCountry(countryCode: string): string {
  return getCountryOption(countryCode).currency;
}

export function amortizationToCsv(schedule: AmortizationRow[]): string {
  const header = "month,interest,principal,balance";
  const rows = schedule.map(
    (row) =>
      `${row.month},${row.interest.toFixed(2)},${row.principal.toFixed(2)},${row.balance.toFixed(2)}`,
  );
  return [header, ...rows].join("\n");
}

export type ShareState = {
  price: number;
  down: number;
  rate: number;
  term: number;
  currency: string;
  country: string;
  compare: boolean;
  bPrice: number;
  bDown: number;
  bRate: number;
  bTerm: number;
};

export function readShareParams(search: string, defaults: ShareState): ShareState {
  const params = new URLSearchParams(search);
  const num = (key: string, fallback: number) => {
    const raw = params.get(key);
    if (raw === null || raw === "") return fallback;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const currency = params.get("currency") ?? defaults.currency;
  const country = params.get("country") ?? defaults.country;

  return {
    price: num("price", defaults.price),
    down: num("down", defaults.down),
    rate: num("rate", defaults.rate),
    term: num("term", defaults.term),
    currency: currencyOptions.some((item) => item.code === currency) ? currency : defaults.currency,
    country: countryOptions.some((item) => item.code === country) ? country : defaults.country,
    compare: params.get("compare") === "1",
    bPrice: num("bPrice", defaults.bPrice),
    bDown: num("bDown", defaults.bDown),
    bRate: num("bRate", defaults.bRate),
    bTerm: num("bTerm", defaults.bTerm),
  };
}

export function buildShareParams(state: ShareState): string {
  const params = new URLSearchParams({
    price: String(state.price),
    down: String(state.down),
    rate: String(state.rate),
    term: String(state.term),
    currency: state.currency,
    country: state.country,
  });

  if (state.compare) {
    params.set("compare", "1");
    params.set("bPrice", String(state.bPrice));
    params.set("bDown", String(state.bDown));
    params.set("bRate", String(state.bRate));
    params.set("bTerm", String(state.bTerm));
  }

  return params.toString();
}
