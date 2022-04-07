import { useHotkeys } from "react-hotkeys-hook";

import type { PocketArticle } from "@services/pocketApi";
import type { DeepReadonly } from "ts-essentials/dist/types";

interface UseItemContainerProps {
  archiveItem: () => void;
  toggleFavorite: () => void;
  deleteItem: () => void;
  copyLinkItem: () => void;
  isItemHover: boolean;
  setIsItemHover: (isItemHover: boolean) => void;
  changeTagsItem: () => void;
  dataItem: PocketArticle;
}

export default function useHotKeysApp({
  archiveItem,
  toggleFavorite,
  deleteItem,
  copyLinkItem,
  isItemHover,
  setIsItemHover,
  changeTagsItem,
  dataItem,
}: DeepReadonly<UseItemContainerProps>): void {
  // useHotkeys lib uses enabled key
  // eslint-disable-next-line @typescript-eslint/naming-convention
  useHotkeys("a", archiveItem, { enabled: isItemHover }, [
    dataItem,
    isItemHover,
  ]);

  // useHotkeys lib uses enabled key
  // eslint-disable-next-line @typescript-eslint/naming-convention
  useHotkeys("f", toggleFavorite, { enabled: isItemHover }, [
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
      // useHotkeys lib uses enabled key
      // eslint-disable-next-line @typescript-eslint/naming-convention
      enabled: isItemHover,
    },
    [dataItem, isItemHover]
  );

  // useHotkeys lib uses enabled key
  // eslint-disable-next-line @typescript-eslint/naming-convention
  useHotkeys("l", copyLinkItem, { enabled: isItemHover }, [
    dataItem.resolved_url,
    isItemHover,
  ]);

  useHotkeys(
    "c",
    () => {
      window.open(`https://getpocket.com/read/${dataItem.item_id}`, "_blank");
    },
    // useHotkeys lib uses enabled key
    // eslint-disable-next-line @typescript-eslint/naming-convention
    { enabled: isItemHover },
    [dataItem, isItemHover]
  );

  // useHotkeys lib uses enabled key
  // eslint-disable-next-line @typescript-eslint/naming-convention
  useHotkeys("r", deleteItem, { enabled: isItemHover }, [
    dataItem,
    isItemHover,
  ]);
}
