import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer, tmdbId } from "../validations/integer.js";
import type { PagedMovieResults } from "./types/MovieListItem.js";

export const getSimilarMoviesSchema = v.object({
  movieId: tmdbId,
  params: v.exactOptional(
    v.partial(
      v.object({
        language: v.string(),
        page: integer
      })
    )
  )
});

/**
 * ### [Similar](https://developer.themoviedb.org/reference/movie-similar)
 *
 * **GET** `/movie/{movie_id}/similar`
 */
export const getSimilarMovies: Fetcher<
  typeof getSimilarMoviesSchema,
  PagedMovieResults
> = async ({ movieId, params }, options) =>
  get(`/movie/${movieId}/similar`, params, options);
