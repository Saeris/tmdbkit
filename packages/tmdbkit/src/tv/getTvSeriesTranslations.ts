import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { TvTranslations } from "./types/TvTranslations.js";

export const getTvSeriesTranslationsSchema = v.object({
  seriesId: tmdbId
});

/**
 * ### [Translations](https://developer.themoviedb.org/reference/tv-series-translations)
 *
 * **GET** `/tv/{series_id}/translations`
 */
export const getTvSeriesTranslations: Fetcher<
  typeof getTvSeriesTranslationsSchema,
  TvTranslations
> = async ({ seriesId }, options) =>
  get(`/tv/${seriesId}/translations`, undefined, options);
