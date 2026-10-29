import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { ContentRatings } from "./types/ContentRatings.js";

export const getTvSeriesContentRatingsSchema = v.object({
  seriesId: tmdbId
});

/**
 * ### [Content Ratings](https://developer.themoviedb.org/reference/tv-series-content-ratings)
 *
 * **GET** `/tv/{series_id}/content_ratings`
 */
export const getTvSeriesContentRatings: Fetcher<
  typeof getTvSeriesContentRatingsSchema,
  ContentRatings
> = async ({ seriesId }, options) =>
  get(`/tv/${seriesId}/content_ratings`, undefined, options);
