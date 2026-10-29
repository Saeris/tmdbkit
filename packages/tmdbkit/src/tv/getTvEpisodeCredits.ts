import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { ordinal, tmdbId } from "../validations/integer.js";
import type { TvEpisodeCredits } from "./types/TvCredits.js";

export const getTvEpisodeCreditsSchema = v.object({
  seriesId: tmdbId,
  seasonNumber: ordinal,
  episodeNumber: ordinal,
  params: v.exactOptional(
    v.partial(
      v.object({
        language: v.string()
      })
    )
  )
});

/**
 * ### [Credits](https://developer.themoviedb.org/reference/tv-episode-credits)
 *
 * **GET** `/tv/{series_id}/season/{season_number}/episode/{episode_number}/credits`
 */
export const getTvEpisodeCredits: Fetcher<
  typeof getTvEpisodeCreditsSchema,
  TvEpisodeCredits
> = async ({ seriesId, seasonNumber, episodeNumber, params }, options) =>
  get(
    `/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}/credits`,
    params,
    options
  );
