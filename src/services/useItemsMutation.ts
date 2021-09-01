/* eslint-disable no-warning-comments */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import type { Query, QueryClient, QueryKey } from "react-query";
import { useMutation, useQueryClient } from "react-query";
import type { DeepReadonly } from "ts-essentials/dist/types";
import { omit as rOmit } from "ramda";

import type {
  ArticleAction,
  Action_favorite,
  Action_unfavorite,
  Actions,
  Action_archive,
  Action_delete,
} from "./sendActions";
import type { PocketArticle, ResponseGetPocketApi } from "./useItemsGet";

interface ResponseSendPocketApi {
  action_results: boolean[];
  status: number;
}

const setPocketArticles = async (actions: DeepReadonly<Actions>) => {
  return await fetch(
    `/api/items/send?actions=${encodeURIComponent(JSON.stringify(actions))}`
  ).then(async (response) => {
    return (await response.json()) as ResponseSendPocketApi;
  });
};

const favoriteNewData = (
  oldData: DeepReadonly<ResponseGetPocketApi>,
  action: Action_favorite | Action_unfavorite
) => {
  const newItemEdited: PocketArticle = {
    ...oldData.list[action.item_id],
    favorite: action.action === "favorite" ? "1" : "0",
  };

  return {
    ...oldData,

    list: {
      ...oldData.list,
      [action.item_id]: newItemEdited,
    },
  };
};

const removekeyNewData = (
  oldData: DeepReadonly<ResponseGetPocketApi>,
  action: DeepReadonly<Action_archive | Action_delete>
) => {
  return {
    ...oldData,
    // ES9 operator not supported and delete is forbidden by fp
    list: rOmit([action.item_id], oldData.list),
  };
};

const setPocketArticlesCache = (
  queryClient: DeepReadonly<QueryClient>,
  queryKey: QueryKey,
  action: ArticleAction
) => {
  switch (action.action) {
    case "favorite":
    case "unfavorite":
      return queryClient.setQueryData<ResponseGetPocketApi>(
        queryKey,
        (oldData) =>
          oldData
            ? favoriteNewData(oldData, action)
            : ({} as ResponseGetPocketApi)
      );
    case "archive":
    case "delete":
      return queryClient.setQueryData<ResponseGetPocketApi>(
        queryKey,
        (oldData) =>
          oldData
            ? removekeyNewData(oldData, action)
            : ({} as ResponseGetPocketApi)
      );

    default:
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return queryClient.getQueryData<ResponseGetPocketApi>(queryKey)!;
  }
};

const getRelatedCacheData = (
  queryClient: DeepReadonly<QueryClient>,
  parentKey: string
): Query<ResponseGetPocketApi>[] =>
  queryClient
    .getQueryCache()
    .getAll()
    .filter((query) => {
      return Array.isArray(query.queryKey)
        ? query.queryKey.includes(parentKey)
        : query.queryKey === parentKey;
    }) as Query<ResponseGetPocketApi>[];

const getArticleQueryKey = (
  queryClient: DeepReadonly<QueryClient>,
  item_id: string
) => {
  const relatedCacheData = getRelatedCacheData(queryClient, "pocketArticles");

  return relatedCacheData.reduce<QueryKey>(
    (previous, current) =>
      previous === "" && current.state.data?.list[item_id]
        ? current.queryKey
        : previous,
    ""
  );
};

export default function useItemsSet() {
  const queryClient = useQueryClient();

  type useItemsMutationContext = {
    oldData: ResponseGetPocketApi;
    newData: ResponseGetPocketApi;
    queryKey: QueryKey;
  }[];

  return useMutation<
    ResponseSendPocketApi,
    unknown,
    Actions,
    useItemsMutationContext
  >(
    async (actions: DeepReadonly<Actions>) => await setPocketArticles(actions),
    {
      onMutate: async (variables) => {
        return await Promise.all(
          variables.map(async (action) => {
            if ("item_id" in action) {
              const queryKey = getArticleQueryKey(queryClient, action.item_id);

              // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
              await queryClient.cancelQueries(queryKey);

              // Snapshot the previous value
              const oldData =
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                queryClient.getQueryData<ResponseGetPocketApi>(queryKey)!;

              // Optimistically update to the new value
              const newData = setPocketArticlesCache(
                queryClient,
                queryKey,
                action as ArticleAction
              );

              return {
                oldData,
                newData,
                queryKey,
              };
            }

            // TODO: support tags
            return {
              oldData: {} as ResponseGetPocketApi,
              newData: {} as ResponseGetPocketApi,
              queryKey: "" as QueryKey,
            };
          })
        );
      },

      onError: (error, variables, context) => {
        // eslint-disable-next-line no-console
        console.error("endpoint error:", error);

        context?.forEach((aContext) => {
          queryClient.setQueryData(aContext.queryKey, aContext.oldData);
        });
      },

      // eslint-disable-next-line max-params
      onSettled: (data, error, variables, context) => {
        // eslint-disable-next-line no-console
        console.log("reload page");

        context?.forEach((aContext) => {
          void queryClient.invalidateQueries(aContext.queryKey);
        });
      },
    }
  );
}
