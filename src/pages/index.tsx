/* eslint-disable max-statements */
import { forwardRef, useCallback, useMemo, useState } from "react";
import type { DeepReadonly } from "ts-essentials/dist/types";
// import { ReactQueryDevtools } from "react-query/devtools";
import { Virtuoso } from "react-virtuoso";

import type { PocketArticle, SearchParameters } from "services/useItemsGet";
import useItems from "services/useItemsGet";
import TagModal from "components/TagModal";
import SearchForm from "components/SearchForm";
import Item from "components/Item";
import useItemsMutation from "services/useItemsMutation";
import {
  createArchiveAction,
  createDeleteAction,
  createFavoriteAction,
  createTagReplaceAction,
} from "services/sendActions";

type MakeMutation = (dataItem: DeepReadonly<PocketArticle>) => void;

function Items() {
  const [formSearchResult, setFormSearchResult] = useState<SearchParameters>(
    {} as SearchParameters
  );

  const [selectedItem, setselectedItem] = useState<PocketArticle>();

  const { data, error, fetchNextPage, isFetching } = useItems(formSearchResult);

  const itemsMutation = useItemsMutation();

  const dataItems: PocketArticle[] = useMemo(
    () =>
      data
        ? data.pages.reduce<PocketArticle[]>(
            (previous, current) => [
              ...previous,
              ...Object.values(current.list),
            ],
            []
          )
        : [],
    [data]
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  const mutationArchive: MakeMutation = useCallback((dataItem) => {
    itemsMutation.mutate([createArchiveAction(dataItem.item_id)]);
  }, []);

  const mutationtoggleFavorite: MakeMutation = useCallback((dataItem) => {
    itemsMutation.mutate([
      createFavoriteAction(dataItem.favorite, dataItem.item_id),
    ]);
  }, []);

  const mutationDelete: MakeMutation = useCallback(
    (dataItem) => () => {
      itemsMutation.mutate([createDeleteAction(dataItem.item_id)]);
    },
    []
  );

  const tagReplaceMutation = useCallback((itemId: string, tags: string) => {
    itemsMutation.mutate([createTagReplaceAction(itemId, tags)]);
  }, []);

  const onSaveModal = useCallback((itemId: string, tags: readonly string[]) => {
    setselectedItem(undefined);
    tagReplaceMutation(itemId, tags.join(","));
  }, []);

  const onCancelModal = useCallback(() => {
    setselectedItem(undefined);
  }, []);

  const nextPage = useCallback(async () => await fetchNextPage(), []);
  /* eslint-enable react-hooks/exhaustive-deps */

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const Footer = useCallback(
    () => <div className="flex justify-center p-8">Loading...</div>,
    []
  );

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const Header = useCallback(
    () => (
      <div className="fixed z-10 w-full bg-gray-800">
        <SearchForm onSubmit={setFormSearchResult} />
        {
          // Since the last page's data potentially sticks around between page requests,
          // we can use `isFetching` to show a background loading
          // indicator since our `status === 'loading'` state won't be triggered
          isFetching ? <span> Loading...</span> : undefined
        }
      </div>
    ),
    [isFetching, setFormSearchResult]
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
          Footer,
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
      <TagModal
        onCancel={onCancelModal}
        onSave={onSaveModal}
        selectedItem={selectedItem}
      />
    </>
  );
}

export type { MakeMutation };

export default Items;
