import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Brand logos come from logo.dev's image CDN.
    remotePatterns: [{ protocol: "https", hostname: "img.logo.dev" }],
  },
};

export default nextConfig;
