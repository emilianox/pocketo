/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/forbid-component-props */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react-perf/jsx-no-new-function-as-prop */
import { memo, useEffect, useMemo, useState } from "react";

import { FaRegTimesCircle } from "@react-icons/all-files/fa/FaRegTimesCircle";
import { FaSpinner } from "@react-icons/all-files/fa/FaSpinner";
import { useForm } from "react-hook-form";
import { MentionsInput, Mention } from "react-mentions";

import type {
  SearchParameters,
  SearchParametersFavorite,
  SearchParametersSearch,
} from "services/pocketApi";

import type { SubmitHandler } from "react-hook-form";
import type { Tag } from "react-tag-input";
import type { DeepReadonly } from "ts-essentials/dist/types";

interface SearchParametersAll
  extends Omit<SearchParametersFavorite, "favorite">,
    Omit<SearchParametersSearch, "search"> {
  favorite: boolean;
  search?: string;
}

interface SearchFormProps {
  onSubmit: SubmitHandler<SearchParameters>;
  suggestions: Tag[];
  totalResults: number;
  isLoading: boolean;
}

export default memo(function SearchForm({
  onSubmit,
  suggestions,
  isLoading,
  totalResults,
}: DeepReadonly<SearchFormProps>) {
  const { reset, register, handleSubmit, watch, setValue } =
    useForm<SearchParametersAll>();
  const [inputValue, setInputValue] = useState<string>("");

  const isFavorite = watch("favorite");

  const onParse: SubmitHandler<SearchParametersAll> = (data) => {
    // console.log("onparse", data);

    const toOmit = data.favorite ? "search" : "favorite";

    // this is for some search restriction on pocket api
    const toChange =
      // eslint-disable-next-line no-negated-condition
      toOmit !== "favorite"
        ? { favorite: data.favorite ? "1" : "0" }
        : {
            search: data.search?.replaceAll("(#)", "#").trim(),
          };

    const { [toOmit]: remove, ...parameters } = { ...data, ...toChange };

    onSubmit(parameters);
  };

  useEffect(() => {
    register("search");
    // register("lastName");
  }, [register]);

  const searchSuggestions = useMemo(
    () =>
      suggestions.map((sug) => ({
        id: sug.id,
        display: sug.text,
      })),
    [suggestions]
  );

  return (
    <div className="flex justify-center">
      <form
        className=" flex justify-center p-3 m-auto w-8/12 form-control"
        onSubmit={handleSubmit(onParse)}
      >
        <div className="flex mb-2">
          <MentionsInput
            a11ySuggestionsListLabel="Suggested mentions"
            autoComplete="off"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            className="pocketoMixedTags"
            disabled={isFavorite}
            name="search"
            onChange={(event, value) => {
              // searchRegister.onChange(event);
              setInputValue(value);
              setValue("search", value);
            }}
            placeholder={"Search using text and '#tag'"}
            singleLine
            value={inputValue}
          >
            <Mention
              appendSpaceOnAdd
              data={
                searchSuggestions as unknown as {
                  id: string;
                  display: string;
                }[]
              }
              displayTransform={(id, display) => `#${display}`}
              // renderSuggestion={renderTagSuggestion}
              // markup="#__id__"
              markup="(#)__id__"
              trigger="#"
            />
          </MentionsInput>
          <select
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
              {isLoading && <FaSpinner className="animate-spin" />}
              <div>{!isLoading && `${totalResults} results.`}</div>
            </div>
            <div className="flex space-x-1">
              <button
                className="space-x-1 badge badge-primary badge-outline"
                onClick={() => {
                  reset();
                  setInputValue("");
                }}
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
                {...register("favorite")}
                className="mr-2 toggle toggle-primary"
                type="checkbox"
              />
              <span className="label-text">Favorites</span>
            </label>
            <select
              {...register("sort")}
              className="pr-8 w-full max-w-max focus:ring-1 select select-sm"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="site">Url</option>
              <option value="title">Title</option>
            </select>
            {/* <label>
            <div>domain(comming soon)</div>
                    </label> */}
            {/* <label>
            <div>since(comming soon)</div>
                    </label> */}
            {/* <label>
            <div>content(comming soon)</div>
             </label> */}
          </div>
          {/* <div className=" flex btn-group disabled">
            <button
              className="btn btn-sm btn-disabled bg-primary"
              type="button"
            >
              <FaList />
            </button>
            <button className="btn btn-sm btn-disabled" type="button">
              <BiGridSmall size="26" />
            </button>
          </div> */}
        </div>
      </form>
    </div>
  );
});
