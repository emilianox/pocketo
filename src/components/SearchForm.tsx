/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react-perf/jsx-no-new-object-as-prop */
/* eslint-disable no-console */
/* eslint-disable react/forbid-component-props */
/* eslint-disable react/jsx-props-no-spreading */
import { useCallback } from "react";

import MixedTags from "@yaireo/tagify/dist/react.tagify";
import { useForm } from "react-hook-form";

import type {
  SearchParameters,
  SearchParametersFavorite,
  SearchParametersSearch,
} from "services/useItemsGet";

import type { ReactTagifySettings } from "@yaireo/tagify/dist/react.tagify";
import type { SubmitHandler } from "react-hook-form";
import type { DeepReadonly } from "ts-essentials/dist/types";

interface SearchParametersAll
  extends Omit<SearchParametersFavorite, "favorite">,
    SearchParametersSearch {
  favorite: boolean;
}

interface SearchFormProps {
  onSubmit: SubmitHandler<SearchParameters>;
}

export default function SearchForm({
  onSubmit,
}: DeepReadonly<SearchFormProps>) {
  const { register, handleSubmit, watch } = useForm<SearchParametersAll>();

  const isFavorite = watch("favorite");

  const onParse: SubmitHandler<SearchParametersAll> = (data) => {
    const toOmit = data.favorite ? "search" : "favorite";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [toOmit]: remove, ...parameters } = data;

    if (toOmit === "search") {
      // eslint-disable-next-line fp/no-mutation
      (parameters as SearchParametersFavorite).favorite = (
        parameters as SearchParametersFavorite
      ).favorite
        ? "1"
        : "0";
    }

    onSubmit(parameters);
  };
  const settings: ReactTagifySettings = {
    // eslint-disable-next-line no-inline-comments, line-comment-position
    pattern: /#/u, // <- must define "patten" in mixed mode
    mode: "mix",

    dropdown: {
      enabled: true,
      position: "text",
      highlightFirst: true,
    },

    whitelist: [
      // { id: 109, value: "Mr. Mackey", title: "M'Kay" },
      "test",
      "test2",
      "zzzz",
    ],
  };

  const onChange = useCallback((event) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log("CHANGED:", event.detail.value);
  }, []);

  return (
    <form
      className="flex-row justify-center items-center p-3 form-control"
      onSubmit={handleSubmit(onParse)}
    >
      <div className="flex">
        <select
          {...register("state")}
          className="rounded-r-none focus:ring-0 btn btn-primary"
        >
          <option value="unread">Unread</option>
          <option value="all">All</option>
          <option value="archive">Archive</option>
        </select>
        <MixedTags
          // autoFocus
          className="mixedTags"
          onChange={onChange}
          readonly={isFavorite}
          settings={settings}
          value={`This is a textarea which `}
        />
      </div>
      {/* <label className="label">
        <input
          {...register("search")}
          className="input input-bordered"
          disabled={isFavorite}
          placeholder="Search..."
        />
      </label> */}

      <label className="cursor-pointer">
        <span className="label-text">Only Favorites</span>
        <input
          {...register("favorite")}
          className="toggle toggle-primary"
          type="checkbox"
        />
      </label>
      {/* <label>
        <div>TAGS(comming soon)</div>
      </label> */}
      {/* <label>
        <div>content(comming soon)</div>
      </label> */}
      <label>
        <select
          {...register("sort")}
          className="w-full max-w-xs select select-bordered"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="site">Url</option>
          <option value="title">Title</option>
        </select>
      </label>
      {/* <label>
        <div>domain(comming soon)</div>
      </label> */}
      {/* <label>
        <div>since(comming soon)</div>
      </label> */}

      <button className="btn btn-primary" type="submit">
        Search
      </button>
    </form>
  );
}
