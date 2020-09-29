const path = require("path");

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
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
