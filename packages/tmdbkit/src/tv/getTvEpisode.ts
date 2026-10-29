import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { ordinal, tmdbId } from "../validations/integer.js";
import type { TvEpisodeDetails } from "./types/TvEpisodeDetails.js";

export const getTvEpisodeSchema = v.object({
  seriesId: tmdbId,
  seasonNumber: ordinal,
  episodeNumber: ordinal,
  params: v.exactOptional(
    v.partial(
      v.object({
        language: v.string(),
        /** Fetch these related resources in the same request; each comes back under its own key. At most 20. */
        appendToResponse: v.pipe(
          v.array(
            v.picklist([
              `credits`,
              `external_ids`,
              `images`,
              `translations`,
              `videos`
            ])
          ),
          v.maxLength(20)
        )
      })
    )
  )
});

/**
 * ### [Details](https://developer.themoviedb.org/reference/tv-episode-details)
 *
 * **GET** `/tv/{series_id}/season/{season_number}/episode/{episode_number}`
 */
export const getTvEpisode: Fetcher<
  typeof getTvEpisodeSchema,
  TvEpisodeDetails
> = async ({ seriesId, seasonNumber, episodeNumber, params }, options) =>
  get(
    `/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}`,
    params,
    options
  );
