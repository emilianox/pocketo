/* eslint-disable max-len */
/* eslint-disable complexity */
/* eslint-disable max-statements */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

// state	string		See below for valid values
// favorite	0 or 1		See below for valid values
// tag	string		See below for valid values
// contentType	string		See below for valid values
// sort	string		See below for valid values
// detailType	string		See below for valid values
// search	string		Only return items whose title or url contain the search string
// domain	string		Only return items from a particular domain
// since	timestamp		Only return items modified since the given since unix timestamp

// count	integer		Only return count number of items
// offset	integer		Used only with count; start returning from offset position of results

// state
//   unread = only return unread items (default)
//   archive = only return archived items
//   all = return both unread and archived items
// favorite
//   0 = only return un-favorited items
//   1 = only return favorited items
// tag
//   tag_name = only return items tagged with tag_name
//   _untagged_ = only return untagged items
// contentType
//   article = only return articles
//   video = only return videos or articles with embedded videos
//   image = only return images
// sort
//   newest = return items in order of newest to oldest
//   oldest = return items in order of oldest to newest
//   title = return items in order of title alphabetically
//   site = return items in order of url alphabetically
// detailType
//   simple = return basic information about each item, including title, url, status, and more
//   complete = return all data about each item, including tags, images, authors, videos, and more
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const qy = req.query;

  const authKeys = `access_token=${process.env
    .POCKET_ACCESS_TOKEN!}&consumer_key=${process.env.POCKET_CONSUMER_KEY!}`;
  const total = "&total=1";

  const state = typeof qy.state === "string" ? `&state=${qy.state}` : "";
  const favorite =
    typeof qy.favorite === "string" ? `&favorite=${qy.favorite}` : "";
  const tag = typeof qy.tag === "string" ? `&tag=${qy.tag}` : "";
  const contentType =
    typeof qy.contentType === "string" ? `&contentType=${qy.contentType}` : "";
  const sort = typeof qy.sort === "string" ? `&sort=${qy.sort}` : "";
  const detailType = "&detailType=complete";
  const search = typeof qy.search === "string" ? `&search=${qy.search}` : "";
  const domain = typeof qy.domain === "string" ? `&domain=${qy.domain}` : "";
  const since = typeof qy.since === "string" ? `&since=${qy.since}` : "";
  const count = typeof qy.count === "string" ? `&count=${qy.count}` : "10";
  const offset = typeof qy.offset === "string" ? `&offset=${qy.offset}` : "0";

  const response = await fetch(
    `https://getpocket.com/v3/get?${authKeys}${count}${offset}${detailType}${total}${state}${favorite}${tag}${contentType}${sort}${search}${domain}${since}`
  );
  const jsonData = await response.json();

  res.status(200).json(jsonData);
};
