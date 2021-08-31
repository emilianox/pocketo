/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
// export type {  };
import {
  Query,
  QueryClient,
  QueryKey,
  useMutation,
  useQueryClient,
} from "react-query";
import type { DeepReadonly } from "ts-essentials/dist/types";

import type { PocketArticle, ResponseGetPocketApi } from "./useItemsGet";

interface ActionBase {
  item_id: string;
  /** The time the action occurred. */
  time?: string;
}

interface Action_add extends ActionBase {
  action: "add";
  /** A Twitter status id; this is used to show tweet attribution. */
  ref_id?: number;
  /** A comma-delimited list of one or more tags. */
  tags?: string;
  /** The title of the item. */
  title?: string;
  /** The url of the item; provide this only if you do not have an item_id. */
  url?: string;
}

interface Action_archive extends ActionBase {
  action: "archive";
}

interface Action_readd extends ActionBase {
  action: "readd";
}

interface Action_favorite extends ActionBase {
  action: "favorite";
}

interface Action_unfavorite extends ActionBase {
  action: "unfavorite";
}

interface Action_delete extends ActionBase {
  action: "delete";
}

interface Action_tags_add extends ActionBase {
  action: "tags_add";
  /** A comma-delimited list of one or more tags to add. */
  tags: string;
}

interface Action_tags_remove extends ActionBase {
  action: "tags_remove";
  /** A comma-delimited list of one or more tags to add. */
  tags: string;
}

interface Action_tags_replace extends ActionBase {
  action: "tags_replace";
  /** A comma-delimited list of one or more tags to add. */
  tags: string;
}

interface Action_tags_clear extends ActionBase {
  action: "tags_clear";
}

interface Action_tag_rename {
  action: "tag_rename";
  /** The tag name that will be replaced. */
  old_tag: string;
  /** The new tag name that will be added. */
  new_tag: string;
}

interface Action_tag_delete {
  action: "tag_delete";
  /** The tag name that will be deleted. */
  tag: string;
}

type Action =
  | Action_add
  | Action_archive
  | Action_delete
  | Action_favorite
  | Action_readd
  | Action_tag_delete
  | Action_tag_rename
  | Action_tags_add
  | Action_tags_clear
  | Action_tags_remove
  | Action_tags_replace
  | Action_unfavorite;

type Actions = Action[];

// result {"action_results":[true],"status":1}
const setPocketArticles = async (actions: DeepReadonly<Actions>) => {
  return await fetch(
    `/api/items/send?actions=${encodeURIComponent(JSON.stringify(actions))}`
  ).then(async (response) => {
    return (await response.json()) as unknown;
  });
};

const setPocketArticlesCache = (
  queryClient: QueryClient,
  queryKey: QueryKey,
  action: Action
) => {
  if (
    // action.action !== "tag_delete" &&
    // action.action !== "tag_rename"
    action.action == "favorite" ||
    action.action === "unfavorite"
  ) {
    return queryClient.setQueryData<ResponseGetPocketApi>(
      queryKey,
      (oldData) => {
        if (oldData) {
          const newItemEdited: PocketArticle = {
            ...oldData.list[action.item_id],
            favorite: action.action === "favorite" ? "1" : "0",
          };

          return {
            ...oldData,
            list: { ...oldData.list, [action.item_id]: newItemEdited },
          };
        }

        return {} as ResponseGetPocketApi;
      }
    );
  }
  return queryClient.getQueryData<ResponseGetPocketApi>(
    queryKey
  ) as ResponseGetPocketApi;
};

const getRelatedCacheData = (
  queryClient: QueryClient,
  parentKey: string
): Query<ResponseGetPocketApi>[] =>
  queryClient
    .getQueryCache()
    .getAll()
    .filter((query) => {
      return Array.isArray(query.queryKey)
        ? query.queryKey.includes(parentKey)
        : query.queryKey === parentKey;
    })
    .map((query) => query as Query<ResponseGetPocketApi>);

const filterQueryKey = (
  queries: Query<ResponseGetPocketApi>[],
  item_id: string
) =>
  queries.reduce<QueryKey>(
    (prev, curr) =>
      prev === "" && curr.state.data?.list[item_id] ? curr.queryKey : prev,
    ""
  );

const getQueryKey = (queryClient: QueryClient, item_id: string) =>
  filterQueryKey(getRelatedCacheData(queryClient, "pocketArticles"), item_id);

export const toggleFavoriteAction = (
  favorite: PocketArticle["favorite"],
  item_id: PocketArticle["item_id"]
): Action_favorite | Action_unfavorite => ({
  action: favorite === "0" ? "favorite" : "unfavorite",
  item_id,
});

export default function useItemsSet() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    unknown,
    Actions,
    {
      oldData: ResponseGetPocketApi;
      newData: ResponseGetPocketApi;
      queryKey: QueryKey;
    }[]
  >(
    async (actions: DeepReadonly<Actions>) => await setPocketArticles(actions),
    {
      onMutate: async (variables) => {
        return variables.map((action) => {
          const queryKey = getQueryKey(
            queryClient,
            (action as Action_favorite).item_id
          );

          // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
          queryClient.cancelQueries(queryKey);

          // Snapshot the previous value
          const oldData = queryClient.getQueryData<ResponseGetPocketApi>(
            queryKey
          ) as ResponseGetPocketApi;

          // Optimistically update to the new value
          // queryClient.setQueryData(queryKey, newTodo);
          const newData = setPocketArticlesCache(queryClient, queryKey, action);

          // Return a context with the previous and new data
          return { oldData: oldData, newData: newData, queryKey };
        });
      },

      onError: (err, variables, context) => {
        console.error("endpoint error:", err);
        context &&
          context.forEach((aContext) =>
            queryClient.setQueryData(aContext.queryKey, aContext.oldData)
          );
      },

      onSettled: (data, err, variables, context) => {
        console.log("reload page");
        context &&
          context.forEach((aContext) =>
            queryClient.invalidateQueries(aContext.queryKey)
          );
      },
    }
  );
}
