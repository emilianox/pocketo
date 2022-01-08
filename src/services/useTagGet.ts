/* eslint-disable @typescript-eslint/naming-convention */

import { useQuery } from "react-query";

import useNotify from "hooks/useNotify";

interface ResponseGetTagsPocketApi {
  status: number;
  complete: number;
  list: unknown[];
  error?: unknown;
  tags: string[];
  search_meta: {
    search_type: string;
  };
  since: number;
}

// eslint-disable-next-line etc/prefer-interface
type GetPocketTags = (
  onStartNotify: () => void,
  onFinishNotify: () => void
) => Promise<ResponseGetTagsPocketApi>;

const getPocketTags: GetPocketTags = async (onStartNotify, onFinishNotify) => {
  onStartNotify();

  const response = await fetch("/api/items/getTags", {
    method: "GET",
  });

  onFinishNotify();

  return (await response.json()) as ResponseGetTagsPocketApi;
};

export default function useTagGet() {
  const { onStartNotify, onFinishNotify } = useNotify("Loading Tags..", {
    key: "loading-tags",
    preventDuplicate: true,
  });

  return useQuery<ResponseGetTagsPocketApi, Error>(
    "tags",
    async () => await getPocketTags(onStartNotify, onFinishNotify),
    {
      refetchOnWindowFocus: false,
      staleTime: 5000,
    }
  );
}
export type { ResponseGetTagsPocketApi };
