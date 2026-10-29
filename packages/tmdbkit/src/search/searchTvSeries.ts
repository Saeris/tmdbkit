import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer } from "../validations/integer.js";
import type { PagedTvResults } from "../tv/types/TvListItem.js";

export const searchTvSeriesSchema = v.object({
  query: v.string(),
  params: v.exactOptional(
    v.partial(
      v.object({
        /** Search only the first air date. Valid values are: 1000..9999 */
        firstAirDateYear: integer,
        includeAdult: v.boolean(),
        language: v.string(),
        page: integer,
        /** Search the first air date and all episode air dates. Valid values are: 1000..9999 */
        year: integer
      })
    )
  )
});

/**
 * ### [TV](https://developer.themoviedb.org/reference/search-tv)
 *
 * **GET** `/search/tv`
 */
export const searchTvSeries: Fetcher<
  typeof searchTvSeriesSchema,
  PagedTvResults
> = async ({ query, params }, options) =>
  get(`/search/tv`, { ...params, query }, options);
