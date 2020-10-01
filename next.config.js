const path = require("path");
const withCSS = require("@zeit/next-css");

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  withCSS,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        fs: "empty",
      };
    }

    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader",
    });
    return config;
  },
};
