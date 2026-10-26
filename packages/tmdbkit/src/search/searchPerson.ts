import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import type { PagedResults } from "../types/PagedResults.js";
import type { SearchPersonResult } from "./types/SearchPersonResult.js";

export const searchPersonSchema = v.object({
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
 * ### [Search Person](https://developer.themoviedb.org/reference/search-person)
 *
 * **GET** `/search/person`
 *
 * Search for people by name.
 */
export const searchPerson: Fetcher<
  typeof searchPersonSchema,
  PagedResults<SearchPersonResult>
> = async ({ query, params }) => get(`/search/person`, { ...params, query });
