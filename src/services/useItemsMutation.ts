/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
// export type {  };
import { useMutation } from "react-query";
import type { DeepReadonly } from "ts-essentials/dist/types";

import type { PocketArticle } from "./useItemsGet";

interface Action {
  action: string;
  item_id: string;
}

type Actions = Action[];

const setPocketArticles = async (actions: DeepReadonly<Actions>) => {
  return await fetch(
    `/api/items/send?actions=${encodeURIComponent(JSON.stringify(actions))}`
  ).then(async (response) => {
    return (await response.json()) as unknown;
  });
};

export function toggleFavoriteAction(
  item: DeepReadonly<PocketArticle>
): Action {
  return {
    action: item.favorite === "0" ? "favorite" : "unfavorite",
    item_id: item.item_id,
  };
}

export default function useItemsSet() {
  return useMutation(
    async (actions: DeepReadonly<Actions>) => await setPocketArticles(actions)
  );
}
