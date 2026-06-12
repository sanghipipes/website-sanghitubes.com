import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'www.transparenttextures.com' },
      // Supabase Storage — replace <project-ref> with your project ref
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};

export default nextConfig;
