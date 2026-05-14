import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreBuildErrors: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;