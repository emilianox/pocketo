/* eslint-disable react/jsx-no-bind */
import React, { useState, useMemo } from "react";

import { FaInfoCircle } from "@react-icons/all-files/fa/FaInfoCircle";
import clsx from "clsx";
import { useHotkeys } from "react-hotkeys-hook";

import TagSelector from "components/TagSelector";

import type { PocketArticle } from "services/pocketApi";

import styles from "./TagModal.module.scss";

import type { Tag } from "react-tag-input";
import type { DeepReadonly } from "ts-essentials/dist/types";

const tagToListTag = (tags: DeepReadonly<Tag[]>): string[] =>
  tags.map((tag) => tag.id);

type TagModalProps = DeepReadonly<{
  selectedItem?: PocketArticle;
  suggestions: Tag[];
  onSave: (item_id: string, tags: readonly string[]) => void;
  onCancel: () => void;
}>;

function TagModal({
  selectedItem,
  suggestions,
  onSave,
  onCancel,
}: TagModalProps) {
  const [tags, setTags] = useState<Tag[]>([]);

  // eslint-disable-next-line react-perf/jsx-no-new-function-as-prop
  const onSaveModal = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    selectedItem && onSave(selectedItem.item_id, tagToListTag(tags));
  };

  useHotkeys("ctrl+enter", onSaveModal, { enableOnTags: ["INPUT"] }, [
    selectedItem,
    tags,
  ]);

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
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "modal-open": selectedItem,
      })}
    >
      <div className={clsx("modal-box", styles.modal_box)}>
        <TagSelector
          setTags={setTags}
          // clash readonly with mutable
          suggestions={suggestions as Tag[]}
          tags={tags}
        />

        <div className="flex justify-between">
          <small className="flex items-end pb-1">
            {/* eslint-disable-next-line react/forbid-component-props */}
            <FaInfoCircle className="mb-1" size="0.95em" />
            &nbsp;
            <strong>Ctrl</strong>+<strong>Enter</strong>&nbsp;to save
          </small>
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
              // eslint-disable-next-line react-perf/jsx-no-new-function-as-prop
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
    </div>
  );
}

// eslint-disable-next-line fp/no-mutation
TagModal.defaultProps = {
  selectedItem: undefined,
};

export default React.memo(TagModal);
