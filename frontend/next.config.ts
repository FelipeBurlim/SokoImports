import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // As imagens vêm do backend (/uploads) e já são servidas em .webp
    unoptimized: true,
  },
};

export default nextConfig;