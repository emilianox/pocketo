/* eslint-disable max-statements */
import React, { forwardRef, useCallback, useMemo, useState } from "react";

// import { ReactQueryDevtools } from "react-query/devtools";
import { Virtuoso } from "react-virtuoso";

import Item from "components/Item";
import ItemLoaderPage from "components/ItemLoaderPage";
import SearchForm from "components/SearchForm";
import TagModal from "components/TagModal";

import type { PocketArticle, SearchParameters } from "services/pocketApi";
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

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (error || errorTags) {
    return "Error...";
  }

  return (
    <>
      <div className="fixed z-10 w-full bg-gray-800">
        <SearchForm
          isLoading={isLoading}
          onSubmit={setFormSearchResult}
          suggestions={suggestionsTags}
          totalResults={data?.pages[0].total ?? "0"}
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
