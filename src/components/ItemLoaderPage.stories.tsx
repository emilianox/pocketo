/* eslint-disable fp/no-mutation */

/* eslint-disable import/exports-last */

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */
import React from "react";

import { type ComponentMeta } from "@storybook/react";

import ItemLoaderPage from "@components/ItemLoaderPage";

import type { ComponentStory } from "@storybook/react";
import type { IContentLoaderProps } from "react-content-loader";

const Template: ComponentStory<typeof ItemLoaderPage> = () => (
  <ItemLoaderPage />
);

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  // title: "Pocketo/ItemLoaderPage",
  component: ItemLoaderPage,

  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<React.FC<IContentLoaderProps>>;

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Base.args = {};
