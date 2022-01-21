/* eslint-disable fp/no-mutation */

/* eslint-disable import/exports-last */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */
import React from "react";

import { type ComponentMeta } from "@storybook/react";

import ItemLoader from "@components/ItemLoader";

import type { ComponentStory } from "@storybook/react";
import type { IContentLoaderProps } from "react-content-loader";

const Template: ComponentStory<typeof ItemLoader> = (args) => (
  <ItemLoader {...args} />
);

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  // title: "Pocketo/ItemLoader",
  component: ItemLoader,

  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<React.FC<IContentLoaderProps>>;

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Base.args = {};
