import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // allow any HTTPS image (hotel/restaurant photos from various sources)
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
