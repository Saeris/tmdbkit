import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer } from "../validations/integer.js";
import type { PagedKeywordResults } from "../types/Keyword.js";

export const searchKeywordsSchema = v.object({
  query: v.string(),
  params: v.exactOptional(
    v.partial(
      v.object({
        page: integer
      })
    )
  )
});

/**
 * ### [Keyword](https://developer.themoviedb.org/reference/search-keyword)
 *
 * **GET** `/search/keyword`
 */
export const searchKeywords: Fetcher<
  typeof searchKeywordsSchema,
  PagedKeywordResults
> = async ({ query, params }, options) =>
  get(`/search/keyword`, { ...params, query }, options);
