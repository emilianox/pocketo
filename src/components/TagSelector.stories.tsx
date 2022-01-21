/* eslint-disable import/extensions */
/* eslint-disable import/group-exports */
/* eslint-disable fp/no-mutation */

/* eslint-disable import/exports-last */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */
import React from "react";

import { type ComponentMeta } from "@storybook/react";

import TagSelector from "@components/TagSelector";

import Tags from "services/__mocks__/getTags.json";
import { pocketTagsToTags } from "utils";

import type { ComponentStory } from "@storybook/react";

const Template: ComponentStory<typeof TagSelector> = (args) => (
  <TagSelector {...args} />
);

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  // title: "Pocketo/TagSelector",
  component: TagSelector,

  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof TagSelector>;

export const Base = Template.bind({});
const allTags = pocketTagsToTags(Tags.tags);
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Base.args = {
  suggestions: allTags,
};

export const WithTags = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
WithTags.args = {
  suggestions: allTags,
  tags: [allTags[0], allTags[1]],
};
