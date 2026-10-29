import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer, tmdbId } from "../validations/integer.js";
import type { Reviews } from "../review/types/Review.js";

export const getTvSeriesReviewsSchema = v.object({
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
 * ### [Reviews](https://developer.themoviedb.org/reference/tv-series-reviews)
 *
 * **GET** `/tv/{series_id}/reviews`
 */
export const getTvSeriesReviews: Fetcher<
  typeof getTvSeriesReviewsSchema,
  Reviews
> = async ({ seriesId, params }, options) =>
  get(`/tv/${seriesId}/reviews`, params, options);
