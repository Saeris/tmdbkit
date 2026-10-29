import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { Videos } from "../types/Video.js";

export const getTvSeriesVideosSchema = v.object({
  seriesId: tmdbId,
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
 * ### [Videos](https://developer.themoviedb.org/reference/tv-series-videos)
 *
 * **GET** `/tv/{series_id}/videos`
 */
export const getTvSeriesVideos: Fetcher<
  typeof getTvSeriesVideosSchema,
  Videos
> = async ({ seriesId, params }, options) =>
  get(`/tv/${seriesId}/videos`, params, options);
