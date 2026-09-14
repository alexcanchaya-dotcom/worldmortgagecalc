import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ireland Mortgage Calculator",
  description: "Estimate Irish mortgage payments in euro with a simple amortization view.",
  alternates: { canonical: "/ireland" },
};

export default function IrelandLayout({ children }: { children: React.ReactNode }) {
  return children;
}
