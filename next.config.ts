import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: { 
    allowedDevOrigins: ['10.15.249.108'] 
  }
};

export default nextConfig;
