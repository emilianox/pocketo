/* eslint-disable fp/no-mutation */
/* eslint-disable import/group-exports */
/* eslint-disable import/exports-last */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */
import React from "react";

import { type ComponentMeta } from "@storybook/react";

import ActionButtons from "./ActionButtons";

import type { ComponentStory } from "@storybook/react";

const Template: ComponentStory<typeof ActionButtons> = (args) => (
  <ActionButtons {...args} />
);

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  // title: "Pocketo/ActionButtons",
  component: ActionButtons,

  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    favorite: {
      control: {
        labels: {
          // 'labels' maps option values to string labels
          0: "NO",
          1: "YES",
        },
      },
    },

    status: {
      control: {
        labels: {
          // 'labels' maps option values to string labels
          0: "List",
          1: "Archived",
          2: "Should be deleted",
        },
      },
    },
    // backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof ActionButtons>;

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Base.args = {};

export const Archived = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Archived.args = {
  favorite: "0",
  status: "1",
};

export const Favorite = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Favorite.args = {
  favorite: "1",
  status: "0",
};

export const ArchivedAndFavorited = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
ArchivedAndFavorited.args = {
  favorite: "1",
  status: "1",
};
