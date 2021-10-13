/* eslint-disable @typescript-eslint/naming-convention */
import React from "react";

import copy from "copy-text-to-clipboard";
import { useHotkeys } from "react-hotkeys-hook";

import ActionButtons from "components/ActionButtons";
import TagModal from "components/TagModal";

import useNotify from "hooks/useNotify";

import type { PocketArticle } from "services/pocketApi";

import useItemContainer from "hooks/containers/useItemContainer";

import ConfirmModal from "./ConfirmModal";

import type { Tag } from "react-tag-input";
import type { DeepReadonly } from "ts-essentials/dist/types";

interface ItemProps {
  dataItem: PocketArticle;
  suggestionsTags: Tag[];
}

function Item({
  dataItem,
  suggestionsTags,
}: DeepReadonly<ItemProps>): JSX.Element {
  const {
    isConfirmDeleteModalOpen,
    selectedItem,
    archiveItem,
    deleteItem,
    toggleFavorite,
    changeTagsItem,
    onConfirmModalDelete,
    onCancelModalDelete,
    onSaveModalTag,
    onCancelModalTag,
    isItemHover,
    setIsItemHover,
  } = useItemContainer({ dataItem });

  const { onStartNotify } = useNotify("link copied", {
    variant: "success",
  });

  const copyLinkItem = React.useCallback(() => {
    copy(dataItem.resolved_url);
    onStartNotify();
  }, [dataItem.resolved_url, onStartNotify]);

  useHotkeys("a", archiveItem, { enabled: isItemHover }, [
    dataItem,
    isItemHover,
  ]);

  useHotkeys("s", toggleFavorite, { enabled: isItemHover }, [
    dataItem,
    isItemHover,
  ]);

  useHotkeys(
    "t",
    (event) => {
      event.preventDefault();
      changeTagsItem();
      setIsItemHover(true);
    },
    {
      enabled: isItemHover,
    },
    [dataItem, isItemHover]
  );

  useHotkeys("l", copyLinkItem, { enabled: isItemHover }, [
    dataItem.resolved_url,
    isItemHover,
  ]);

  useHotkeys(
    "c",
    () => {
      window.open(`https://getpocket.com/read/${dataItem.item_id}`, "_blank");
    },
    { enabled: isItemHover },
    [dataItem, isItemHover]
  );

  useHotkeys("r", deleteItem, { enabled: isItemHover }, [
    dataItem,
    isItemHover,
  ]);

  return (
    <>
      {isConfirmDeleteModalOpen && (
        <ConfirmModal
          cta="Are you sure you want to delete this item? This cannot be undone."
          isOpen
          onCancel={onCancelModalDelete}
          onConfirm={onConfirmModalDelete}
        />
      )}
      {selectedItem && (
        <TagModal
          onCancel={onCancelModalTag}
          onSave={onSaveModalTag}
          selectedItem={selectedItem}
          suggestions={suggestionsTags}
        />
      )}
      {/* Wrapper */}
      <div
        className="flex p-2 m-auto w-8/12 hover:bg-black hover:bg-opacity-10 border-b-2 border-gray-800"
        // eslint-disable-next-line react/jsx-no-bind, react-perf/jsx-no-new-function-as-prop
        onMouseEnter={() => {
          setIsItemHover(true);
        }}
        // eslint-disable-next-line react/jsx-no-bind, react-perf/jsx-no-new-function-as-prop
        onMouseLeave={() => {
          setIsItemHover(false);
        }}
      >
        {/* Image */}
        <div className="mr-4 w-1/12 avatar">
          <div className="w-24 h-24">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="post"
              className="w-24 h-24"
              height="96"
              src={
                dataItem.top_image_url ??
                "https://via.placeholder.com/96x96.webp/2a2e37/ebecf0?text=No%20Image"
              }
              width="96"
            />
          </div>
        </div>
        {/* Data */}
        <div className="w-11/12">
          {/* Title */}
          <div className="flex justify-between">
            <a
              href={dataItem.resolved_url}
              rel="noreferrer"
              target="_blank"
              title={dataItem.resolved_url}
            >
              <h2
                className="overflow-hidden mb-1 font-bold overflow-ellipsis whitespace-nowrap"
                title={dataItem.resolved_title}
              >
                {dataItem.resolved_title}
              </h2>
            </a>
            <div className="space-x-1">
              {dataItem.favorite === "1" && (
                <div className="badge badge-accent badge-outline">starred</div>
              )}
              {dataItem.status === "1" && (
                <div className="badge badge-secondary badge-outline">
                  archived
                </div>
              )}
            </div>
          </div>
          {/* Link */}
          <div className="overflow-hidden text-sm overflow-ellipsis whitespace-nowrap opacity-50">
            <a
              href={dataItem.resolved_url}
              rel="noreferrer"
              target="_blank"
              title={dataItem.resolved_url}
            >
              {dataItem.resolved_url}
            </a>
          </div>
          {/* Excerpt */}
          <p className="mt-2">{dataItem.excerpt}</p>
          {/* Tags and Buttons */}
          <div className="mt-4">
            <div className="flex justify-between">
              {/* Tags */}
              {/* eslint-disable-next-line max-len */}
              {/* eslint-disable-next-line @shopify/jsx-prefer-fragment-wrappers */}
              <div>
                {dataItem.tags &&
                  Object.values(dataItem.tags).map((tag) => (
                    <span className="mr-2 shadow badge badge-lg" key={tag.tag}>
                      {tag.tag}
                    </span>
                  ))}
              </div>
              {/* Buttons */}
              <ActionButtons
                archive={archiveItem}
                cacheUrl={`https://getpocket.com/read/${dataItem.item_id}`}
                changeTagsItem={changeTagsItem}
                copyLinkItem={copyLinkItem}
                deleteItem={deleteItem}
                favorite={dataItem.favorite}
                status={dataItem.status}
                toggleFavorite={toggleFavorite}
                url={dataItem.resolved_url}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(Item);
