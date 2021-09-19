/* eslint-disable max-statements */
import React, { useCallback, useState } from "react";

import ActionButtons from "components/ActionButtons";
import TagModal from "components/TagModal";

import type { PocketArticle } from "services/pocketApi";
import type { MakeMutation } from "services/useItemsMutation";

import ConfirmModal from "./ConfirmModal";

import type { Tag } from "react-tag-input";
import type { DeepReadonly } from "ts-essentials/dist/types";

interface ItemProps {
  dataItem: PocketArticle;
  mutationArchive: MakeMutation;
  mutationUnarchive: MakeMutation;
  mutationDelete: MakeMutation;
  mutationtoggleFavorite: MakeMutation;
  mutationTagReplace: (itemId: string, tags: string) => void;
  suggestionsTags: Tag[];
}

function Item({
  dataItem,
  mutationArchive,
  mutationUnarchive,
  mutationDelete,
  mutationtoggleFavorite,
  mutationTagReplace,
  suggestionsTags,
}: DeepReadonly<ItemProps>): JSX.Element {
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);

  const [selectedItem, setSelectedItem] = useState<PocketArticle>();

  const archive = useCallback(() => {
    if (dataItem.status === "0") {
      mutationArchive(dataItem);
      // eslint-disable-next-line sonarjs/elseif-without-else
    } else if (dataItem.status === "1") {
      mutationUnarchive(dataItem);
    }
  }, [dataItem, mutationArchive, mutationUnarchive]);

  const deleteItem = useCallback(() => {
    setIsConfirmDeleteModalOpen(true);
  }, []);

  const toggleFavorite = useCallback(() => {
    mutationtoggleFavorite(dataItem);
  }, [dataItem, mutationtoggleFavorite]);

  const selectItem = useCallback(() => {
    setSelectedItem(dataItem);
  }, [dataItem, setSelectedItem]);

  const onCancelModalDelete = useCallback(() => {
    setIsConfirmDeleteModalOpen(false);
  }, []);

  const onConfirmModalDelete = useCallback(() => {
    setIsConfirmDeleteModalOpen(false);
    mutationDelete(dataItem);
  }, [dataItem, mutationDelete]);

  const onSaveModal = useCallback(
    (itemId: string, tags: readonly string[]) => {
      setSelectedItem(undefined);
      mutationTagReplace(itemId, tags.join(","));
    },
    [mutationTagReplace]
  );

  const onCancelModal = useCallback(() => {
    setSelectedItem(undefined);
  }, []);

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
          onCancel={onCancelModal}
          onSave={onSaveModal}
          selectedItem={selectedItem}
          suggestions={suggestionsTags}
        />
      )}
      {/* Wrapper */}
      <div className="flex p-2 m-auto w-8/12 hover:bg-black hover:bg-opacity-10 border-b-2 border-gray-800">
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
                archive={archive}
                cacheUrl={`https://getpocket.com/read/${dataItem.item_id}`}
                deleteItem={deleteItem}
                favorite={dataItem.favorite}
                selectItem={selectItem}
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
