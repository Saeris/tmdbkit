import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { MediaImages } from "../types/Images.js";

export const getTvSeriesImagesSchema = v.object({
  seriesId: tmdbId,
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
 * ### [Images](https://developer.themoviedb.org/reference/tv-series-images)
 *
 * **GET** `/tv/{series_id}/images`
 */
export const getTvSeriesImages: Fetcher<
  typeof getTvSeriesImagesSchema,
  MediaImages
> = async ({ seriesId, params }, options) =>
  get(`/tv/${seriesId}/images`, params, options);
