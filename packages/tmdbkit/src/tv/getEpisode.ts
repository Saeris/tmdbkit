import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import type { Episode } from "../types/Episode.js";

export const getEpisodeSchema = v.object({
  seriesId: v.number(),
  seasonNumber: v.number(),
  episodeNumber: v.number(),
  params: v.exactOptional(
    v.partial(
      v.object({
        appendToResponse: v.array(v.string()),
        language: v.string()
      })
    )
  )
});

/**
 * ### [Get TV Episode](https://developer.themoviedb.org/reference/tv-episode-get-details)
 *
 * **GET** `/tv/{series_id}/season/{season_number}/episode/{episode_number}`
 *
 * Get the details of a single episode by specifying the TV show ID, season
 * number, and episode number.
 */
export const getEpisode: Fetcher<typeof getEpisodeSchema, Episode> = async ({
  seriesId,
  seasonNumber,
  episodeNumber,
  params
}) =>
  get(
    `/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}`,
    params
  );
