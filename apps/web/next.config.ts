import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@copilot/shared', '@heroui/react', '@heroui/theme'],
};

export default nextConfig;
