/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */

import { useQuery } from "react-query";

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

const getPocketTags = async () =>
  await fetch(`/api/items/getTags`, {
    method: "GET",
  }).then(async (response) => {
    return (await response.json()) as ResponseGetTagsPocketApi;
  });

export default function useTagGet() {
  return useQuery<ResponseGetTagsPocketApi, Error>(
    "tags",
    async () => await getPocketTags()
  );
}
export type { ResponseGetTagsPocketApi };
