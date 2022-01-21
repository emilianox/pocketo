/* eslint-disable import/group-exports */
/* eslint-disable fp/no-mutation */

/* eslint-disable import/exports-last */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */
import React from "react";

import { type ComponentMeta } from "@storybook/react";

import Logo from "@components/Logo";

import type { ComponentStory } from "@storybook/react";

const Template: ComponentStory<typeof Logo> = (args) => <Logo {...args} />;

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  // title: "Pocketo/Logo",
  component: Logo,

  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof Logo>;

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Base.args = {};

export const WithColor = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
WithColor.args = {
  fill: "hsl(var(--p))",
};
