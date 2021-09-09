import React from "react";

import copy from "copy-text-to-clipboard";
import { AiOutlineTags } from "react-icons/ai";
import { FaLink, FaTelegram, FaTrash, FaWhatsapp } from "react-icons/fa";
import { MdStarBorder, MdArchive, MdStar, MdUnarchive } from "react-icons/md";
import { TelegramShareButton, WhatsappShareButton } from "react-share";

import type { PocketArticle } from "services/useItemsGet";

import type { DeepReadonly } from "ts-essentials/dist/types";

interface ActionButtonsProps {
  archive: () => void;
  deleteItem: () => void;
  favorite: PocketArticle["favorite"];
  status: PocketArticle["status"];
  selectItem: () => void;
  toggleFavorite: () => void;
  url: string;
}

function ActionButtons({
  archive,
  deleteItem,
  favorite,
  selectItem,
  toggleFavorite,
  url,
  status,
}: DeepReadonly<ActionButtonsProps>): JSX.Element {
  return (
    <div className="p-2 shadow-lg menu bg-base-100 rounded-box horizontal">
      <li>
        <button
          className="inline-block mx-2 w-6 h-6 stroke-current"
          onClick={toggleFavorite}
          type="button"
        >
          {favorite === "0" ? (
            <MdStarBorder size="1.5em" />
          ) : (
            <MdStar size="1.5em" />
          )}
        </button>
      </li>
      <button
        className="inline-block mx-2 w-6 h-6 stroke-current"
        onClick={archive}
        type="button"
      >
        {status === "0" ? (
          <MdArchive size="1.5em" />
        ) : (
          <MdUnarchive size="1.5em" />
        )}
      </button>
      <button
        className="inline-block mx-2 w-6 h-6 stroke-current"
        onClick={selectItem}
        type="button"
      >
        <AiOutlineTags size="1.5em" />
      </button>
      <button
        className="inline-block mx-2 w-6 h-6 stroke-current"
        onClick={React.useCallback(() => copy(url), [url])}
        type="button"
      >
        <FaLink size="1.5em" />
      </button>
      <WhatsappShareButton
        // eslint-disable-next-line react/forbid-component-props
        className="inline-block mx-2 w-6 h-6 stroke-current"
        resetButtonStyle={false}
        // title={title}
        separator=":: "
        url={url}
      >
        <FaWhatsapp size="1.5em" />
      </WhatsappShareButton>
      <TelegramShareButton
        // eslint-disable-next-line react/forbid-component-props
        className="inline-block mx-2 w-6 h-6 stroke-current"
        resetButtonStyle={false}
        // title={title}
        // separator=":: "
        url={url}
      >
        <FaTelegram size="1.5em" />
      </TelegramShareButton>
      <button
        className="inline-block mx-2 w-6 h-6 stroke-current"
        onClick={deleteItem}
        type="button"
      >
        <FaTrash size="1.5em" />
      </button>
    </div>
  );
}

export default React.memo(ActionButtons);
