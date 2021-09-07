/* eslint-disable max-statements */
/* eslint-disable react-perf/jsx-no-new-function-as-prop */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable camelcase */
import clsx from "clsx";
import type { DeepReadonly } from "ts-essentials/dist/types";
import { useState, useMemo } from "react";

import type { tagItem } from "components/TagSelector";
import TagSelector from "components/TagSelector";
import type { PocketArticle } from "services/useItemsGet";
import useTagGet from "services/useTagGet";

const tagToListTag = (tags: DeepReadonly<tagItem[]>): string[] =>
  tags.map((tag) => tag.id);

function TagModal({
  selectedItem,
  onSave,
  onCancel,
}: DeepReadonly<{
  selectedItem?: PocketArticle;
  onSave: (item_id: string, tags: readonly string[]) => void;
  onCancel: () => void;
}>) {
  const [tags, setTags] = useState<tagItem[]>([]);

  useMemo(() => {
    setTags(
      Object.keys(selectedItem?.tags ?? {}).map((tagkey) => ({
        id: tagkey,
        text: tagkey,
      }))
    );
  }, [selectedItem]);

  const { status, data: allTags, error } = useTagGet();

  if (status === "loading") {
    return <div>Loading Modal...</div>;
  }

  if (error) {
    return <div>Error...</div>;
  }

  if (!selectedItem) {
    return <div />;
  }

  const suggestions =
    allTags?.tags.map((tag) => ({ id: tag, text: tag })) ?? [];

  return (
    <div
      className={clsx("modal", {
        "modal-open": selectedItem,
      })}
    >
      <div className="modal-box">
        <TagSelector setTags={setTags} suggestions={suggestions} tags={tags} />

        <div className="modal-action">
          <button
            className="btn btn-primary"
            onClick={() => {
              onSave(selectedItem.item_id, tagToListTag(tags));
            }}
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

export default TagModal;
