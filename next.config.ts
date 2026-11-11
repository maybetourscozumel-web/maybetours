import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Booking data (availability, admin dashboard) must always be fresh per
  // request, so we keep Next's default dynamic rendering rather than opting
  // into experimental component-level caching.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
