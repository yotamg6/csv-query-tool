import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  experimental: {
    // @ts-expect-error -- disabling turbo, not yet in stable types

    turbo: false, // ⛔ disables Turbopack and switches to Webpack
  },
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
