// .storybook/preview.js

import "!style-loader!css-loader!postcss-loader!tailwindcss/tailwind.css";
import * as NextImage from "next/image";

const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, "default", {
  configurable: true,
  value: (props) => <OriginalNextImage {...props} unoptimized />,
});

import { addDecorator } from "@storybook/react";
import { withPerformance } from "storybook-addon-performance";

addDecorator(withPerformance);

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  previewTabs: {
    "storybook/docs/panel": { index: -1 },
  },
};
