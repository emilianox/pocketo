import { useCallback } from "react";

import { omit as rOmit } from "ramda";
import { useMutation, useQueryClient } from "react-query";

import {
  createArchiveAction,
  createDeleteAction,
  createFavoriteAction,
  createTagReplaceAction,
} from "services/sendActions";

import type {
  ArticleAction,
  Actions,
  ActionUnfavorite,
  ActionFavorite,
  ActionArchive,
  ActionDelete,
} from "./sendActions";
import type { PocketArticle, ResponseGetPocketApi } from "./useItemsGet";
import type { InfiniteData, Query, QueryClient, QueryKey } from "react-query";
import type { DeepReadonly } from "ts-essentials/dist/types";

interface ResponseSendPocketApi {
  // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
  action_results: boolean[];
  status: number;
}

type UseItemsMutationContext = {
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
  itemId: string
): number =>
  data.pages.reduce(
    (previous, current, index) =>
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      current.list[itemId] === undefined ? previous : index,
    0
  );

// eslint-disable-next-line no-warning-comments
// FIXME:eslint breaks on generics in fns when is fixed remove this typescript
// and move this declaration to updaterFunction
type UpdaterFunction<ArticleType> = (
  oldDatawithPages: InfiniteData<ResponseGetPocketApi> | undefined,
  action: ArticleType,
  getNewResponseFunction: (
    oldData: DeepReadonly<ResponseGetPocketApi>,
    action: ArticleType
  ) => ResponseGetPocketApi
) => InfiniteData<ResponseGetPocketApi>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updaterFunction: UpdaterFunction<any> = (
  oldDatawithPages,
  action,
  getNewResponseFunction
) => {
  if (oldDatawithPages) {
    const pageIndex = getIndexItemInPageQuery(
      oldDatawithPages,
      // eslint-disable-next-line no-warning-comments
      // FIXME: eslint breaks on generics in fns when is fixed remove the cast
      (action as ArticleAction).item_id
    );
    const oldData: ResponseGetPocketApi = oldDatawithPages.pages[pageIndex];

    const itemToReplace: ResponseGetPocketApi = getNewResponseFunction(
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
  action: ActionFavorite | ActionUnfavorite
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
  action: DeepReadonly<ActionArchive | ActionDelete>
): ResponseGetPocketApi => {
  return {
    ...oldData,
    list: rOmit([action.item_id], oldData.list),
  };
};

const setQueryDataFromActions = (
  queryClient: DeepReadonly<QueryClient>,
  queryKey: QueryKey,
  action: ArticleAction
): InfiniteData<ResponseGetPocketApi> => {
  switch (action.action) {
    case "favorite":
    case "unfavorite":
      return queryClient.setQueryData(queryKey, (oldData) =>
        updaterFunction(oldData, action, getResponseGetPocketApiChangeFavorite)
      );
    case "archive":
    case "delete":
      return queryClient.setQueryData(queryKey, (oldData) =>
        updaterFunction(oldData, action, getResponseGetPocketApiRemoveKey)
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
    .filter((query) => {
      return Array.isArray(query.queryKey)
        ? query.queryKey.includes(parentKey)
        : query.queryKey === parentKey;
    }) as Query<InfiniteData<ResponseGetPocketApi>>[];

const getAllItemsFromPagedQuery = (
  query: DeepReadonly<Query<InfiniteData<ResponseGetPocketApi>>>
): Record<string, PocketArticle> =>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, unicorn/prefer-object-from-entries
  query.state.data!.pages.reduce(
    (current, page) => ({
      ...current,
      ...page.list,
    }),
    {}
  );

const getItemQueryKeys = (
  queryClient: DeepReadonly<QueryClient>,
  itemId: string
): QueryKey[] =>
  getRelatedQueries(queryClient, "items")
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    .filter((query) => getAllItemsFromPagedQuery(query)[itemId] !== undefined)
    .map((query) => query.queryKey);

type MakeMutation = (dataItem: DeepReadonly<PocketArticle>) => void;

export default function useItemsSet() {
  const queryClient = useQueryClient();

  const itemsMutation = useMutation<
    ResponseSendPocketApi,
    unknown,
    Actions,
    UseItemsMutationContext
  >(async (actions: DeepReadonly<Actions>) => await postActions(actions), {
    onMutate: async (variables) => {
      return await Promise.all(
        variables.map((action) => {
          if ("item_id" in action) {
            const queryKeys = getItemQueryKeys(queryClient, action.item_id);

            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            queryKeys.forEach(async (queryKey) => {
              // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
              await queryClient.cancelQueries(queryKey);

              // Snapshot the previous value
              const oldData =
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                queryClient.getQueryData<ResponseGetPocketApi>(queryKey)!;
              // Optimistically update to the new value
              const newData = setQueryDataFromActions(
                queryClient,
                queryKey,
                action
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
      // eslint-disable-next-line no-console
      console.error("endpoint error:", error);

      context?.forEach((aContext) => {
        queryClient.setQueryData(aContext.queryKey, aContext.oldData);
      });
    },

    // eslint-disable-next-line max-params
    onSettled: (data, error, variables, context) => {
      context?.forEach((aContext) => {
        void queryClient.invalidateQueries(aContext.queryKey);
      });
    },
  });
  /* eslint-disable react-hooks/exhaustive-deps */

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

  const tagReplaceMutation = useCallback((itemId: string, tags: string) => {
    itemsMutation.mutate([createTagReplaceAction(itemId, tags)]);
  }, []);

  /* eslint-enable react-hooks/exhaustive-deps */

  return {
    ...itemsMutation,
    mutationArchive,
    mutationtoggleFavorite,
    mutationDelete,
    tagReplaceMutation,
  };
}

export type { MakeMutation };
