import { memo, useCallback, useEffect, useMemo } from "react";

import { FaRegTimesCircle } from "@react-icons/all-files/fa/FaRegTimesCircle";
import { FaSpinner } from "@react-icons/all-files/fa/FaSpinner";
import clsx from "clsx";
import { dissoc } from "ramda";
import { useForm, type SubmitHandler } from "react-hook-form";
import { MentionsInput, Mention } from "react-mentions";

import type {
  SearchParameters,
  SearchParametersFavorite,
  SearchParametersSearch,
} from "services/pocketApi";

import styles from "./SearchForm.module.scss";

import type { Tag } from "react-tag-input";
import type { DeepReadonly } from "ts-essentials/dist/types";

interface SearchParametersAll
  extends Omit<SearchParametersFavorite, "favorite">,
    Omit<SearchParametersSearch, "search"> {
  // API defined
  // eslint-disable-next-line @typescript-eslint/naming-convention
  favorite: boolean;
  search?: string;
}

interface SearchFormProps {
  onSubmit: SubmitHandler<SearchParameters>;
  suggestions: Tag[];
  totalResults: number;
  isLoading: boolean;
  searchParameters: SearchParameters;
}

function parseToForm(
  parameters: DeepReadonly<SearchParameters>
): SearchParametersAll {
  // API defined
  /* eslint-disable @typescript-eslint/naming-convention */
  const favorite =
    "favorite" in parameters ? parameters.favorite === "1" : false;
  const search =
    "search" in parameters ? parameters.search?.replaceAll("#", "(#)") : "";

  return { ...parameters, favorite, search };
  /* eslint-enable @typescript-eslint/naming-convention */
}

// eslint-disable-next-line max-statements
export default memo(function SearchForm({
  onSubmit,
  searchParameters,
  suggestions,
  isLoading,
  totalResults,
}: DeepReadonly<SearchFormProps>) {
  const { reset, register, handleSubmit, watch, setValue } =
    useForm<SearchParametersAll>();

  useEffect(() => {
    reset(parseToForm(searchParameters));
  }, [reset, searchParameters]);

  const isFavorite = watch("favorite");

  const onParse: SubmitHandler<SearchParametersAll> = (data) => {
    const toOmit = data.favorite ? "search" : "favorite";

    // this is for some search restriction on pocket api
    const toChange =
      toOmit === "favorite"
        ? {
            search: data.search?.replaceAll("(#)", "#").trim(),
          }
        : { favorite: data.favorite ? "1" : "0" };

    const parameters = dissoc(toOmit, { ...data, ...toChange });

    onSubmit(parameters);
  };

  useEffect(() => {
    register("search");
  }, [register]);

  const searchSuggestions = useMemo(
    () =>
      suggestions.map((sug) => ({
        id: sug.id,
        display: sug.text,
      })),
    [suggestions]
  );

  const onChange = useCallback(
    function onChange(event: unknown, value: string) {
      setValue("search", value);
    },
    [setValue]
  );

  const displayTransform = useCallback((id, display) => `#${display}`, []);

  const clickReset = useCallback(() => {
    reset({});
  }, [reset]);

  const submit = handleSubmit(onParse);

  return (
    <form
      className="flex justify-center py-3 w-8/12 form-control"
      // eslint-disable-next-line no-warning-comments
      // FIXME: the library handleSubmit is a promise
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={submit}
    >
      <div className="flex mb-2">
        <MentionsInput
          a11ySuggestionsListLabel="Suggested mentions"
          autoComplete="off"
          // want autofocus
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          // lib edit required
          // eslint-disable-next-line react/forbid-component-props
          className={clsx("pocketoMixedTags", styles.pocketoMixedTags)}
          disabled={isFavorite}
          name="search"
          onChange={onChange}
          placeholder={"Search using text and '#tag'"}
          singleLine
          value={watch("search")}
        >
          <Mention
            appendSpaceOnAdd
            data={searchSuggestions}
            displayTransform={displayTransform}
            markup="(#)__id__"
            trigger="#"
          />
        </MentionsInput>
        <select
          // lib required
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...register("state")}
          className="rounded-none focus:ring-1 btn-outline select select-bordered select-primary"
        >
          <option value="unread">Unread</option>
          <option value="all">All</option>
          <option value="archive">Archive</option>
        </select>
        <button className="rounded-l-none btn btn-primary" type="submit">
          Search
        </button>
      </div>
      <div className=" flex justify-between ml-4">
        <div className="flex items-center space-x-2">
          <div className=" flex items-center space-x-1">
            {/* css required */}
            {/* eslint-disable-next-line react/forbid-component-props */}
            {isLoading && <FaSpinner className="animate-spin" />}
            <div>{!isLoading && `${totalResults} results.`}</div>
          </div>
          <div className="flex space-x-1">
            <button
              className="space-x-1 badge badge-primary badge-outline"
              onClick={clickReset}
              type="button"
            >
              <div>clear</div>
              <FaRegTimesCircle />
            </button>
          </div>
        </div>
        <div className="flex space-x-2">
          <label className="flex items-center cursor-pointer">
            <input
              // lib required
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...register("domain")}
              className="w-40 input input-sm input-bordered"
              placeholder="webpage.domain"
              type="text"
            />
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              // lib required
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...register("favorite")}
              className="mr-2 toggle toggle-primary"
              type="checkbox"
            />
            <span className="label-text">Favorites</span>
          </label>
          <select
            // lib required
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...register("sort")}
            className="pr-8 w-full max-w-max focus:ring-1 select select-sm"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="site">Url</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>
    </form>
  );
});
