/* eslint-disable max-statements */
import { useCallback, useState } from "react";

import type { PocketArticle } from "services/pocketApi";
import useItemsMutation from "services/useItemsMutation";

import type { DeepReadonly } from "ts-essentials/dist/types";

interface UseItemContainerProps {
  dataItem: PocketArticle;
}

const useItemContainer = ({
  dataItem,
}: DeepReadonly<UseItemContainerProps>) => {
  const {
    mutationArchive,
    mutationUnarchive,
    mutationtoggleFavorite,
    mutationDelete,
    mutationTagReplace,
  } = useItemsMutation();

  const [isItemHover, setIsItemHover] = useState(false);

  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);

  const [selectedItem, setSelectedItem] = useState<PocketArticle>();

  const archiveItem = useCallback(() => {
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

  const changeTagsItem = useCallback(() => {
    setSelectedItem(dataItem);
  }, [dataItem, setSelectedItem]);

  const onCancelModalDelete = useCallback(() => {
    setIsConfirmDeleteModalOpen(false);
  }, []);

  const onConfirmModalDelete = useCallback(() => {
    setIsConfirmDeleteModalOpen(false);
    mutationDelete(dataItem);
  }, [dataItem, mutationDelete]);

  const onSaveModalTag = useCallback(
    (itemId: string, tags: readonly string[]) => {
      setSelectedItem(undefined);
      setIsItemHover(true);
      mutationTagReplace(itemId, tags.join(","));
    },
    [mutationTagReplace]
  );

  const onCancelModalTag = useCallback(() => {
    setSelectedItem(undefined);
    setIsItemHover(true);
  }, []);

  return {
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
  };
};

export default useItemContainer;
