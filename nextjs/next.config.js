/** @type {import('next').NextConfig} */
const webpack = require('webpack');
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    config.plugins = [
      ...config.plugins,
      new webpack.IgnorePlugin({
        resourceRegExp: /^@react-native-async-storage\/async-storage$/,
      }),
    ];
    return config;
  },
};

module.exports = nextConfig;
