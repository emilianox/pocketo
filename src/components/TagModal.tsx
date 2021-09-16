/* eslint-disable react-perf/jsx-no-new-function-as-prop */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable camelcase */
import React, { useState, useMemo } from "react";

import clsx from "clsx";
import { useShortcuts } from "react-shortcuts-hook";

import TagSelector from "components/TagSelector";

import type { PocketArticle } from "services/pocketApi";

import type { Tag } from "react-tag-input";
import type { DeepReadonly } from "ts-essentials/dist/types";

const tagToListTag = (tags: DeepReadonly<Tag[]>): string[] =>
  tags.map((tag) => tag.id);

type TagModalProps = DeepReadonly<{
  selectedItem?: PocketArticle;
  onSave: (item_id: string, tags: readonly string[]) => void;
  onCancel: () => void;
  suggestions: Tag[];
}>;

function TagModal({
  selectedItem,
  onSave,
  onCancel,
  suggestions,
}: TagModalProps) {
  const [tags, setTags] = useState<Tag[]>([]);

  const onSaveModal = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    selectedItem && onSave(selectedItem.item_id, tagToListTag(tags));
  };

  useShortcuts(["Control", "Enter"], onSaveModal, [selectedItem, tags]);

  useMemo(() => {
    setTags(
      Object.keys(selectedItem?.tags ?? {}).map((tagkey) => ({
        id: tagkey,
        text: tagkey,
      }))
    );
  }, [selectedItem]);

  if (!selectedItem) {
    return <div />;
  }

  return (
    <div
      className={clsx("modal", {
        "modal-open": selectedItem,
      })}
    >
      <div className="modal-box">
        <TagSelector
          setTags={setTags}
          // clash readonly with mutable
          suggestions={suggestions as Tag[]}
          tags={tags}
        />

        <div className="modal-action">
          <button
            className="btn btn-primary"
            onClick={onSaveModal}
            type="button"
          >
            Save
          </button>
          <button
            className="btn"
            onClick={() => {
              onCancel();
            }}
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line fp/no-mutation
TagModal.defaultProps = {
  selectedItem: undefined,
};

export default React.memo(TagModal);
