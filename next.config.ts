import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['@mastra/*'],
  devIndicators: false,
  webpack(config) {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })
    return config
  },
  turbopack: {
    rules: {
      '*.md': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
    },
  },
}

export default nextConfig
