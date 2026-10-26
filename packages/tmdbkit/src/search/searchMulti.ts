import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import type { PagedResults } from "../types/PagedResults.js";
import type { SearchMultiResult } from "./types/SearchMultiResult.js";

export const searchMultiSchema = v.object({
  query: v.string(),
  params: v.exactOptional(
    v.partial(
      v.object({
        includeAdult: v.boolean(),
        language: v.string(),
        page: v.number()
      })
    )
  )
});

/**
 * ### [Search Multi](https://developer.themoviedb.org/reference/search-multi)
 *
 * **GET** `/search/multi`
 *
 * Search for movies, TV shows, and people in a single request.
 */
export const searchMulti: Fetcher<
  typeof searchMultiSchema,
  PagedResults<SearchMultiResult>
> = async ({ query, params }) => get(`/search/multi`, { ...params, query });
