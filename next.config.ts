import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.worldmortgagecalc.com" }],
        destination: "https://worldmortgagecalc.com/:path*",
        permanent: true,
      },
      {
        source: "/premium-calculator.html",
        destination: "/premium-calculator",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
