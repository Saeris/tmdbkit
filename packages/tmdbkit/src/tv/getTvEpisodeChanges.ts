import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { Changes } from "../types/Changes.js";

export const getTvEpisodeChangesSchema = v.object({
  episodeId: tmdbId
});

/**
 * ### [Changes](https://developer.themoviedb.org/reference/tv-episode-changes-by-id)
 *
 * **GET** `/tv/episode/{episode_id}/changes`
 */
export const getTvEpisodeChanges: Fetcher<
  typeof getTvEpisodeChangesSchema,
  Changes
> = async ({ episodeId }, options) =>
  get(`/tv/episode/${episodeId}/changes`, undefined, options);
