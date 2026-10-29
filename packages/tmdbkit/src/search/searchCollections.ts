import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer } from "../validations/integer.js";
import type { PagedCollectionResults } from "../collection/types/CollectionListItem.js";

export const searchCollectionsSchema = v.object({
  query: v.string(),
  params: v.exactOptional(
    v.partial(
      v.object({
        includeAdult: v.boolean(),
        language: v.string(),
        page: integer,
        region: v.string()
      })
    )
  )
});

/**
 * ### [Collection](https://developer.themoviedb.org/reference/search-collection)
 *
 * **GET** `/search/collection`
 */
export const searchCollections: Fetcher<
  typeof searchCollectionsSchema,
  PagedCollectionResults
> = async ({ query, params }, options) =>
  get(`/search/collection`, { ...params, query }, options);
