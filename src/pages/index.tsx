/* eslint-disable max-statements */
import React, { forwardRef, useCallback, useMemo, useState } from "react";

// import { ReactQueryDevtools } from "react-query/devtools";
import { Virtuoso } from "react-virtuoso";

import ConfirmModal from "components/ConfirmModal";
import Item from "components/Item";
import ItemLoaderPage from "components/ItemLoaderPage";
import SearchForm from "components/SearchForm";
import TagModal from "components/TagModal";

import useItems from "services/useItemsGet";
import type { PocketArticle, SearchParameters } from "services/useItemsGet";
import useItemsMutation from "services/useItemsMutation";

function Items() {
  const [formSearchResult, setFormSearchResult] = useState<SearchParameters>(
    {} as SearchParameters
  );

  const [selectedItem, setselectedItem] = useState<PocketArticle>();

  const { data, error, fetchNextPage } = useItems(formSearchResult);

  const {
    mutationArchive,
    mutationtoggleFavorite,
    mutationDelete,
    tagReplaceMutation,
  } = useItemsMutation();

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

  const nextPage = useCallback(
    async () => await fetchNextPage(),
    [fetchNextPage]
  );

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const Header = useCallback(
    () => (
      <div className="fixed z-10 w-full bg-gray-800">
        <SearchForm onSubmit={setFormSearchResult} />
      </div>
    ),
    [setFormSearchResult]
  );

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (error) {
    return "Error...";
  }

  return (
    <>
      <Virtuoso
        /* eslint-disable @typescript-eslint/naming-convention */
        // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
        components={{
          // eslint-disable-next-line react/display-name, react/no-multi-comp
          List: forwardRef(({ style, children }, listReference) => (
            // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
            <div ref={listReference} style={{ ...style, marginTop: 88 }}>
              {children}
            </div>
          )),

          Header,
          Footer: ItemLoaderPage,
        }}
        /* eslint-enable @typescript-eslint/naming-convention */
        data={dataItems}
        endReached={nextPage}
        // eslint-disable-next-line react/jsx-no-bind, react-perf/jsx-no-new-function-as-prop, react/no-unstable-nested-components
        itemContent={(index, dataItem) => (
          <Item
            dataItem={dataItem}
            key={index}
            mutationArchive={mutationArchive}
            mutationDelete={mutationDelete}
            mutationtoggleFavorite={mutationtoggleFavorite}
            setselectedItem={setselectedItem}
          />
        )}
        overscan={1000}
        useWindowScroll
      />

      {/* <ReactQueryDevtools initialIsOpen /> */}
      {selectedItem && (
        <TagModal
          onCancel={onCancelModal}
          onSave={onSaveModal}
          selectedItem={selectedItem}
        />
      )}
      <ConfirmModal
        cta="Are you sure you want to delete this item? This cannot be undone."
        isOpen
        // eslint-disable-next-line react/jsx-no-bind, react-perf/jsx-no-new-function-as-prop
        onCancel={() => true}
        // eslint-disable-next-line react/jsx-no-bind, react-perf/jsx-no-new-function-as-prop
        onConfirm={() => true}
      />
    </>
  );
}

export default Items;
