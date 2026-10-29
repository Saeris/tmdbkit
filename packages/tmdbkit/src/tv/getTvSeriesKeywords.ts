import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { TvKeywords } from "./types/TvKeywords.js";

export const getTvSeriesKeywordsSchema = v.object({
  seriesId: tmdbId
});

/**
 * ### [Keywords](https://developer.themoviedb.org/reference/tv-series-keywords)
 *
 * **GET** `/tv/{series_id}/keywords`
 */
export const getTvSeriesKeywords: Fetcher<
  typeof getTvSeriesKeywordsSchema,
  TvKeywords
> = async ({ seriesId }, options) =>
  get(`/tv/${seriesId}/keywords`, undefined, options);
