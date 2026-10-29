import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer } from "../validations/integer.js";
import type { PagedTvResults } from "./types/TvListItem.js";

export const getPopularTvSeriesSchema = v.object({
  params: v.exactOptional(
    v.partial(
      v.object({
        language: v.string(),
        page: integer
      })
    )
  )
});

/**
 * ### [Popular](https://developer.themoviedb.org/reference/tv-series-popular-list)
 *
 * **GET** `/tv/popular`
 */
export const getPopularTvSeries: Fetcher<
  typeof getPopularTvSeriesSchema,
  PagedTvResults
> = async ({ params }, options) => get(`/tv/popular`, params, options);
