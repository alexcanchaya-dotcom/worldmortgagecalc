import type { Metadata } from "next";
import MortgageCalculator from "@/components/MortgageCalculator";
import { shareMetadata } from "@/lib/site";

export const metadata: Metadata = shareMetadata(
  "/",
  "World Mortgage Calculator",
  "Responsive mortgage calculator with amortization charts, transparency, and global currency support.",
);

type SearchParams = Record<string, string | string[] | undefined>;

function searchParamsToString(searchParams: SearchParams): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      if (value[0] !== undefined) params.set(key, value[0]);
    } else {
      params.set(key, value);
    }
  }
  return params.toString();
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  return <MortgageCalculator initialSearch={searchParamsToString(params)} />;
}
