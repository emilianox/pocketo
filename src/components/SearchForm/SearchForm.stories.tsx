/* eslint-disable import/extensions */
/* eslint-disable import/group-exports */
/* eslint-disable fp/no-mutation */

/* eslint-disable import/exports-last */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */
import React from "react";

import { type ComponentMeta } from "@storybook/react";

import SearchForm from "@components/SearchForm";
import "styles/react-mention.scss";

import type { SearchParameters } from "services/pocketApi";

import Tags from "services/__mocks__/getTags.json";
import { pocketTagsToTags } from "utils";

import type { ComponentStory } from "@storybook/react";

const Template: ComponentStory<typeof SearchForm> = (args) => (
  <SearchForm {...args} />
);

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  // title: "Pocketo/SearchForm",
  component: SearchForm,

  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  // argTypes: {},
} as ComponentMeta<typeof SearchForm>;

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Base.args = {
  searchParameters: {} as SearchParameters,
  suggestions: pocketTagsToTags(Tags.tags),
  totalResults: 0,
};

export const WithColor = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
WithColor.args = {};
