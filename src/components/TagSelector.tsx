import React, { type Dispatch, type SetStateAction } from "react";

import { move } from "ramda";
import { WithContext as ReactTags, type Tag } from "react-tag-input";

import type { DeepReadonly } from "ts-essentials/dist/types";

const keyCodes = {
  comma: 188,
  enter: 13,
};
const delimiters = [keyCodes.comma, keyCodes.enter];
// ReactTags not support readonly tags
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
function TagSelector({
  tags,
  setTags,
  suggestions,
}: {
  tags: Tag[];
  setTags: Dispatch<SetStateAction<Tag[]>>;
  suggestions: Tag[];
}) {
  const handleDelete = React.useCallback(
    (indexToDelete: number) => {
      setTags(tags.filter((tag, index) => index !== indexToDelete));
    },
    [setTags, tags]
  );

  const handleAddition = React.useCallback(
    (tag: DeepReadonly<Tag>) => {
      setTags([...tags, tag]);
    },
    [setTags, tags]
  );

  const handleDrag = React.useCallback(
    (tag: DeepReadonly<Tag>, currentPos: number, newPos: number) => {
      setTags(move(currentPos, newPos, tags));
    },
    [tags, setTags]
  );

  const handleTagClick = React.useCallback((index: number) => {
    // eslint-disable-next-line no-console
    console.log(`The tag at index ${index} was clicked`);
  }, []);

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
}

export default TagSelector;
