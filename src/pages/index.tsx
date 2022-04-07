/* eslint-disable max-statements */
import React, { useCallback, useEffect, useMemo, useState } from "react";

// import { ReactQueryDevtools } from "react-query/devtools";
import { useRouter } from "next/dist/client/router";
import { Virtuoso } from "react-virtuoso";

import Item from "components/Item";
import ItemLoaderPage from "components/ItemLoaderPage";

import Logo from "@components/Logo";
import SearchForm from "@components/SearchForm";

import type {
  PocketArticle,
  SearchMetaPremium,
  SearchParameters,
} from "services/pocketApi";
import useItems from "services/useItemsGet";
import useItemsMutation from "services/useItemsMutation";
import useTagGet from "services/useTagGet";

import type { Tag } from "react-tag-input";
import type { DeepReadonly } from "ts-essentials/dist/types";

function ItemsPage() {
  const router = useRouter();

  const [formSearchResult, setFormSearchResult] = useState<SearchParameters>(
    // needed because of multiple types clash
    {} as SearchParameters
  );

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    // router has push method
    // eslint-disable-next-line fp/no-mutating-methods
    void router.push({
      pathname: "/",
      query: formSearchResult as unknown as null,
    });
    // if you add router crash
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formSearchResult]);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    // codes using router.query
    setFormSearchResult(router.query as unknown as SearchParameters);
    // if you add router.query crash
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, setFormSearchResult]);

  const { data, error, fetchNextPage, isLoading } = useItems(formSearchResult);
  const dataItems: PocketArticle[] = useMemo(() => {
    const parsedData = data?.pages.reduce<PocketArticle[]>(
      (objectArticlesArray, page) => [
        ...objectArticlesArray,
        ...Object.values(page.list),
      ],
      []
    );

    return parsedData ?? [];
  }, [data]);

  const nextPage = useCallback(
    async () => await fetchNextPage(),
    [fetchNextPage]
  );

  const { data: allTagsResponse, error: errorTags } = useTagGet();
  const suggestionsTags: Tag[] = useMemo(
    () => allTagsResponse?.tags.map((tag) => ({ id: tag, text: tag })) ?? [],
    [allTagsResponse?.tags]
  );

  const {
    mutationArchive,
    mutationUnarchive,
    mutationtoggleFavorite,
    mutationDelete,
    mutationTagReplace,
  } = useItemsMutation();

  const itemContent = useCallback(
    (index: number, dataItem: DeepReadonly<PocketArticle>): JSX.Element => (
      <Item
        dataItem={dataItem}
        key={index}
        mutationArchive={mutationArchive}
        mutationDelete={mutationDelete}
        mutationTagReplace={mutationTagReplace}
        mutationUnarchive={mutationUnarchive}
        mutationtoggleFavorite={mutationtoggleFavorite}
        suggestionsTags={suggestionsTags}
      />
    ),
    [
      suggestionsTags,
      mutationArchive,
      mutationUnarchive,
      mutationtoggleFavorite,
      mutationDelete,
      mutationTagReplace,
    ]
  );

  const getTotalResults = useCallback((): number => {
    if (data?.pages[0]) {
      if (data.pages[0].total === undefined) {
        return 0;
      }

      if (data.pages[0].search_meta.search_type === "normal") {
        return Number.parseInt(data.pages[0].total, 10);
      }

      return (data.pages[0].search_meta as SearchMetaPremium)
        .total_result_count;
    }

    return 0;
  }, [data?.pages]);

  const listComponents = useMemo(
    () => ({
      // required by virtuoso
      // eslint-disable-next-line @typescript-eslint/naming-convention
      EmptyPlaceholder: isLoading ? ItemLoaderPage : undefined,
    }),
    [isLoading]
  );

  if (error !== null || errorTags) {
    return "Error...";
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex bg-gray-800">
        <div className="flex justify-end items-center px-8 w-2/12">
          <div className="flex flex-col items-center">
            <Logo fill="hsl(var(--p))" />
            <h1 className="text-lg font-extrabold text-primary">Pocketo</h1>
          </div>
        </div>
        <SearchForm
          isLoading={isLoading}
          onSubmit={setFormSearchResult}
          searchParameters={formSearchResult}
          suggestions={suggestionsTags}
          totalResults={getTotalResults()}
        />
      </div>
      <div className="flex-1">
        <Virtuoso
          components={listComponents}
          data={dataItems}
          // #FIXME:
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          endReached={nextPage}
          itemContent={itemContent}
          overscan={1000}
        />
      </div>
      {/* <ReactQueryDevtools initialIsOpen /> */}
    </div>
  );
}

export default ItemsPage;
