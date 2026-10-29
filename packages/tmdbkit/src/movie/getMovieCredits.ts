import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { MovieCredits } from "./types/MovieCredits.js";

export const getMovieCreditsSchema = v.object({
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
 * ### [Credits](https://developer.themoviedb.org/reference/movie-credits)
 *
 * **GET** `/movie/{movie_id}/credits`
 */
export const getMovieCredits: Fetcher<
  typeof getMovieCreditsSchema,
  MovieCredits
> = async ({ movieId, params }, options) =>
  get(`/movie/${movieId}/credits`, params, options);
