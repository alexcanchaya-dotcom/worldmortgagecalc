export type CountryPresetId = "IE" | "GB" | "US" | "ES" | "PT";

export type StampDutyNote = {
  title: string;
  body: string;
  guidanceUrl?: string;
  guidanceLabel?: string;
};

export type CountryPreset = {
  id: CountryPresetId;
  /** ISO-style country code used by the calculator (UK is GB). */
  country: string;
  shortLabel: string;
  label: string;
  currency: string;
  price: number;
  down: number;
  termYears: number;
  /** Starter APR for education. Not a live quote. */
  illustrativeRate: number;
  rateBandLabel: string;
  stampDuty: StampDutyNote;
};

export const countryPresets: CountryPreset[] = [
  {
    id: "IE",
    country: "IE",
    shortLabel: "Ireland",
    label: "Ireland",
    currency: "EUR",
    price: 350000,
    down: 35000,
    termYears: 25,
    illustrativeRate: 3.8,
    rateBandLabel: "Illustrative 3.0–4.5% APR — educational starter, not a live bank quote",
    stampDuty: {
      title: "Irish stamp duty",
      body: "Ireland usually charges stamp duty on a property purchase. The amount depends on price, buyer type, and whether the home is residential. This calculator does not add stamp duty to the monthly payment — treat any figure from a lender or solicitor as the one that counts.",
      guidanceUrl: "https://www.revenue.ie/en/property/stamp-duty/property/residential-property.aspx",
      guidanceLabel: "Revenue stamp duty guidance",
    },
  },
  {
    id: "GB",
    country: "GB",
    shortLabel: "UK",
    label: "United Kingdom",
    currency: "GBP",
    price: 300000,
    down: 30000,
    termYears: 25,
    illustrativeRate: 4.5,
    rateBandLabel: "Illustrative 3.75–5.5% APR — educational starter, not a live bank quote",
    stampDuty: {
      title: "UK stamp duty / land tax",
      body: "England and Northern Ireland use Stamp Duty Land Tax. Scotland uses Land and Buildings Transaction Tax. Wales uses Land Transaction Tax. Thresholds and first-time buyer reliefs change, so check the rules for the nation where the home is. This calculator does not estimate those taxes.",
      guidanceUrl: "https://www.gov.uk/stamp-duty-land-tax",
      guidanceLabel: "GOV.UK Stamp Duty Land Tax",
    },
  },
  {
    id: "US",
    country: "US",
    shortLabel: "US",
    label: "United States",
    currency: "USD",
    price: 400000,
    down: 80000,
    termYears: 30,
    illustrativeRate: 6.25,
    rateBandLabel: "Illustrative 5.5–7.0% APR — educational starter, not a live bank quote",
    stampDuty: {
      title: "US transfer taxes",
      body: "There is no single US federal stamp duty. Some states and counties charge transfer or recording taxes. This calculator does not estimate those local costs — check the rules where the home is.",
      guidanceUrl: "https://www.consumerfinance.gov/owning-a-home/",
      guidanceLabel: "CFPB owning-a-home guide",
    },
  },
  {
    id: "ES",
    country: "ES",
    shortLabel: "Spain",
    label: "Spain",
    currency: "EUR",
    price: 250000,
    down: 50000,
    termYears: 25,
    illustrativeRate: 3.2,
    rateBandLabel: "Illustrative 2.5–4.0% APR — educational starter, not a live bank quote",
    stampDuty: {
      title: "Spanish transfer tax / stamp duty",
      body: "Resale homes often pay transfer tax (ITP). New builds often pay VAT plus stamp duty (AJD). Rates vary by autonomous community and property type. This calculator does not add those taxes to the monthly payment.",
      guidanceUrl:
        "https://sede.agenciatributaria.gob.es/Sede/en_gb/impuestos-tasas/impuesto-transmisiones-patrimoniales-actos-juridicos-documentados.html",
      guidanceLabel: "Agencia Tributaria ITP / AJD",
    },
  },
  {
    id: "PT",
    country: "PT",
    shortLabel: "Portugal",
    label: "Portugal",
    currency: "EUR",
    price: 250000,
    down: 50000,
    termYears: 30,
    illustrativeRate: 3.4,
    rateBandLabel: "Illustrative 2.5–4.0% APR — educational starter, not a live bank quote",
    stampDuty: {
      title: "Portuguese IMT and stamp duty",
      body: "Portugal typically charges IMT on the purchase plus stamp duty (Imposto do Selo). Rates depend on price and whether the home is a primary residence. This calculator does not estimate those taxes — check Portal das Finanças or a local adviser.",
      guidanceUrl: "https://www.portaldasfinancas.gov.pt/",
      guidanceLabel: "Portal das Finanças",
    },
  },
];

const genericStampDutyNote: StampDutyNote = {
  title: "Stamp duty / transfer tax",
  body: "Many places charge stamp duty or a transfer tax when you buy. Rules and exemptions differ, and this calculator does not add those costs to the monthly payment. Check local rules before you budget.",
};

export function getCountryPreset(countryOrId: string): CountryPreset | undefined {
  return countryPresets.find((preset) => preset.id === countryOrId || preset.country === countryOrId);
}

export function getStampDutyNote(countryCode: string): StampDutyNote {
  return getCountryPreset(countryCode)?.stampDuty ?? genericStampDutyNote;
}

export function isIllustrativeRateCopy(text: string): boolean {
  const lower = text.toLowerCase();
  return lower.includes("illustrative") && (lower.includes("educational") || lower.includes("not a live"));
}
