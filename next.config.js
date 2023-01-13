/** @type {import('next').NextConfig} */
const { withAxiom } = require("next-axiom");
const path = require("path");

const nextConfig = withAxiom({
  reactStrictMode: true,
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
});

module.exports = nextConfig;
