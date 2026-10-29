import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import type { PagedTvMediaResults } from "../tv/types/TvListItem.js";

export const getTrendingTvSeriesSchema = v.object({
  timeWindow: v.picklist(["day", "week"]),
  params: v.exactOptional(
    v.partial(
      v.object({
        /** `ISO-639-1`-`ISO-3166-1` code */
        language: v.string()
      })
    )
  )
});

/**
 * ### [TV](https://developer.themoviedb.org/reference/trending-tv)
 *
 * **GET** `/trending/tv/{time_window}`
 */
export const getTrendingTvSeries: Fetcher<
  typeof getTrendingTvSeriesSchema,
  PagedTvMediaResults
> = async ({ timeWindow, params }, options) =>
  get(`/trending/tv/${encodeURIComponent(timeWindow)}`, params, options);
