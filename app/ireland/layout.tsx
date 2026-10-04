import type { Metadata } from "next";
import { shareMetadata } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ireland Mortgage Calculator",
  description: "Educational Irish euro mortgage estimates with monthly payment, total interest, and a stamp-duty reminder.",
  alternates: { canonical: "/ireland" },
  ...shareMetadata("/ireland", "Ireland Mortgage Calculator | World Mortgage Calculator", "Educational Irish euro mortgage estimates with monthly payment, total interest, and a stamp-duty reminder."),
};

export default function IrelandLayout({ children }: { children: React.ReactNode }) {
  return children;
}
