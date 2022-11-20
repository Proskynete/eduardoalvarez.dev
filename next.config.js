/**
 * @type {import('next').NextConfig}
 */

const path = require("path");

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  webpack: (config, { isServer }) => {
    if (config.mode === "production") {
      require("./scripts/generate-sitemap");
      require("./scripts/generate-rss");
      require("./scripts/algolia");
    }

    if (!isServer) config.resolve.fallback.fs = false;

    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader",
    });

    return config;
  },
  images: {
    deviceSizes: [320, 420, 768, 1024, 1200],
    iconSizes: [],
    domains: [],
    path: "/_next/image",
    loader: "default",
  },
  resolve: {
    alias: {
      "react/jsx-dev-runtime": "react/jsx-dev-runtime.js",
      "react/jsx-runtime": "react/jsx-runtime.js",
    },
  },
};

module.exports = nextConfig;
