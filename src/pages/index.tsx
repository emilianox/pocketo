/* eslint-disable max-statements */
import Head from "next/head";
import { useCallback, useMemo, useRef, useState } from "react";
import { useVirtual } from "react-virtual";
import type { DeepReadonly } from "ts-essentials/dist/types";
// import { ReactQueryDevtools } from "react-query/devtools";

import type { PocketArticle } from "services/useItemsGet";
import useItems from "services/useItemsGet";
import TagModal from "components/TagModal";
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
  const pageSize = 10;

  const [offset, setOffset] = useState(0);

  const [selectedItem, setselectedItem] = useState<PocketArticle>();

  const { status, data, error, isFetching } = useItems(offset);

  const itemsMutation = useItemsMutation();

  const dataItems = data ? Object.values(data.list) : [];

  const parentReference = useRef();

  const rowVirtualizer = useVirtual({
    size: dataItems.length,
    parentRef: parentReference,
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

  const clickPrevious = useCallback(() => {
    setOffset(offset - pageSize);
  }, [offset]);

  const clickNext = useCallback(() => {
    setOffset(offset + pageSize);
  }, [offset]);

  const listTableStyle = useMemo(
    () => ({
      height: `${rowVirtualizer.totalSize}px`,
    }),
    [rowVirtualizer]
  );

  if (status === "loading") {
    return "Loading...";
  }

  if (error) {
    return "Error...";
  }

  return (
    <>
      <Head>
        <title>Pocketo</title>
      </Head>
      {/* @ts-expect-error ref  */}
      <div className="overflow-x-auto" ref={parentReference}>
        <table className="table w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Tags</th>
              <th />
            </tr>
          </thead>
          <tbody className="relative w-full" style={listTableStyle}>
            {rowVirtualizer.virtualItems.map(({ index, size }) => {
              const dataItem = dataItems[index];

              return (
                <Item
                  dataItem={dataItem}
                  key={index}
                  mutationArchive={mutationArchive}
                  mutationDelete={mutationDelete}
                  mutationtoggleFavorite={mutationtoggleFavorite}
                  setselectedItem={setselectedItem}
                  size={size}
                />
              );
            })}
          </tbody>
        </table>
        <div className="btn-group">
          <button
            className="btn"
            disabled={offset === 0}
            onClick={clickPrevious}
            type="button"
          >
            «
          </button>
          <button className="btn" onClick={clickNext} type="button">
            »
          </button>
        </div>
        {
          // Since the last page's data potentially sticks around between page requests,
          // we can use `isFetching` to show a background loading
          // indicator since our `status === 'loading'` state won't be triggered
          isFetching ? <span> Loading...</span> : undefined
        }{" "}
      </div>
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
