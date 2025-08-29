import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.clerk.com" },
      {
        protocol: "https",
        hostname: "bqzfdovnmdw0djrc.public.blob.vercel-storage.com"
      }
    ]
  },
  experimental: { serverActions: { bodySizeLimit: "10mb" } }
};

export default nextConfig;
