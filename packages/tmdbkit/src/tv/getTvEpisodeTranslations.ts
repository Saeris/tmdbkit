import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { ordinal, tmdbId } from "../validations/integer.js";
import type { NameOverviewTranslations } from "./types/TvTranslations.js";

export const getTvEpisodeTranslationsSchema = v.object({
  seriesId: tmdbId,
  seasonNumber: ordinal,
  episodeNumber: ordinal
});

/**
 * ### [Translations](https://developer.themoviedb.org/reference/tv-episode-translations)
 *
 * **GET** `/tv/{series_id}/season/{season_number}/episode/{episode_number}/translations`
 */
export const getTvEpisodeTranslations: Fetcher<
  typeof getTvEpisodeTranslationsSchema,
  NameOverviewTranslations
> = async ({ seriesId, seasonNumber, episodeNumber }, options) =>
  get(
    `/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}/translations`,
    undefined,
    options
  );
