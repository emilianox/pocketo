/* eslint-disable max-statements */
import Head from "next/head";
import { useCallback, useMemo, useState } from "react";
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

  // console.log("formSearchResult", formSearchResult);

  const { data, error, fetchNextPage, isFetching } = useItems(formSearchResult);

  const itemsMutation = useItemsMutation();

  // const dataItems = data ? Object.values(data.list) : [];
  const dataItems: PocketArticle[] = data
    ? data.pages.reduce<PocketArticle[]>(
        (previous, current) => [...previous, ...Object.values(current.list)],
        []
      )
    : [];

  // console.log("dataItems", dataItems);

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
  /* eslint-enable react-hooks/exhaustive-deps */

  const onCancelModal = useCallback(() => {
    setselectedItem(undefined);
  }, []);

  const nextPage = useCallback(
    async () => await fetchNextPage(),
    [fetchNextPage]
  );

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (error) {
    return "Error...";
  }

  return (
    <>
      <Head>
        <title>Pocketo</title>
      </Head>
      <SearchForm onSubmit={setFormSearchResult} />
      {
        // Since the last page's data potentially sticks around between page requests,
        // we can use `isFetching` to show a background loading
        // indicator since our `status === 'loading'` state won't be triggered
        isFetching ? <span> Loading...</span> : undefined
      }{" "}
      <Virtuoso
        // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
        components={{
          // eslint-disable-next-line react/no-unstable-nested-components, react/display-name, react/no-multi-comp, @typescript-eslint/naming-convention
          Footer: () => {
            return (
              <div
                style={useMemo(
                  () => ({
                    padding: "2rem",
                    display: "flex",
                    justifyContent: "center",
                  }),
                  []
                )}
              >
                Loading...
              </div>
            );
          },
        }}
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
        // eslint-disable-next-line react/forbid-component-props, react-perf/jsx-no-new-object-as-prop
        style={{ height: 800 }}
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
