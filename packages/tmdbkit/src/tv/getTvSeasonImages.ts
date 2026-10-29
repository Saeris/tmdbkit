import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { ordinal, tmdbId } from "../validations/integer.js";
import type { PosterImages } from "../types/Images.js";

export const getTvSeasonImagesSchema = v.object({
  seriesId: tmdbId,
  seasonNumber: ordinal,
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
 * ### [Images](https://developer.themoviedb.org/reference/tv-season-images)
 *
 * **GET** `/tv/{series_id}/season/{season_number}/images`
 */
export const getTvSeasonImages: Fetcher<
  typeof getTvSeasonImagesSchema,
  PosterImages
> = async ({ seriesId, seasonNumber, params }, options) =>
  get(`/tv/${seriesId}/season/${seasonNumber}/images`, params, options);
