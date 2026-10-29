import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { ordinal, tmdbId } from "../validations/integer.js";
import type { Videos } from "../types/Video.js";

export const getTvEpisodeVideosSchema = v.object({
  seriesId: tmdbId,
  seasonNumber: ordinal,
  episodeNumber: ordinal,
  params: v.exactOptional(
    v.partial(
      v.object({
        /** Filter the list results by language, supports more than one value by using a comma */
        includeVideoLanguage: v.string(),
        language: v.string()
      })
    )
  )
});

/**
 * ### [Videos](https://developer.themoviedb.org/reference/tv-episode-videos)
 *
 * **GET** `/tv/{series_id}/season/{season_number}/episode/{episode_number}/videos`
 */
export const getTvEpisodeVideos: Fetcher<
  typeof getTvEpisodeVideosSchema,
  Videos
> = async ({ seriesId, seasonNumber, episodeNumber, params }, options) =>
  get(
    `/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}/videos`,
    params,
    options
  );
