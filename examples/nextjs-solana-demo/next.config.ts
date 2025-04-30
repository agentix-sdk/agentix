import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: [
    'agentix',
    '@agentix/wallet-solana',
    '@agentix/plugin-solana-adrena'
  ],
};

export default nextConfig;
