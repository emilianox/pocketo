/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
//   console.log("res", res);
//
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
// unread = only return unread items (default)
// archive = only return archived items
// all = return both unread and archived items
// favorite
// 0 = only return un-favorited items
// 1 = only return favorited items
// tag
// tag_name = only return items tagged with tag_name
// _untagged_ = only return untagged items
// contentType
// article = only return articles
// video = only return videos or articles with embedded videos
// image = only return images
// sort
// newest = return items in order of newest to oldest
// oldest = return items in order of oldest to newest
// title = return items in order of title alphabetically
// site = return items in order of url alphabetically
// detailType
// simple = return basic information about each item, including title, url, status, and more
// complete = return all data about each item, including tags, images, authors, videos, and more
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // console.log("req.query", req.query);

  const accessToken = process.env.POCKET_ACCESS_TOKEN!;
  const consumerKey = process.env.POCKET_CONSUMER_KEY!;
  const count = typeof req.query.count === "string" ? req.query.count : "10";
  const offset = typeof req.query.offset === "string" ? req.query.offset : "0";
  const detailType = "complete";
  // console.log(
  //   `https://getpocket.com/v3/get?access_token=${accessToken}&consumer_key=${consumerKey}&count=${count}&offset=${offset}&detailType=${detailType}`
  // );

  const response = await fetch(
    `https://getpocket.com/v3/get?access_token=${accessToken}&consumer_key=${consumerKey}&count=${count}&offset=${offset}&detailType=${detailType}`
  );
  const jsonData = await response.json();

  res.status(200).json(jsonData);
};
