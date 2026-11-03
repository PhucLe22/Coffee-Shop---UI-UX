import type { NextConfig } from "next";

// STATIC_EXPORT=true builds a static site into ./out (used for the demo deploy on a static host).
const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  ...(isStaticExport && { output: "export", trailingSlash: true }),
  images: {
    unoptimized: isStaticExport,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
