import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ireland Mortgage Calculator",
  description: "Educational Irish euro mortgage estimates with monthly payment, total interest, and a stamp-duty reminder.",
  alternates: { canonical: "/ireland" },
};

export default function IrelandLayout({ children }: { children: React.ReactNode }) {
  return children;
}
