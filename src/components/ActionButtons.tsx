/* eslint-disable react/forbid-component-props */
import React from "react";

import { AiOutlineDelete } from "@react-icons/all-files/ai/AiOutlineDelete";
import { AiOutlineTags } from "@react-icons/all-files/ai/AiOutlineTags";
import { FiLink } from "@react-icons/all-files/fi/FiLink";
import { IoArchive } from "@react-icons/all-files/io5/IoArchive";
import { IoArchiveOutline } from "@react-icons/all-files/io5/IoArchiveOutline";
import { MdStar } from "@react-icons/all-files/md/MdStar";
import { MdStarBorder } from "@react-icons/all-files/md/MdStarBorder";
import { RiDeviceRecoverLine } from "@react-icons/all-files/ri/RiDeviceRecoverLine";
import { RiTelegramLine } from "@react-icons/all-files/ri/RiTelegramLine";
import { RiWhatsappLine } from "@react-icons/all-files/ri/RiWhatsappLine";
import { TelegramShareButton, WhatsappShareButton } from "react-share";

import type { PocketArticle } from "services/pocketApi";

import type { DeepReadonly } from "ts-essentials/dist/types";

interface ActionButtonsProps {
  archive: () => void;
  deleteItem: () => void;
  favorite: PocketArticle["favorite"];
  status: PocketArticle["status"];
  changeTagsItem: () => void;
  toggleFavorite: () => void;
  copyLinkItem: () => void;
  url: string;
  cacheUrl: string;
}

function ActionButtons({
  archive,
  deleteItem,
  favorite,
  changeTagsItem,
  toggleFavorite,
  url,
  cacheUrl,
  status,
  copyLinkItem,
}: DeepReadonly<ActionButtonsProps>): JSX.Element {
  return (
    <div className=" p-2 shadow-lg menu bg-base-100 rounded-box horizontal">
      <li>
        <button
          className=" inline-block mx-2 w-6 h-6 stroke-current"
          onClick={toggleFavorite}
          type="button"
        >
          {favorite === "0" ? (
            <MdStarBorder className="hover:text-purple-500" size="1.5em" />
          ) : (
            <MdStar className="hover:text-purple-500" size="1.5em" />
          )}
        </button>
      </li>
      <button
        className="inline-block mx-2 w-6 h-6 stroke-current"
        onClick={archive}
        type="button"
      >
        {status === "0" ? (
          <IoArchiveOutline className="hover:text-purple-500" size="1.5em" />
        ) : (
          <IoArchive className="hover:text-purple-500" size="1.5em" />
        )}
      </button>
      <button
        className="inline-block mx-2 w-6 h-6 stroke-current"
        onClick={changeTagsItem}
        type="button"
      >
        <AiOutlineTags className="hover:text-purple-500" size="1.5em" />
      </button>
      <button
        className="inline-block mx-2 w-6 h-6 stroke-current"
        onClick={copyLinkItem}
        type="button"
      >
        <FiLink className="hover:text-purple-500" size="1.5em" />
      </button>
      <WhatsappShareButton
        className="inline-block mx-2 w-6 h-6 stroke-current"
        resetButtonStyle={false}
        // title={title}
        separator=":: "
        url={url}
      >
        <RiWhatsappLine className="hover:text-purple-500" size="1.5em" />
      </WhatsappShareButton>
      <TelegramShareButton
        className="inline-block mx-2 w-6 h-6 stroke-current"
        resetButtonStyle={false}
        // title={title}
        // separator=":: "
        url={url}
      >
        <RiTelegramLine className="hover:text-purple-500" size="1.5em" />
      </TelegramShareButton>
      <a
        className="inline-block mx-2 w-6 h-6 stroke-current"
        href={cacheUrl}
        rel="noreferrer"
        target="_blank"
      >
        <RiDeviceRecoverLine className="hover:text-purple-500" size="1.5em" />
      </a>
      <button
        className="inline-block mx-2 w-6 h-6 stroke-current"
        onClick={deleteItem}
        type="button"
      >
        <AiOutlineDelete className="hover:text-purple-500" size="1.5em" />
      </button>
    </div>
  );
}

export default React.memo(ActionButtons);
