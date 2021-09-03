import type { DeepReadonly } from "ts-essentials/dist/types";
import type { Dispatch, SetStateAction } from "react";
import React, { useMemo, useCallback } from "react";

import type { PocketArticle } from "services/useItemsGet";
import type { MakeMutation } from "pages";
import ActionButtons from "components/ActionButtons";

interface ItemProps {
  dataItem: PocketArticle;
  mutationArchive: MakeMutation;
  mutationDelete: MakeMutation;
  mutationtoggleFavorite: MakeMutation;
  setselectedItem: Dispatch<SetStateAction<PocketArticle | undefined>>;
  size: number;
}

function Item({
  dataItem,
  mutationArchive,
  mutationDelete,
  mutationtoggleFavorite,
  setselectedItem,
  size,
}: DeepReadonly<ItemProps>): JSX.Element {
  const styleItemRow = useMemo(
    () => ({
      width: `50rem`,
    }),
    []
  );
  const trStyle = useMemo(() => ({ height: `${size}px` }), [size]);

  const archive = useCallback(() => {
    mutationArchive(dataItem);
  }, [dataItem, mutationArchive]);

  const deleteItem = useCallback(() => {
    mutationDelete(dataItem);
  }, [dataItem, mutationDelete]);

  const toggleFavorite = useCallback(() => {
    mutationtoggleFavorite(dataItem);
  }, [dataItem, mutationtoggleFavorite]);

  const selectItem = useCallback(() => {
    setselectedItem(dataItem);
  }, [dataItem, setselectedItem]);

  return (
    <tr style={trStyle}>
      <td>
        <div className="flex items-center space-x-2">
          <div className="avatar">
            <div className="w-12 h-12">
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
          <div style={styleItemRow}>
            <div
              className="overflow-hidden font-bold overflow-ellipsis whitespace-nowrap"
              title={dataItem.resolved_title}
            >
              {dataItem.resolved_title}
            </div>
            <div
              className="overflow-hidden text-sm overflow-ellipsis whitespace-nowrap opacity-50"
              title={dataItem.resolved_url}
            >
              <a href={dataItem.resolved_url} rel="noreferrer" target="_blank">
                {dataItem.resolved_url}
              </a>
            </div>
          </div>
        </div>
      </td>
      <td>
        {dataItem.tags &&
          Object.values(dataItem.tags).map((tag) => (
            <span className="w-20 badge badge-sm badge-info" key={tag.tag}>
              {tag.tag}
            </span>
          ))}
      </td>
      <th>
        <ActionButtons
          archive={archive}
          deleteItem={deleteItem}
          favorite={dataItem.favorite}
          selectItem={selectItem}
          toggleFavorite={toggleFavorite}
        />
      </th>
    </tr>
  );
}

export default React.memo(Item);
