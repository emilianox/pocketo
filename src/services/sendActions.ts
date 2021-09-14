/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */

import type { PocketArticle } from "./pocketApi";

interface ActionBase {
  item_id: string;
  /** The time the action occurred. */
  time?: string;
}

interface ActionAdd extends ActionBase {
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

interface ActionArchive extends ActionBase {
  action: "archive";
}

interface ActionReadd extends ActionBase {
  action: "readd";
}

interface ActionFavorite extends ActionBase {
  action: "favorite";
}

interface ActionUnfavorite extends ActionBase {
  action: "unfavorite";
}

interface ActionDelete extends ActionBase {
  action: "delete";
}

interface ActionTags_add extends ActionBase {
  action: "tags_add";
  /** A comma-delimited list of one or more tags to add. */
  tags: string;
}

interface ActionTags_remove extends ActionBase {
  action: "tags_remove";
  /** A comma-delimited list of one or more tags to add. */
  tags: string;
}

interface ActionTagsReplace extends ActionBase {
  action: "tags_replace";
  /** A comma-delimited list of one or more tags to add. */
  tags: string;
}

interface ActionTags_clear extends ActionBase {
  action: "tags_clear";
}

interface ActionTag_rename {
  action: "tag_rename";
  /** The tag name that will be replaced. */
  old_tag: string;
  /** The new tag name that will be added. */
  new_tag: string;
  /** The time the action occurred. */
  time?: string;
}

interface ActionTag_delete {
  action: "tag_delete";
  /** The tag name that will be deleted. */
  tag: string;
  /** The time the action occurred. */
  time?: string;
}

type ArticleAction =
  | ActionAdd
  | ActionArchive
  | ActionDelete
  | ActionFavorite
  | ActionReadd
  | ActionTags_add
  | ActionTags_clear
  | ActionTags_remove
  | ActionTagsReplace
  | ActionUnfavorite;

type Action = ActionTag_delete | ActionTag_rename | ArticleAction;

type Actions = Action[];

type ArticleActions = ArticleAction[];

const createFavoriteAction = (
  favorite: PocketArticle["favorite"],
  item_id: PocketArticle["item_id"]
): ActionFavorite | ActionUnfavorite => ({
  action: favorite === "0" ? "favorite" : "unfavorite",
  item_id,
});

const createArchiveAction = (
  item_id: PocketArticle["item_id"]
): ActionArchive => ({
  action: "archive",
  item_id,
});

const createUnarchiveAction = (
  item_id: PocketArticle["item_id"]
): ActionReadd => ({
  action: "readd",
  item_id,
});

const createDeleteAction = (
  item_id: PocketArticle["item_id"]
): ActionDelete => ({
  action: "delete",
  item_id,
});

const createTagReplaceAction = (
  item_id: PocketArticle["item_id"],
  tags: string
): ActionTagsReplace => ({
  action: "tags_replace",
  item_id,
  tags,
});

export {
  createFavoriteAction,
  createArchiveAction,
  createDeleteAction,
  createTagReplaceAction,
  createUnarchiveAction,
};

export type {
  Actions,
  Action,
  ArticleAction,
  ArticleActions,
  ActionAdd,
  ActionArchive,
  ActionDelete,
  ActionFavorite,
  ActionReadd,
  ActionTag_delete,
  ActionTag_rename,
  ActionTags_add,
  ActionTags_clear,
  ActionTags_remove,
  ActionTagsReplace,
  ActionUnfavorite,
};
