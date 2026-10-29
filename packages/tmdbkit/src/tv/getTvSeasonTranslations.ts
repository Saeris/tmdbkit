import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { ordinal, tmdbId } from "../validations/integer.js";
import type { NameOverviewTranslations } from "./types/TvTranslations.js";

export const getTvSeasonTranslationsSchema = v.object({
  seriesId: tmdbId,
  seasonNumber: ordinal
});

/**
 * ### [Translations](https://developer.themoviedb.org/reference/tv-season-translations)
 *
 * **GET** `/tv/{series_id}/season/{season_number}/translations`
 */
export const getTvSeasonTranslations: Fetcher<
  typeof getTvSeasonTranslationsSchema,
  NameOverviewTranslations
> = async ({ seriesId, seasonNumber }, options) =>
  get(
    `/tv/${seriesId}/season/${seasonNumber}/translations`,
    undefined,
    options
  );
