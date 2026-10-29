import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer } from "../validations/integer.js";
import type { PagedTvResults } from "./types/TvListItem.js";

export const getSimilarTvSeriesSchema = v.object({
  seriesId: v.string(),
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
 * ### [Similar](https://developer.themoviedb.org/reference/tv-series-similar)
 *
 * **GET** `/tv/{series_id}/similar`
 */
export const getSimilarTvSeries: Fetcher<
  typeof getSimilarTvSeriesSchema,
  PagedTvResults
> = async ({ seriesId, params }, options) =>
  get(`/tv/${encodeURIComponent(seriesId)}/similar`, params, options);
