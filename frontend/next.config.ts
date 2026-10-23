import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // As imagens vêm do backend (/uploads)
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      // Upload de várias imagens (até 5 MB cada) pelo painel
      bodySizeLimit: "25mb",
    },
  },
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Referrer-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
