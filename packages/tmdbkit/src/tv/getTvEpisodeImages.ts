import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { ordinal, tmdbId } from "../validations/integer.js";
import type { StillImages } from "../types/Images.js";

export const getTvEpisodeImagesSchema = v.object({
  seriesId: tmdbId,
  seasonNumber: ordinal,
  episodeNumber: ordinal,
  params: v.exactOptional(
    v.partial(
      v.object({
        /** Specify a comma separated list of ISO-639-1 values to query, for example: `en-US,null` */
        includeImageLanguage: v.string(),
        language: v.string()
      })
    )
  )
});

/**
 * ### [Images](https://developer.themoviedb.org/reference/tv-episode-images)
 *
 * **GET** `/tv/{series_id}/season/{season_number}/episode/{episode_number}/images`
 */
export const getTvEpisodeImages: Fetcher<
  typeof getTvEpisodeImagesSchema,
  StillImages
> = async ({ seriesId, seasonNumber, episodeNumber, params }, options) =>
  get(
    `/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}/images`,
    params,
    options
  );
