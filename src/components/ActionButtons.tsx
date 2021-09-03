import { MdStarBorder, MdArchive, MdStar } from "react-icons/md";
import { AiOutlineTags } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import type { DeepReadonly } from "ts-essentials/dist/types";
import React from "react";

interface ActionButtonsProps {
  archive: () => void;
  deleteItem: () => void;
  favorite: "0" | "1";
  selectItem: () => void;
  toggleFavorite: () => void;
}

function ActionButtons({
  archive,
  deleteItem,
  favorite,
  selectItem,
  toggleFavorite,
}: DeepReadonly<ActionButtonsProps>): JSX.Element {
  return (
    <div className="btn-group">
      <button
        className="text-gray-400 btn btn-outline btn-sm"
        onClick={toggleFavorite}
        type="button"
      >
        {favorite === "0" ? (
          <MdStarBorder size="1.5em" />
        ) : (
          <MdStar size="1.5em" />
        )}
      </button>
      <button
        className="text-gray-400 btn btn-outline btn-sm"
        onClick={archive}
        type="button"
      >
        <MdArchive size="1.5em" />
      </button>
      <button
        className="text-gray-400 btn btn-outline btn-sm"
        onClick={selectItem}
        type="button"
      >
        <AiOutlineTags size="1.5em" />
      </button>
      <button
        className="text-gray-400 btn btn-outline btn-sm"
        onClick={deleteItem}
        type="button"
      >
        <FaTrash size="1.5em" />
      </button>
    </div>
  );
}

export default React.memo(ActionButtons);
