/* eslint-disable import/extensions */
/* eslint-disable fp/no-mutation */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/exports-last */
/* eslint-disable import/no-extraneous-dependencies */
import React from "react";

import { type ComponentMeta } from "@storybook/react";

import TagModal from "@components/TagModal";

import type { PocketArticle } from "services/pocketApi";
import "styles/TagSelector.scss";

import Items from "services/__mocks__/get.json";
import Tags from "services/__mocks__/getTags.json";
import { pocketTagsToTags } from "utils";

import type { ComponentStory } from "@storybook/react";

const Template: ComponentStory<typeof TagModal> = (args) => (
  <TagModal {...args} />
);

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  // title: "Pocketo/TagModal",
  component: TagModal,

  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    // backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof TagModal>;

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Base.args = {
  selectedItem: Object.values(Items.list)[1] as PocketArticle,
  suggestions: pocketTagsToTags(Tags.tags),
};
