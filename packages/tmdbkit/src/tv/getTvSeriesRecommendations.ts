import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer, tmdbId } from "../validations/integer.js";
import type { PagedTvMediaResults } from "./types/TvListItem.js";

export const getTvSeriesRecommendationsSchema = v.object({
  seriesId: tmdbId,
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
 * ### [Recommendations](https://developer.themoviedb.org/reference/tv-series-recommendations)
 *
 * **GET** `/tv/{series_id}/recommendations`
 */
export const getTvSeriesRecommendations: Fetcher<
  typeof getTvSeriesRecommendationsSchema,
  PagedTvMediaResults
> = async ({ seriesId, params }, options) =>
  get(`/tv/${seriesId}/recommendations`, params, options);
