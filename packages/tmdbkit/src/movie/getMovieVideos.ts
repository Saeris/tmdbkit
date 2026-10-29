import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { Videos } from "../types/Video.js";

export const getMovieVideosSchema = v.object({
  movieId: tmdbId,
  params: v.exactOptional(
    v.partial(
      v.object({
        language: v.string()
      })
    )
  )
});

/**
 * ### [Videos](https://developer.themoviedb.org/reference/movie-videos)
 *
 * **GET** `/movie/{movie_id}/videos`
 */
export const getMovieVideos: Fetcher<
  typeof getMovieVideosSchema,
  Videos
> = async ({ movieId, params }, options) =>
  get(`/movie/${movieId}/videos`, params, options);
