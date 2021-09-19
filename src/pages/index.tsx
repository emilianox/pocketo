/* eslint-disable max-statements */
import React, { useCallback, useMemo, useState } from "react";

// import { ReactQueryDevtools } from "react-query/devtools";
import { Virtuoso } from "react-virtuoso";

import Item from "components/Item";
import ItemLoaderPage from "components/ItemLoaderPage";
import Logo from "components/Logo";
import SearchForm from "components/SearchForm";

import type {
  PocketArticle,
  SearchMetaPremium,
  SearchParameters,
} from "services/pocketApi";
import useItems from "services/useItemsGet";
import useTagGet from "services/useTagGet";

import type { Tag } from "react-tag-input";
import type { DeepReadonly } from "ts-essentials/dist/types";

function ItemsPage() {
  const [formSearchResult, setFormSearchResult] = useState<SearchParameters>(
    {} as SearchParameters
  );

  const { data, error, fetchNextPage, isLoading } = useItems(formSearchResult);
  const dataItems: PocketArticle[] = useMemo(() => {
    const parsedData = data?.pages.reduce<PocketArticle[]>(
      (objectArticlesArray, page) => [
        ...objectArticlesArray,
        // eslint-disable-next-line fp/no-mutating-methods
        ...Object.values(page.list).reverse(),
      ],
      []
    );

    return parsedData ?? [];
  }, [data]);

  const nextPage = useCallback(
    async () => await fetchNextPage(),
    [fetchNextPage]
  );

  const { data: allTags, error: errorTags } = useTagGet();
  const suggestionsTags: Tag[] = useMemo(
    () => allTags?.tags.map((tag) => ({ id: tag, text: tag })) ?? [],
    [allTags?.tags]
  );

  const itemContent = useCallback(
    (index: number, dataItem: DeepReadonly<PocketArticle>): JSX.Element => (
      <Item dataItem={dataItem} key={index} suggestionsTags={suggestionsTags} />
    ),
    [suggestionsTags]
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.pages[0]]);

  const listComponents = useMemo(
    () => ({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      EmptyPlaceholder: isLoading ? ItemLoaderPage : undefined,
    }),
    [isLoading]
  );

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (error || errorTags) {
    return "Error...";
  }

  return (
    <div className="flex-col h-screen	flex">
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
          suggestions={suggestionsTags}
          totalResults={getTotalResults()}
        />
      </div>
      <div className="flex-1">
        <Virtuoso
          components={listComponents}
          data={dataItems}
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
