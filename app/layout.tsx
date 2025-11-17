import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "World Mortgage Calculator – Global Mortgage Estimator",
  description:
    "World Mortgage Calculator delivers instant monthly payment estimates, total payoff amounts, and transparent interest details for global borrowers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
