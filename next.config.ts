import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    ppr: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
    ],
  },
  serverExternalPackages: ['pdf-parse'],
  // https://nextjs.org/docs/pages/api-reference/config/next-config-js/serverExternalPackages
  // https://gitlab.com/autokent/pdf-parse/-/issues/24
};

export default nextConfig;
