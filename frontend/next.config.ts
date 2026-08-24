import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  // Production builds go to .next-prod so `npm run build` can NEVER corrupt
  // the running dev server's cache (.next). Prevents 500 errors mid-demo.
  distDir: process.env.NODE_ENV === 'production' ? '.next-prod' : '.next',
};

export default nextConfig;
