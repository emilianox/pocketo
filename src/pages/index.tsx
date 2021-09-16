/* eslint-disable max-statements */
import React, { forwardRef, useCallback, useMemo, useState } from "react";

// import { ReactQueryDevtools } from "react-query/devtools";
import { Virtuoso } from "react-virtuoso";

import Item from "components/Item";
import ItemLoaderPage from "components/ItemLoaderPage";
import Logo from "components/Logo";
import SearchForm from "components/SearchForm";
import TagModal from "components/TagModal";

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
  const [formSearchResult, setFormSearchResult] = useState<SearchParameters>(
    {} as SearchParameters
  );

  const [selectedItem, setselectedItem] = useState<PocketArticle>();

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

  const {
    mutationArchive,
    mutationUnarchive,
    mutationtoggleFavorite,
    mutationDelete,
    tagReplaceMutation,
  } = useItemsMutation();

  const onSaveModal = useCallback(
    (itemId: string, tags: readonly string[]) => {
      setselectedItem(undefined);
      tagReplaceMutation(itemId, tags.join(","));
    },
    [tagReplaceMutation]
  );

  const onCancelModal = useCallback(() => {
    setselectedItem(undefined);
  }, []);

  const itemContent = useCallback(
    (index: number, dataItem: DeepReadonly<PocketArticle>): JSX.Element => (
      <Item
        dataItem={dataItem}
        key={index}
        mutationArchive={mutationArchive}
        mutationDelete={mutationDelete}
        mutationUnarchive={mutationUnarchive}
        mutationtoggleFavorite={mutationtoggleFavorite}
        setselectedItem={setselectedItem}
      />
    ),
    [mutationArchive, mutationDelete, mutationUnarchive, mutationtoggleFavorite]
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

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (error || errorTags) {
    return "Error...";
  }

  return (
    <>
      <div className="flex fixed z-10 w-full bg-gray-800">
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
      <Virtuoso
        // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
        components={{
          // eslint-disable-next-line react/display-name, react/no-multi-comp, @typescript-eslint/naming-convention
          List: forwardRef(({ style, children }, listReference) => (
            // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
            <div ref={listReference} style={{ ...style, marginTop: 120 }}>
              {children}
            </div>
          )),

          // eslint-disable-next-line @typescript-eslint/naming-convention
          EmptyPlaceholder: isLoading ? ItemLoaderPage : undefined,
        }}
        data={dataItems}
        endReached={nextPage}
        itemContent={itemContent}
        overscan={1000}
        useWindowScroll
      />
      {/* <ReactQueryDevtools initialIsOpen /> */}
      {selectedItem && (
        <TagModal
          onCancel={onCancelModal}
          onSave={onSaveModal}
          selectedItem={selectedItem}
          suggestions={suggestionsTags}
        />
      )}
    </>
  );
}

export default ItemsPage;
