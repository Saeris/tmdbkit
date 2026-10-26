import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import type { PagedResults } from "../types/PagedResults.js";
import type { SearchTvResult } from "./types/SearchTvResult.js";

export const searchTvSchema = v.object({
  query: v.string(),
  params: v.exactOptional(
    v.partial(
      v.object({
        firstAirDateYear: v.number(),
        includeAdult: v.boolean(),
        language: v.string(),
        page: v.number(),
        year: v.number()
      })
    )
  )
});

/**
 * ### [Search TV](https://developer.themoviedb.org/reference/search-tv)
 *
 * **GET** `/search/tv`
 *
 * Search for TV shows by name.
 */
export const searchTv: Fetcher<
  typeof searchTvSchema,
  PagedResults<SearchTvResult>
> = async ({ query, params }) => get(`/search/tv`, { ...params, query });
