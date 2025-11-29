import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
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

const siteUrl = "https://worldmortgagecalc.com";

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

const navLinks = [
  { href: "/", label: "Calculator" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/disclaimer", label: "Disclaimer" },
];

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
          <header className="sticky top-0 z-30 backdrop-blur-md bg-white/85 border-b border-slate-200">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
              <Link href="/" className="flex items-center gap-3" aria-label="World Mortgage Calculator home">
                <Image src="/logo-wordmark.svg" alt="World Mortgage Calculator" width={240} height={40} priority />
              </Link>
              <nav className="hidden items-center gap-4 text-sm font-semibold text-slate-700 sm:flex">
                {navLinks.map((link) => (
                  <Link key={link.href} className="rounded-full px-3 py-2 transition hover:bg-slate-100" href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-slate-200 bg-white/85 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <div className="space-y-2">
                <Image src="/logo-wordmark.svg" alt="World Mortgage Calculator" width={210} height={36} />
                <p className="text-sm text-slate-600">
                  Fast, transparent mortgage estimates with clear assumptions and disclosures.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700">
                {navLinks.map((link) => (
                  <Link key={link.href} className="rounded-full px-3 py-2 transition hover:bg-slate-100" href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
