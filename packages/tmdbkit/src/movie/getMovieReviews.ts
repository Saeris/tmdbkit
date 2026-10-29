import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer, tmdbId } from "../validations/integer.js";
import type { Reviews } from "../review/types/Review.js";

export const getMovieReviewsSchema = v.object({
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
 * ### [Reviews](https://developer.themoviedb.org/reference/movie-reviews)
 *
 * **GET** `/movie/{movie_id}/reviews`
 */
export const getMovieReviews: Fetcher<
  typeof getMovieReviewsSchema,
  Reviews
> = async ({ movieId, params }, options) =>
  get(`/movie/${movieId}/reviews`, params, options);
