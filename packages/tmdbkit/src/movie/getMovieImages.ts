import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { MediaImages } from "../types/Images.js";

export const getMovieImagesSchema = v.object({
  movieId: tmdbId,
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
 * ### [Images](https://developer.themoviedb.org/reference/movie-images)
 *
 * **GET** `/movie/{movie_id}/images`
 */
export const getMovieImages: Fetcher<
  typeof getMovieImagesSchema,
  MediaImages
> = async ({ movieId, params }, options) =>
  get(`/movie/${movieId}/images`, params, options);
