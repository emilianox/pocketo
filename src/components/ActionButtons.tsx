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
import clsx from "clsx";
import { TelegramShareButton, WhatsappShareButton } from "react-share";

import type { PocketArticle } from "services/pocketApi";

import styles from "./ActionButtons.module.scss";

import type { DeepReadonly } from "ts-essentials/dist/types";

interface ActionButtonsProps {
  favorite: PocketArticle["favorite"];
  status: PocketArticle["status"];
  url: string;
  cacheUrl: string;
  onArchive: () => void;
  onDeleteItem: () => void;
  onChangeTagsItem: () => void;
  onToggleFavorite: () => void;
  onCopyLinkItem: () => void;
}

function ActionButtons({
  favorite = "0",
  status = "0",
  url,
  cacheUrl,
  onArchive: archive,
  onDeleteItem: deleteItem,
  onChangeTagsItem: changeTagsItem,
  onToggleFavorite: toggleFavorite,
  onCopyLinkItem: copyLinkItem,
}: DeepReadonly<ActionButtonsProps>): JSX.Element {
  return (
    <div className={clsx("menu horizontal", styles.box)}>
      <div data-tip="Favorite (f)">
        <button aria-label="Favorite" onClick={toggleFavorite} type="button">
          {favorite === "0" ? (
            <MdStarBorder size="1.5em" />
          ) : (
            <MdStar size="1.5em" />
          )}
        </button>
      </div>
      <div data-tip="Archive (a)">
        <button aria-label="Archive" onClick={archive} type="button">
          {status === "0" ? (
            <IoArchiveOutline size="1.5em" />
          ) : (
            <IoArchive size="1.5em" />
          )}
        </button>
      </div>
      <div data-tip="Tags (t)">
        <button aria-label="Tags" onClick={changeTagsItem} type="button">
          <AiOutlineTags size="1.5em" />
        </button>
      </div>
      <div data-tip="Copy Link (l)">
        <button aria-label="Copy Link" onClick={copyLinkItem} type="button">
          <FiLink size="1.5em" />
        </button>
      </div>
      <div data-tip="Share in Whatsapp">
        <WhatsappShareButton
          aria-label="Share on Whatsapp"
          resetButtonStyle={false}
          // title={title}
          separator=":: "
          url={url}
        >
          <RiWhatsappLine size="1.5em" />
        </WhatsappShareButton>
      </div>
      <div data-tip="Share in Telegram">
        <TelegramShareButton
          aria-label="Share on Telegram"
          resetButtonStyle={false}
          // title={title}
          // separator=":: "
          url={url}
        >
          <RiTelegramLine size="1.5em" />
        </TelegramShareButton>
      </div>
      <div data-tip="Open Cache (c)">
        <a href={cacheUrl} rel="noreferrer" target="_blank">
          <RiDeviceRecoverLine size="1.5em" />
        </a>
      </div>
      <div data-tip="Remove (r)">
        <button aria-label="Remove" onClick={deleteItem} type="button">
          <AiOutlineDelete size="1.5em" />
        </button>
      </div>
    </div>
  );
}

export default React.memo(ActionButtons);
