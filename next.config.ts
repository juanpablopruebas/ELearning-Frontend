import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: `standalone`,
  // reactStrictMode: false,
  images: {
    domains: ["res.cloudinary.com", "randomuser.me"],
  },
};

export default nextConfig;
