import type { InfiniteData, Query, QueryClient, QueryKey } from "react-query";
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

type useItemsMutationContext = {
  oldData: ResponseGetPocketApi;
  newData: ResponseGetPocketApi;
  queryKey: QueryKey;
}[];

const postActions = async (actions: DeepReadonly<Actions>) => {
  return await fetch(
    `/api/items/send?actions=${encodeURIComponent(JSON.stringify(actions))}`
  ).then(async (response) => {
    return (await response.json()) as ResponseSendPocketApi;
  });
};

const getIndexItemInPageQuery = (
  data: DeepReadonly<InfiniteData<ResponseGetPocketApi>>,
  item_id: string
): number =>
  data.pages.reduce(
    (previous, current, index) =>
      current.list[item_id] === undefined ? previous : index,
    0
  );

const updaterFn = <T extends ArticleAction>(
  oldDatawithPages: InfiniteData<ResponseGetPocketApi> | undefined,
  action: T,
  getNewResponseFn: (
    oldData: ResponseGetPocketApi,
    action: T
  ) => ResponseGetPocketApi
): InfiniteData<ResponseGetPocketApi> => {
  if (oldDatawithPages) {
    const pageIndex = getIndexItemInPageQuery(oldDatawithPages, action.item_id);
    const oldData: ResponseGetPocketApi = oldDatawithPages.pages[pageIndex];

    const itemToReplace: ResponseGetPocketApi = getNewResponseFn(
      oldData,
      action
    );

    return {
      ...oldDatawithPages,

      pages: Object.assign([], oldDatawithPages.pages, {
        [pageIndex]: itemToReplace,
      }),
    };
  }
  return {} as InfiniteData<ResponseGetPocketApi>;
};

const getResponseGetPocketApiChangeFavorite = (
  oldData: DeepReadonly<ResponseGetPocketApi>,
  action: Action_favorite | Action_unfavorite
): ResponseGetPocketApi => {
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

const getResponseGetPocketApiRemoveKey = (
  oldData: DeepReadonly<ResponseGetPocketApi>,
  action: DeepReadonly<Action_archive | Action_delete>
): ResponseGetPocketApi => ({
  ...oldData,
  list: rOmit([action.item_id], oldData.list),
});

const setQueryDataFromActions = (
  queryClient: DeepReadonly<QueryClient>,
  queryKey: QueryKey,
  action: ArticleAction
): InfiniteData<ResponseGetPocketApi> => {
  switch (action.action) {
    case "favorite":
    case "unfavorite":
      return queryClient.setQueryData(queryKey, (oldData) =>
        updaterFn(oldData, action, getResponseGetPocketApiChangeFavorite)
      );
    case "archive":
    case "delete":
      return queryClient.setQueryData(queryKey, (oldData) =>
        updaterFn(oldData, action, getResponseGetPocketApiRemoveKey)
      );

    default:
      return queryClient.getQueryData(queryKey)!;
  }
};

const getRelatedQueries = (
  queryClient: DeepReadonly<QueryClient>,
  parentKey: string
): Query<InfiniteData<ResponseGetPocketApi>>[] =>
  queryClient
    .getQueryCache()
    .getAll()
    .filter((query) => {
      return Array.isArray(query.queryKey)
        ? query.queryKey.includes(parentKey)
        : query.queryKey === parentKey;
    }) as Query<InfiniteData<ResponseGetPocketApi>>[];

const getAllItemsFromPagedQuery = (
  query: DeepReadonly<Query<InfiniteData<ResponseGetPocketApi>>>
): Record<string, PocketArticle> =>
  query.state.data!.pages.reduce(
    (current, page) => ({
      ...current,
      ...page.list,
    }),
    {}
  );

const getItemQueryKeys = (
  queryClient: DeepReadonly<QueryClient>,
  item_id: string
): QueryKey[] =>
  getRelatedQueries(queryClient, "items")
    .filter((query) => getAllItemsFromPagedQuery(query)[item_id] !== undefined)
    .map((query) => query.queryKey);

export default function useItemsSet() {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseSendPocketApi,
    unknown,
    Actions,
    useItemsMutationContext
  >(async (actions: DeepReadonly<Actions>) => await postActions(actions), {
    onMutate: async (variables) => {
      return await Promise.all(
        variables.map((action) => {
          if ("item_id" in action) {
            const queryKeys = getItemQueryKeys(queryClient, action.item_id);

            queryKeys.forEach(async (queryKey) => {
              // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
              await queryClient.cancelQueries(queryKey);

              // Snapshot the previous value
              const oldData =
                queryClient.getQueryData<ResponseGetPocketApi>(queryKey)!;
              // Optimistically update to the new value
              const newData = setQueryDataFromActions(
                queryClient,
                queryKey,
                action as ArticleAction
              );

              return {
                oldData,
                newData,
                queryKey,
              };
            });
          }

          return {
            oldData: {} as ResponseGetPocketApi,
            newData: {} as ResponseGetPocketApi,
            queryKey: "" as QueryKey,
          };
        })
      );
    },

    onError: (error, variables, context) => {
      console.error("endpoint error:", error);

      context?.forEach((aContext) => {
        queryClient.setQueryData(aContext.queryKey, aContext.oldData);
      });
    },

    onSettled: (data, error, variables, context) => {
      console.log("reload page,aContext", context);

      context?.forEach((aContext) => {
        void queryClient.invalidateQueries(aContext.queryKey);
      });
    },
  });
}
