import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { ordinal, tmdbId } from "../validations/integer.js";
import type { TvEpisodeExternalIds } from "./types/TvExternalIds.js";

export const getTvEpisodeExternalIdsSchema = v.object({
  seriesId: tmdbId,
  seasonNumber: ordinal,
  episodeNumber: v.string()
});

/**
 * ### [External IDs](https://developer.themoviedb.org/reference/tv-episode-external-ids)
 *
 * **GET** `/tv/{series_id}/season/{season_number}/episode/{episode_number}/external_ids`
 */
export const getTvEpisodeExternalIds: Fetcher<
  typeof getTvEpisodeExternalIdsSchema,
  TvEpisodeExternalIds
> = async ({ seriesId, seasonNumber, episodeNumber }, options) =>
  get(
    `/tv/${seriesId}/season/${seasonNumber}/episode/${encodeURIComponent(episodeNumber)}/external_ids`,
    undefined,
    options
  );
