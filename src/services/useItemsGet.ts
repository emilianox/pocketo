/* eslint-disable @typescript-eslint/naming-convention */

import { identity, pickBy } from "ramda";
import { useInfiniteQuery } from "react-query";

import useNotify from "hooks/useNotify";

import type {
  ResponseGetPocketApi,
  SearchMetaPremium,
  SearchParameters,
} from "./pocketApi";
import type { DeepReadonly } from "ts-essentials/dist/types";

interface GetPocketArticles {
  // eslint-disable-next-line @typescript-eslint/prefer-function-type
  (
    searchParameters: DeepReadonly<SearchParameters>,
    onStartNotify: () => void,
    onFinishNotify: () => void
  ): Promise<ResponseGetPocketApi>;
}

const getPocketArticles: GetPocketArticles = async (
  searchParameters,
  onStartNotify,
  onFinishNotify
) => {
  const parsed = pickBy<Record<string, string>, Record<string, string>>(
    identity,
    {
      ...searchParameters,
      count: searchParameters.count.toString(),
      offset: searchParameters.offset.toString(),
    }
  );

  if (parsed.search) {
    // eslint-disable-next-line fp/no-mutation
    parsed.search = encodeURIComponent(parsed.search);
  }

  onStartNotify();

  const response = await fetch(
    `/api/items/get?${new URLSearchParams(parsed).toString()}`
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  onFinishNotify();

  return (await response.json()) as ResponseGetPocketApi;
};

type pageParameters = DeepReadonly<{
  pageParam?: SearchParameters | undefined;
}>;

const itemPerRequest = 30;

export default function useItemsGet(
  searchParameters: DeepReadonly<SearchParameters>
) {
  const { onStartNotify, onFinishNotify } = useNotify("Loading Articles..", {
    key: "loading",
    preventDuplicate: true,
  });

  return useInfiniteQuery(
    ["items", searchParameters],
    async ({ pageParam: pageParameter }: pageParameters) => {
      const searchParametersEdited =
        pageParameter === undefined
          ? { ...searchParameters, offset: 0, count: itemPerRequest }
          : { ...searchParameters, ...pageParameter };
      return await getPocketArticles(
        searchParametersEdited,
        onStartNotify,
        onFinishNotify
      );
    },
    {
      notifyOnChangeProps: ["data", "error"],
      // eslint-disable-next-line no-warning-comments
      // FIXME: in production
      refetchOnWindowFocus: false,
      staleTime: 5000,

      getNextPageParam: (lastPage, allPages) => {
        const hasNewPage: boolean =
          lastPage.search_meta.search_type === "normal"
            ? allPages.length * itemPerRequest <
              Number.parseInt(lastPage.total ?? "0", 10)
            : (lastPage.search_meta as SearchMetaPremium).has_more;

        return hasNewPage
          ? {
              count: itemPerRequest,
              offset: allPages.length * itemPerRequest,
            }
          : undefined;
      },
    }
  );
}
