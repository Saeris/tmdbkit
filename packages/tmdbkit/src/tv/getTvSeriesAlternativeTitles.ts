import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { TvAlternativeTitles } from "./types/TvAlternativeTitles.js";

export const getTvSeriesAlternativeTitlesSchema = v.object({
  seriesId: tmdbId
});

/**
 * ### [Alternative Titles](https://developer.themoviedb.org/reference/tv-series-alternative-titles)
 *
 * **GET** `/tv/{series_id}/alternative_titles`
 */
export const getTvSeriesAlternativeTitles: Fetcher<
  typeof getTvSeriesAlternativeTitlesSchema,
  TvAlternativeTitles
> = async ({ seriesId }, options) =>
  get(`/tv/${seriesId}/alternative_titles`, undefined, options);
