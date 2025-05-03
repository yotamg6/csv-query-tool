import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  webpack(config: any) {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      // redirect all "alasql" imports to the browser build:
      alasql$: path.resolve(__dirname, 'node_modules/alasql/dist/alasql.min.js'),
    };
    return config;
  },
};

export default nextConfig;
