export const siteUrl = "https://www.worldmortgagecalc.com";
export const contactEmail = "hello@worldmortgagecalc.com";
export const siteName = "World Mortgage Calculator";

const shareImageAlt = "World Mortgage Calculator: free monthly payment and total interest estimates";

/**
 * Per-page share tags. og:url is the page's own path (resolved against metadataBase).
 * A page that sets its own openGraph/twitter no longer inherits the root
 * app/opengraph-image and app/twitter-image, so the images are listed here too.
 */
export function shareMetadata(path: string, title: string, description: string) {
  return {
    openGraph: {
      type: "website" as const,
      siteName,
      url: path,
      title,
      description,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: shareImageAlt }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [{ url: "/twitter-image", width: 1200, height: 630, alt: shareImageAlt }],
    },
  };
}

export const navLinks = [
  { href: "/", label: "Calculator" },
  { href: "/ireland", label: "Ireland" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export const sisterSites = [
  { href: "https://thewealthmodeler.com", label: "Wealth Modeler" },
  { href: "https://longevitymodeler.com", label: "Longevity Modeler" },
];
