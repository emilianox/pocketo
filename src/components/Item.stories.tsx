/* eslint-disable fp/no-mutation */

/* eslint-disable import/exports-last */

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */
import React from "react";

import { type ComponentMeta } from "@storybook/react";

import Item from "@components/Item";

import type { ComponentStory } from "@storybook/react";
import type { IContentLoaderProps } from "react-content-loader";

// eslint-disable-next-line react/jsx-props-no-spreading
const Template: ComponentStory<typeof Item> = (args) => <Item {...args} />;

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  // title: "Pocketo/Item",
  component: Item,

  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<React.FC<IContentLoaderProps>>;

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Base.args = {};
