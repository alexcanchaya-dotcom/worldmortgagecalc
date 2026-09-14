import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import CookieBanner from "@/components/CookieBanner";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "World Mortgage Calculator – Global Mortgage Estimator",
    template: "%s | World Mortgage Calculator",
  },
  description:
    "World Mortgage Calculator delivers instant monthly payment estimates, amortization insights, and transparent assumptions for global borrowers.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "World Mortgage Calculator",
    description:
      "Responsive mortgage calculator with amortization charts, transparency, and global currency support.",
    url: siteUrl,
    siteName: "World Mortgage Calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@worldmortgagecalc",
    title: "World Mortgage Calculator",
    description:
      "Transparent mortgage calculator with charts, assumptions, and global currency options.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/brand-mark.svg" type="image/svg+xml" />
        <link rel="preload" href="/logo-wordmark.svg" as="image" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased text-slate-900`}>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <CookieBanner />
      </body>
    </html>
  );
}
