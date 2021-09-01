/* eslint-disable max-statements */
/* eslint-disable react-perf/jsx-no-new-object-as-prop */
// import clsx from "clsx";
import Head from "next/head";
import { useRef, useState } from "react";
import { useVirtual } from "react-virtual";
import { MdStarBorder, MdArchive, MdStar } from "react-icons/md";
import { AiOutlineTags } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import type { DeepReadonly } from "ts-essentials/dist/types";
// import { ReactQueryDevtools } from "react-query/devtools";

import useItems from "services/useItemsGet";
import useItemsMutation from "services/useItemsMutation";
import {
  createArchiveAction,
  createDeleteAction,
  createFavoriteAction,
} from "services/sendActions";

function Items() {
  const pageSize = 10;

  const [offset, setOffset] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { status, data, error, isFetching, isPreviousData } = useItems(offset);

  const mutation = useItemsMutation();

  const dataItems = data ? Object.values(data.list) : [];

  const parentReference = useRef();

  const rowVirtualizer = useVirtual({
    size: dataItems.length,
    parentRef: parentReference,
  });

  const toggleFavoriteMutation = (
    ...parameters: DeepReadonly<Parameters<typeof createFavoriteAction>>
  ) => {
    return () => {
      mutation.mutate([createFavoriteAction(...parameters)]);
    };
  };

  const archiveMutation = (
    ...parameter: DeepReadonly<Parameters<typeof createArchiveAction>>
  ) => {
    return () => {
      mutation.mutate([createArchiveAction(...parameter)]);
    };
  };
  const deleteMutation = (
    ...parameter: DeepReadonly<Parameters<typeof createDeleteAction>>
  ) => {
    return () => {
      mutation.mutate([createDeleteAction(...parameter)]);
    };
  };

  if (status === "loading") {
    return "Loading...";
  }

  if (error) {
    return "Error...";
  }

  return (
    <>
      <Head>
        <title>Pocket Items</title>
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
          <tbody
            style={{
              height: `${rowVirtualizer.totalSize}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.virtualItems.map(({ index, size }) => {
              const dataItem = dataItems[index];

              return (
                <tr key={index} style={{ height: `${size}px` }}>
                  <td>
                    <div className="flex items-center space-x-2">
                      <div className="avatar">
                        <div className=" w-12 h-12">
                          {dataItem.top_image_url && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              alt="post"
                              height="48"
                              src={dataItem.top_image_url}
                              width="48"
                            />
                          )}
                        </div>
                      </div>
                      <div style={{ width: `50rem` }}>
                        <div
                          className="overflow-hidden font-bold overflow-ellipsis whitespace-nowrap"
                          title={dataItem.resolved_title}
                        >
                          {dataItem.resolved_title}
                        </div>
                        <div
                          className=" overflow-hidden text-sm overflow-ellipsis whitespace-nowrap opacity-50"
                          title={dataItem.resolved_url}
                        >
                          <a
                            href={dataItem.resolved_url}
                            rel="noreferrer"
                            target="_blank"
                          >
                            {dataItem.resolved_url}
                          </a>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {dataItem.tags &&
                      Object.values(dataItem.tags).map((tag) => (
                        <span
                          className="w-20 badge badge-sm badge-info"
                          key={tag.tag}
                        >
                          {tag.tag}
                        </span>
                      ))}
                  </td>
                  <th>
                    <div className="btn-group">
                      <button
                        className="text-gray-400 btn btn-outline btn-sm"
                        onClick={toggleFavoriteMutation(
                          dataItem.favorite,
                          dataItem.item_id
                        )}
                        type="button"
                      >
                        {dataItem.favorite === "0" ? (
                          <MdStarBorder size="1.5em" />
                        ) : (
                          <MdStar size="1.5em" />
                        )}
                      </button>
                      <button
                        className="text-gray-400 btn btn-outline btn-sm"
                        onClick={archiveMutation(dataItem.item_id)}
                        type="button"
                      >
                        <MdArchive size="1.5em" />
                      </button>
                      <button
                        className="text-gray-400 btn btn-outline btn-sm"
                        type="button"
                      >
                        <AiOutlineTags size="1.5em" />
                      </button>
                      <button
                        className="text-gray-400 btn btn-outline btn-sm"
                        onClick={deleteMutation(dataItem.item_id)}
                        type="button"
                      >
                        <FaTrash size="1.5em" />
                      </button>
                    </div>
                  </th>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="btn-group">
          <button
            className="btn"
            disabled={offset === 0}
            // eslint-disable-next-line react/jsx-no-bind, react-perf/jsx-no-new-function-as-prop
            onClick={() => {
              setOffset(offset - pageSize);
            }}
            type="button"
          >
            «
          </button>
          <button
            className="btn"
            // eslint-disable-next-line react/jsx-no-bind, react-perf/jsx-no-new-function-as-prop
            onClick={() => {
              setOffset(offset + pageSize);
            }}
            type="button"
          >
            »
          </button>
        </div>
        {
          // Since the last page's data potentially sticks around between page requests,
          // we can use `isFetching` to show a background loading
          // indicator since our `status === 'loading'` state won't be triggered
          // eslint-disable-next-line unicorn/no-null
          isFetching ? <span> Loading...</span> : null
        }{" "}
      </div>
      {/* <ReactQueryDevtools initialIsOpen /> */}
      <div className="modal modal-open">
        <div className="modal-box">
          <p>
            Enim dolorem dolorum omnis atque necessitatibus. Consequatur aut
            adipisci qui iusto illo eaque. Consequatur repudiandae et. Nulla ea
            quasi eligendi. Saepe velit autem minima.
          </p>
          <div className="modal-action">
            <label className="btn btn-primary" htmlFor="my-modal-2">
              Save
            </label>
            <label className="btn" htmlFor="my-modal-2">
              Cancel
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default Items;
