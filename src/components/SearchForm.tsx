/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { DeepReadonly } from "ts-essentials/dist/types";

import type {
  SearchParameters,
  SearchParametersFavorite,
  SearchParametersSearch,
} from "services/useItemsGet";

interface SearchParametersAll
  extends Omit<SearchParametersFavorite, "favorite">,
    SearchParametersSearch {
  // eslint-disable-next-line @typescript-eslint/naming-convention
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

  return (
    <form onSubmit={handleSubmit(onParse)}>
      <label>
        <input
          {...register("search")}
          className="input input-bordered"
          disabled={isFavorite}
          placeholder="Search..."
        />
      </label>
      <label>
        <select
          {...register("state")}
          className="w-full max-w-xs select select-bordered"
        >
          <option value="unread">Unread</option>
          <option value="all">All</option>
          <option value="archive">Archive</option>
        </select>
      </label>
      <label className="cursor-pointer">
        <span className="label-text">Only Favorites</span>
        <input
          {...register("favorite")}
          className="toggle toggle-primary"
          type="checkbox"
        />
      </label>
      <label>
        <div>TAGS(comming soon)</div>
      </label>
      <label>
        <div>content(comming soon)</div>
      </label>
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
      <label>
        <div>domain(comming soon)</div>
      </label>
      <label>
        <div>since(comming soon)</div>
      </label>

      <input type="submit" />
    </form>
  );
}
