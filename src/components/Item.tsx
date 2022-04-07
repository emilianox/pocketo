import React, { useCallback } from "react";

import copy from "copy-text-to-clipboard";
// ESLINT error?
// eslint-disable-next-line @typescript-eslint/no-shadow
import Image from "next/image";

import ActionButtons from "components/ActionButtons";

import TagModal from "@components/TagModal";

import useHotKeysApp from "hooks/useHotKeysApp";
import useNotify from "hooks/useNotify";

import type { PocketArticle } from "services/pocketApi";
import type { MakeMutation } from "services/useItemsMutation";

import useItemContainer from "hooks/containers/useItemContainer";

import ConfirmModal from "./ConfirmModal";

import type { Tag } from "react-tag-input";
import type { DeepReadonly } from "ts-essentials/dist/types";

interface ItemProps {
  dataItem: PocketArticle;
  suggestionsTags: Tag[];
  mutationArchive: MakeMutation;
  mutationUnarchive: MakeMutation;
  mutationtoggleFavorite: MakeMutation;
  mutationDelete: MakeMutation;
  mutationTagReplace: (itemId: string, tags: string) => void;
}

function Item({
  dataItem,
  suggestionsTags,
  mutationArchive,
  mutationUnarchive,
  mutationtoggleFavorite,
  mutationDelete,
  mutationTagReplace,
}: DeepReadonly<ItemProps>): JSX.Element {
  const {
    isConfirmDeleteModalOpen,
    selectedItem,
    isItemHover,
    archiveItem,
    deleteItem,
    toggleFavorite,
    changeTagsItem,
    onConfirmModalDelete,
    onCancelModalDelete,
    onSaveModalTag,
    onCancelModalTag,
    setIsItemHover,
  } = useItemContainer({
    dataItem,
    mutationArchive,
    mutationUnarchive,
    mutationtoggleFavorite,
    mutationDelete,
    mutationTagReplace,
  });

  const { onStartNotify } = useNotify("link copied", {
    variant: "success",
  });

  const copyLinkItem = useCallback(() => {
    copy(dataItem.resolved_url);
    onStartNotify();
  }, [dataItem.resolved_url, onStartNotify]);

  const itemHoverTrue = useCallback(() => {
    setIsItemHover(true);
  }, [setIsItemHover]);

  const itemHoverFalse = useCallback(() => {
    setIsItemHover(false);
  }, [setIsItemHover]);

  useHotKeysApp({
    archiveItem,
    toggleFavorite,
    deleteItem,
    copyLinkItem,
    isItemHover,
    setIsItemHover,
    changeTagsItem,
    dataItem,
  });

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
        className="flex p-2 m-auto w-8/12 border-b-2 border-gray-800 hover:bg-neutral hover:bg-opacity/10"
        onMouseEnter={itemHoverTrue}
        onMouseLeave={itemHoverFalse}
      >
        {/* Image */}
        <div className="mr-4 w-1/12 avatar">
          <div className="w-24 h-24">
            {dataItem.top_image_url !== undefined && (
              // img is external - no need to use next Image
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt="post"
                className="w-24 h-24"
                height="96"
                src={dataItem.top_image_url}
                width="96"
              />
            )}

            {dataItem.top_image_url === undefined && (
              <Image
                alt="No Image"
                height={96}
                src="/noImage.webp"
                width={96}
              />
            )}
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
                className="overflow-hidden mb-1 font-bold text-ellipsis whitespace-nowrap"
                title={dataItem.resolved_title}
              >
                {dataItem.resolved_title}
              </h2>
            </a>
            <div className="space-x-1">
              {dataItem.favorite === "1" && (
                <div className="badge badge-accent badge-outline">favorite</div>
              )}
              {dataItem.status === "1" && (
                <div className="badge badge-secondary badge-outline">
                  archived
                </div>
              )}
            </div>
          </div>
          {/* Link */}
          <div className="overflow-hidden text-sm text-ellipsis whitespace-nowrap opacity-50">
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
              <div id="tags">
                {dataItem.tags &&
                  Object.values(dataItem.tags).map((tag) => (
                    <span className="mr-2 shadow badge badge-lg" key={tag.tag}>
                      {tag.tag}
                    </span>
                  ))}
              </div>
              {/* Buttons */}
              <ActionButtons
                cacheUrl={`https://getpocket.com/read/${dataItem.item_id}`}
                favorite={dataItem.favorite}
                onArchive={archiveItem}
                onChangeTagsItem={changeTagsItem}
                onCopyLinkItem={copyLinkItem}
                onDeleteItem={deleteItem}
                onToggleFavorite={toggleFavorite}
                status={dataItem.status}
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
