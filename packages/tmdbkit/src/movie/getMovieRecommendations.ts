import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer, tmdbId } from "../validations/integer.js";
import type { PagedMovieMediaResults } from "./types/MovieListItem.js";

export const getMovieRecommendationsSchema = v.object({
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
 * ### [Recommendations](https://developer.themoviedb.org/reference/movie-recommendations)
 *
 * **GET** `/movie/{movie_id}/recommendations`
 */
export const getMovieRecommendations: Fetcher<
  typeof getMovieRecommendationsSchema,
  PagedMovieMediaResults
> = async ({ movieId, params }, options) =>
  get(`/movie/${movieId}/recommendations`, params, options);
