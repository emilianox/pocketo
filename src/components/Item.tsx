import React, { useCallback, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import ActionButtons from "components/ActionButtons";

import type { PocketArticle } from "services/useItemsGet";
import type { MakeMutation } from "services/useItemsMutation";

import ConfirmModal from "./ConfirmModal";

import type { DeepReadonly } from "ts-essentials/dist/types";

interface ItemProps {
  dataItem: PocketArticle;
  mutationArchive: MakeMutation;
  mutationUnarchive: MakeMutation;
  mutationDelete: MakeMutation;
  mutationtoggleFavorite: MakeMutation;
  setselectedItem: Dispatch<SetStateAction<PocketArticle | undefined>>;
}

function Item({
  dataItem,
  mutationArchive,
  mutationUnarchive,
  mutationDelete,
  mutationtoggleFavorite,
  setselectedItem,
}: DeepReadonly<ItemProps>): JSX.Element {
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);

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
    setselectedItem(dataItem);
  }, [dataItem, setselectedItem]);

  const onCancelModalDelete = useCallback(() => {
    setIsConfirmDeleteModalOpen(false);
  }, []);

  const onConfirmModalDelete = useCallback(() => {
    setIsConfirmDeleteModalOpen(false);
    mutationDelete(dataItem);
  }, [dataItem, mutationDelete]);

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
      <div className="flex py-3 m-auto w-8/12 border-b-2">
        <div className="mr-4 w-1/12 avatar">
          <div className="w-24 h-24">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="post"
              height="96"
              src={dataItem.top_image_url}
              width="96"
            />
          </div>
        </div>
        <div className="w-11/12">
          <h2
            className="overflow-hidden mb-1 font-bold overflow-ellipsis whitespace-nowrap"
            title={dataItem.resolved_title}
          >
            {dataItem.resolved_title}
          </h2>
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
          <p className="mt-2">{dataItem.excerpt}</p>

          <div className="mt-4">
            <div className="flex justify-between">
              {/* eslint-disable-next-line @shopify/jsx-prefer-fragment-wrappers */}
              <div>
                {dataItem.tags &&
                  Object.values(dataItem.tags).map((tag) => (
                    <span className="mr-2 badge badge-lg" key={tag.tag}>
                      {tag.tag}
                    </span>
                  ))}
              </div>
              <ActionButtons
                archive={archive}
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
