/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

// List of Actions
// Basic Actions
// add - Add a new item to the user's list
// archive - Move an item to the user's archive
// readd - Re-add (unarchive) an item to the user's list
// favorite - Mark an item as a favorite
// unfavorite - Remove an item from the user's favorites
// delete - Permanently remove an item from the user's account
// Tagging Actions
// tags_add - Add one or more tags to an item
// tags_remove - Remove one or more tags from an item
// tags_replace - Replace all of the tags for an item with one or more provided tags
// tags_clear - Remove all tags from an item
// tag_rename - Rename a tag; this affects all items with this tag
// tag_delete - Delete a tag; this affects all items with this tag

import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const accessToken = process.env.POCKET_ACCESS_TOKEN!;
  const consumerKey = process.env.POCKET_CONSUMER_KEY!;

  const actions =
    typeof req.query.actions === "string" ? req.query.actions : "";

  // const actions = JSON.stringify([
  //   {
  //     action: "favorite",
  //     item_id: "3065948353",
  //   },
  // ]);
  const response = await fetch(
    `https://getpocket.com/v3/send?access_token=${accessToken}&consumer_key=${consumerKey}&actions=${actions}`
  );
  const jsonData = await response.json();

  res.status(200).json(jsonData);
};
