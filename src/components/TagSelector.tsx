/* eslint-disable react/jsx-no-bind */
/* eslint-disable fp/no-mutating-methods */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
/* eslint-disable react-perf/jsx-no-new-function-as-prop */
import type { Dispatch, SetStateAction } from "react";
import React from "react";

import { WithContext as ReactTags } from "react-tag-input";

interface tagItem {
  id: string;
  text: string;
}

const keyCodes = {
  comma: 188,
  enter: 13,
};
const delimiters = [keyCodes.comma, keyCodes.enter];

const TagSelector = ({
  tags,
  setTags,
  suggestions,
}: {
  tags: tagItem[];
  setTags: Dispatch<SetStateAction<tagItem[]>>;
  suggestions: tagItem[];
}) => {
  const handleDelete = (index_: number) => {
    setTags(tags.filter((tag, index) => index !== index_));
  };

  const handleAddition = (tag: tagItem) => {
    setTags([...tags, tag]);
  };

  const handleDrag = (tag: tagItem, currentPos: number, newPos: number) => {
    const newTags = tags.slice();

    newTags.splice(currentPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setTags(newTags);
  };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handleTagClick = (index: number) => {
    // eslint-disable-next-line no-console
    console.log(`The tag at index ${index} was clicked`);
  };

  return (
    <div className="app">
      <ReactTags
        autocomplete
        delimiters={delimiters}
        handleAddition={handleAddition}
        handleDelete={handleDelete}
        handleDrag={handleDrag}
        handleTagClick={handleTagClick}
        inputFieldPosition="top"
        suggestions={suggestions}
        tags={tags}
      />
    </div>
  );
};

export type { tagItem };

export default TagSelector;
