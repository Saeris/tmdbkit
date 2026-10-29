import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer } from "../validations/integer.js";
import type { PagedTvResults } from "./types/TvListItem.js";

export const getTopRatedTvSeriesSchema = v.object({
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
 * ### [Top Rated](https://developer.themoviedb.org/reference/tv-series-top-rated-list)
 *
 * **GET** `/tv/top_rated`
 */
export const getTopRatedTvSeries: Fetcher<
  typeof getTopRatedTvSeriesSchema,
  PagedTvResults
> = async ({ params }, options) => get(`/tv/top_rated`, params, options);
