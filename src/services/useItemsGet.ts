/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */

import { identity, pickBy } from "ramda";
import { useInfiniteQuery } from "react-query";

import useNotify from "hooks/useNotify";

import type { DeepReadonly } from "ts-essentials/dist/types";

interface Searchmeta {
  search_type: string;
}

interface Video {
  item_id: string;
  video_id: string;
  src: string;
  width: string;
  height: string;
  type: string;
  vid: string;
  length: string;
}

type Videos = Record<string, Video>;

interface Domainmetadata {
  name: string;
  logo: string;
  greyscale_logo: string;
}

interface Image {
  item_id: string;
  image_id?: string;
  src: string;
  width: string;
  height: string;
  credit?: string;
  caption?: string;
}

interface Author {
  item_id: string;
  author_id: string;
  name: string;
  url: string;
}

interface Tag {
  item_id: string;
  tag: string;
}

type Authors = Record<string, Author>;

type Images = Record<string, Image>;

type Tags = Record<string, Tag>;

/** 0 if false 1 if true */
type pocketBoolean = "0" | "1";

interface PocketArticle {
  item_id: string;
  resolved_id: string;
  given_url: string;
  given_title: string;
  favorite: pocketBoolean;
  /** 1 if the item is archived - 2 if the item should be deleted */
  status: "0" | "1" | "2";
  time_added: string;
  time_updated: string;
  time_read: string;
  time_favorited: string;
  sort_id: number;
  resolved_title: string;
  resolved_url: string;
  excerpt: string;
  is_article: pocketBoolean;
  is_index: string;
  /** if the item has videos in it - 2 if the item is a video  */
  has_video: "0" | "1" | "2";
  /** 1 if the item has images in it - 2 if the item is an image */
  has_image: "0" | "1" | "2";
  word_count: string;
  lang: string;
  top_image_url: string;
  listen_duration_estimate: number;
  time_to_read?: number;
  amp_url?: string;
  tags?: Tags;
  authors?: Authors;
  image?: Image;
  images?: Images;
  videos?: Videos;
  domain_metadata?: Domainmetadata;
}

type ListPocketArticle = Record<string, PocketArticle>;

interface ResponseGetPocketApi {
  status: number;
  complete: number;
  list: ListPocketArticle;
  error?: unknown;
  search_meta: Searchmeta;
  since: number;
}

interface SearchParametersBase {
  state?: "all" | "archive" | "unread";
  tag?: string | "_untagged_";
  contentType?: "article" | "image" | "video";
  sort?: "newest" | "oldest" | "site" | "title";
  domain?: string;
  since?: string;
  count: number;
  offset: number;
}

interface SearchParametersFavorite extends SearchParametersBase {
  favorite?: "0" | "1";
}

interface SearchParametersSearch extends SearchParametersBase {
  search?: string;
}

type SearchParameters = SearchParametersFavorite | SearchParametersSearch;

type GetPocketArticles = (
  searchParameters: DeepReadonly<SearchParameters>,
  onStartNotify: () => void,
  onFinishNotify: () => void
) => Promise<ResponseGetPocketApi>;

const getPocketArticles: GetPocketArticles = async (
  searchParameters,
  onStartNotify,
  onFinishNotify
) => {
  const parsed = pickBy<Record<string, string>, Record<string, string>>(
    identity,
    {
      ...searchParameters,
      count: searchParameters.count.toString(),
      offset: searchParameters.offset.toString(),
    }
  );

  onStartNotify();

  onStartNotify();

  const response = await fetch(
    `/api/items/get?${new URLSearchParams(parsed).toString()}`
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  onFinishNotify();

  return (await response.json()) as ResponseGetPocketApi;
};

type pageParameters = DeepReadonly<{
  pageParam?: SearchParameters | undefined;
}>;

const itemPerRequest = 30;

export default function useItemsGet(
  searchParameters: DeepReadonly<SearchParameters>
) {
  const { onStartNotify, onFinishNotify } = useNotify("Loading..", {
    key: "loading",
    preventDuplicate: true,
  });

  return useInfiniteQuery(
    ["items", searchParameters],
    async ({ pageParam: pageParameter }: pageParameters) => {
      const searchParametersEdited =
        pageParameter === undefined
          ? { ...searchParameters, offset: 0, count: itemPerRequest }
          : { ...searchParameters, ...pageParameter };

      return await getPocketArticles(
        searchParametersEdited,
        onStartNotify,
        onFinishNotify
      );
    },
    {
      notifyOnChangeProps: ["data", "error"],
      // eslint-disable-next-line no-warning-comments
      // FIXME: in production
      refetchOnWindowFocus: false,
      staleTime: 5000,

      getNextPageParam: (lastPage, allPages) => {
        return {
          count: itemPerRequest,
          offset: allPages.length * itemPerRequest,
        };
      },
    }
  );
}
export type {
  PocketArticle,
  ResponseGetPocketApi,
  SearchParameters,
  SearchParametersFavorite,
  SearchParametersSearch,
};
