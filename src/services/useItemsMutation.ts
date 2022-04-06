/* eslint-disable max-lines */
// eslint-disable-next-line putout/putout
import { useCallback } from "react";

import { omit as rOmit } from "ramda";
import { useMutation, useQueryClient } from "react-query";

import useNotify from "hooks/useNotify";

import type {
  ActionTagsReplace,
  ArticleAction,
  Actions,
  ActionUnfavorite,
  ActionFavorite,
  ActionArchive,
  ActionDelete,
  ActionReadd,
} from "services/sendActions";
import {
  createArchiveAction,
  createDeleteAction,
  createFavoriteAction,
  createTagReplaceAction,
  createUnarchiveAction,
} from "services/sendActions";

import type { PocketArticle, ResponseGetPocketApi } from "./pocketApi";
import type { InfiniteData, Query, QueryClient, QueryKey } from "react-query";
import type { DeepReadonly } from "ts-essentials/dist/types";

interface ResponseSendPocketApi {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  action_results: boolean[];
  status: number;
}

type UseItemsMutationContext = {
  oldData: ResponseGetPocketApi;
  newData: ResponseGetPocketApi;
  queryKey: QueryKey;
}[];

// eslint-disable-next-line etc/prefer-interface
type GetItemToReplaceFunction<ArticleActionType extends ArticleAction> = (
  oldData: DeepReadonly<ResponseGetPocketApi>,
  action: ArticleActionType
) => ResponseGetPocketApi;

const sendPostActions = async (actions: DeepReadonly<Actions>) =>
  await fetch(
    `/api/items/send?actions=${encodeURIComponent(JSON.stringify(actions))}`
  ).then(async (response) => (await response.json()) as ResponseSendPocketApi);

const getPageIndexOfPocketArticle = (
  data: DeepReadonly<InfiniteData<ResponseGetPocketApi>>,
  itemId: string
): number =>
  data.pages.reduce(
    (previous, current, index) =>
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      current.list[itemId] === undefined ? previous : index,
    0
  );

const getNewData = <ArticleActionType extends ArticleAction>(
  // eslint-disable-next-line no-warning-comments
  // FIXME: use deepReadonly
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  oldDatawithPages: InfiniteData<ResponseGetPocketApi> | undefined,
  action: ArticleActionType,
  getItemToReplaceFunction: GetItemToReplaceFunction<ArticleActionType>
): InfiniteData<ResponseGetPocketApi> => {
  if (oldDatawithPages) {
    const pageIndex = getPageIndexOfPocketArticle(
      oldDatawithPages,
      action.item_id
    );
    const oldData = oldDatawithPages.pages[pageIndex];

    const itemToReplace = getItemToReplaceFunction(oldData, action);

    return {
      ...oldDatawithPages,

      pages: Object.assign([], oldDatawithPages.pages, {
        [pageIndex]: itemToReplace,
      }),
    };
  }

  return {} as InfiniteData<ResponseGetPocketApi>;
};
const getResponseGetPocketApiChangeFavorite: GetItemToReplaceFunction<
  ActionFavorite | ActionUnfavorite
