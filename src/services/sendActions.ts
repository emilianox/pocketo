/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */

import type { PocketArticle } from "./useItemsGet";

interface ActionBase {
  item_id: string;
  /** The time the action occurred. */
  time?: string;
}

interface Action_add extends ActionBase {
  action: "add";
  /** A Twitter status id; this is used to show tweet attribution. */
  ref_id?: number;
  /** A comma-delimited list of one or more tags. */
  tags?: string;
  /** The title of the item. */
  title?: string;
  /** The url of the item; provide this only if you do not have an item_id. */
  url?: string;
}

interface Action_archive extends ActionBase {
  action: "archive";
}

interface Action_readd extends ActionBase {
  action: "readd";
}

interface Action_favorite extends ActionBase {
  action: "favorite";
}

interface Action_unfavorite extends ActionBase {
  action: "unfavorite";
}

interface Action_delete extends ActionBase {
  action: "delete";
}

interface Action_tags_add extends ActionBase {
  action: "tags_add";
  /** A comma-delimited list of one or more tags to add. */
  tags: string;
}

interface Action_tags_remove extends ActionBase {
  action: "tags_remove";
  /** A comma-delimited list of one or more tags to add. */
  tags: string;
}

interface Action_tags_replace extends ActionBase {
  action: "tags_replace";
  /** A comma-delimited list of one or more tags to add. */
  tags: string;
}

interface Action_tags_clear extends ActionBase {
  action: "tags_clear";
}

interface Action_tag_rename {
  action: "tag_rename";
  /** The tag name that will be replaced. */
  old_tag: string;
  /** The new tag name that will be added. */
  new_tag: string;
  /** The time the action occurred. */
  time?: string;
}

interface Action_tag_delete {
  action: "tag_delete";
  /** The tag name that will be deleted. */
  tag: string;
  /** The time the action occurred. */
  time?: string;
}

type ArticleAction =
  | Action_add
  | Action_archive
  | Action_delete
  | Action_favorite
  | Action_readd
  | Action_tag_delete
  | Action_tag_rename
  | Action_tags_add
  | Action_tags_clear
  | Action_unfavorite;

type Action = Action_tags_remove | Action_tags_replace | ArticleAction;

type Actions = Action[];

type ArticleActions = ArticleAction[];

const createFavoriteAction = (
  favorite: PocketArticle["favorite"],
  item_id: PocketArticle["item_id"]
): Action_favorite | Action_unfavorite => ({
  action: favorite === "0" ? "favorite" : "unfavorite",
  item_id,
});

const createArchiveAction = (
  item_id: PocketArticle["item_id"]
): Action_archive => ({
  action: "archive",
  item_id,
});

const createDeleteAction = (
  item_id: PocketArticle["item_id"]
): Action_delete => ({
  action: "delete",
  item_id,
});

export { createFavoriteAction, createArchiveAction, createDeleteAction };

export type {
  Actions,
  Action,
  ArticleAction,
  ArticleActions,
  Action_add,
  Action_archive,
  Action_delete,
  Action_favorite,
  Action_readd,
  Action_tag_delete,
  Action_tag_rename,
  Action_tags_add,
  Action_tags_clear,
  Action_tags_remove,
  Action_tags_replace,
  Action_unfavorite,
};
