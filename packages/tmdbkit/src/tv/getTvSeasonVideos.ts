import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { ordinal, tmdbId } from "../validations/integer.js";
import type { Videos } from "../types/Video.js";

export const getTvSeasonVideosSchema = v.object({
  seriesId: tmdbId,
  seasonNumber: ordinal,
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
 * ### [Videos](https://developer.themoviedb.org/reference/tv-season-videos)
 *
 * **GET** `/tv/{series_id}/season/{season_number}/videos`
 */
export const getTvSeasonVideos: Fetcher<
  typeof getTvSeasonVideosSchema,
  Videos
> = async ({ seriesId, seasonNumber, params }, options) =>
  get(`/tv/${seriesId}/season/${seasonNumber}/videos`, params, options);
