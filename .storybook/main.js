const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

// const appWebpack = require(path.join(process.cwd(), "webpack.config.js"));

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "storybook-addon-performance/register",
    {
      name: "@storybook/addon-storysource",
      options: {
        loaderOptions: {
          injectStoryParameters: false,
        },
      },
    },
    {
      name: "@storybook/addon-postcss",
      options: {
        postcssLoaderOptions: {
          implementation: require("postcss"),
        },
      },
    },
  ],
  framework: "@storybook/react",
  core: {
    builder: "webpack5",
  },
  webpackFinal: async (config) => {
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      ...[path.resolve(process.cwd(), "src")],
    ];

    config.module.rules.push({
      test: /\.scss$/,
      use: [
        "style-loader",
        {
          loader: "css-loader",
          options: {
            modules: {
              localIdentName: "[local]",
            },
          },
        },
        {
          loader: "postcss-loader",
          options: {
            implementation: require("postcss"),
          },
        },
        "sass-loader",
      ],
    });
    config.resolve.plugins = config.resolve.plugins || [];
    config.resolve.plugins.push(
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, "../tsconfig.json"),
      })
    );
    return config;
  },
};