> = (oldData, action) => {
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

const getResponseGetPocketApiChangeTag: GetItemToReplaceFunction<
  ActionTagsReplace
> = (oldData, action) => {
  const tags = action.tags
    .split(",")
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    .map((tagName) => ({ item_id: tagName, tag: tagName }))
    // eslint-disable-next-line unicorn/prefer-object-from-entries
    .reduce(
      (previous, current) => ({ ...previous, [current.item_id]: current }),
      {}
    );

  const newItemEdited: PocketArticle = {
    ...oldData.list[action.item_id],

    tags,
  };

  return {
    ...oldData,

    list: {
      ...oldData.list,
      [action.item_id]: newItemEdited,
    },
  };
};

const getResponseGetPocketApiRemoveKey: GetItemToReplaceFunction<
  ActionArchive | ActionDelete | ActionReadd
> = (oldData, action) => ({
  ...oldData,
  list: rOmit([action.item_id], oldData.list),
});

const manageFavorites = (
  queryClient: DeepReadonly<QueryClient>,
  queryKey: QueryKey,
  action: DeepReadonly<ActionFavorite | ActionUnfavorite>,
  notify: (name: string) => void
  // eslint-disable-next-line max-params
): InfiniteData<ResponseGetPocketApi> =>
  queryClient.setQueryData(queryKey, (oldData) => {
    switch (action.action) {
      case "favorite":
        notify("Favorite");
        break;
      case "unfavorite":
        notify("Unfavorite");
        break;
      default:
        throw new Error("Unknown action");
    }
    return getNewData(oldData, action, getResponseGetPocketApiChangeFavorite);
  });

const setQueryDataFromActions = (
  queryClient: DeepReadonly<QueryClient>,
  queryKey: QueryKey,
  action: DeepReadonly<ArticleAction>,
  notify: (name: string) => void
  // eslint-disable-next-line max-params
): InfiniteData<ResponseGetPocketApi> => {
  switch (action.action) {
    case "favorite":
    case "unfavorite":
      return manageFavorites(queryClient, queryKey, action, notify);
    case "archive":
    case "readd":
    case "delete":
      return queryClient.setQueryData(queryKey, (oldData) =>
        getNewData(oldData, action, getResponseGetPocketApiRemoveKey)
      );
    case "tags_replace":
      return queryClient.setQueryData(queryKey, (oldData) =>
        getNewData(oldData, action, getResponseGetPocketApiChangeTag)
      );

    default:
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
    .filter((query) =>
      Array.isArray(query.queryKey)
        ? query.queryKey.includes(parentKey)
        : query.queryKey === parentKey
    ) as Query<InfiniteData<ResponseGetPocketApi>>[];

const getAllItemsFromPagedQuery = (
  query: DeepReadonly<Query<InfiniteData<ResponseGetPocketApi>>>
): { [key: string]: PocketArticle } =>
  query.state.data?.pages.reduce(
    (current, page) => ({
      ...current,
      ...page.list,
    }),
    {}
  ) ?? {};

const getItemQueryKeys = (
  queryClient: DeepReadonly<QueryClient>,
  itemId: string
): QueryKey[] =>
  getRelatedQueries(queryClient, "items")
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    .filter((query) => getAllItemsFromPagedQuery(query)[itemId] !== undefined)
    .map((query) => query.queryKey);

// clash of rules
// eslint-disable-next-line etc/prefer-interface
type MakeMutation = (dataItem: DeepReadonly<PocketArticle>) => void;

export default function useItemsMutation() {
  const queryClient = useQueryClient();
  const { onStartNotify, onFinishNotify } = useNotify("Loading Articles..", {
    key: "mutating-article",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    preventDuplicate: true,
  });

  const itemsMutation = useMutation<
    ResponseSendPocketApi,
    unknown,
    Actions,
    UseItemsMutationContext
  >(async (actions: DeepReadonly<Actions>) => await sendPostActions(actions), {
    onMutate: async (variables) =>
      await Promise.all(
        variables.map((action) => {
          if ("item_id" in action) {
            const queryKeys = getItemQueryKeys(queryClient, action.item_id);

            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            queryKeys.forEach(async (queryKey) => {
              // Cancel any outgoing refetches
              // (so they don't overwrite our optimistic update)
              await queryClient.cancelQueries(queryKey);

              // Snapshot the previous value
              const oldData =
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                queryClient.getQueryData<ResponseGetPocketApi>(queryKey)!;
              // Optimistically update to the new value
              const newData = setQueryDataFromActions(
                queryClient,
                queryKey,
                action,
                onStartNotify
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
            queryKey: "items" as QueryKey,
          };
        })
      ),

    onError: (error, variables, context) => {
      // eslint-disable-next-line no-console
      console.error("endpoint error:", error);

      context?.forEach((aContext) => {
        queryClient.setQueryData(aContext.queryKey, aContext.oldData);
      });
    },

    // eslint-disable-next-line max-params
    onSettled: (data, error, variables, context) => {
      onFinishNotify();
      context?.forEach((aContext) => {
        void queryClient.invalidateQueries(aContext.queryKey);
      });
    },
  });

  /* eslint-disable react-hooks/exhaustive-deps */

  const mutationUnarchive: MakeMutation = useCallback((dataItem) => {
    itemsMutation.mutate([createUnarchiveAction(dataItem.item_id)]);
  }, []);

  const mutationArchive: MakeMutation = useCallback((dataItem) => {
    itemsMutation.mutate([createArchiveAction(dataItem.item_id)]);
  }, []);

  const mutationtoggleFavorite: MakeMutation = useCallback((dataItem) => {
    itemsMutation.mutate([
      createFavoriteAction(dataItem.favorite, dataItem.item_id),
    ]);
  }, []);

  const mutationDelete: MakeMutation = useCallback((dataItem) => {
    itemsMutation.mutate([createDeleteAction(dataItem.item_id)]);
  }, []);

  const mutationTagReplace = useCallback((itemId: string, tags: string) => {
    itemsMutation.mutate([createTagReplaceAction(itemId, tags)]);
  }, []);

  /* eslint-enable react-hooks/exhaustive-deps */

  return {
    ...itemsMutation,
    mutationArchive,
    mutationUnarchive,
    mutationtoggleFavorite,
    mutationDelete,
    mutationTagReplace,
  };
}

export type { MakeMutation };
