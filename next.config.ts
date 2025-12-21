import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Cloudinary resimleri için
      },
      {
        protocol: 'https',
        hostname: 'ezm-backend-production.up.railway.app', // Kendi backend adresin (ne olur ne olmaz)
      },
    ],
  },
};

export default nextConfig;