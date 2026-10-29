import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer } from "../validations/integer.js";
import type { PagedMediaResults } from "../types/MediaListItem.js";

export const searchMultiSchema = v.object({
  query: v.string(),
  params: v.exactOptional(
    v.partial(
      v.object({
        includeAdult: v.boolean(),
        language: v.string(),
        page: integer
      })
    )
  )
});

/**
 * ### [Multi](https://developer.themoviedb.org/reference/search-multi)
 *
 * **GET** `/search/multi`
 */
export const searchMulti: Fetcher<
  typeof searchMultiSchema,
  PagedMediaResults
> = async ({ query, params }, options) =>
  get(`/search/multi`, { ...params, query }, options);
