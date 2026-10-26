import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import type { Movie } from "./types/Movie.js";

export const getMovieSchema = v.object({
  movieId: v.number(),
  params: v.exactOptional(
    v.partial(
      v.object({
        appendToResponse: v.array(v.string()),
        language: v.string()
      })
    )
  )
});

/**
 * ### [Get Movie](https://developer.themoviedb.org/reference/movie-get-details)
 *
 * **GET** `/movie/{movie_id}`
 *
 * Get the primary details for a movie.
 */
export const getMovie: Fetcher<typeof getMovieSchema, Movie> = async ({
  movieId,
  params
}) => get(`/movie/${movieId}`, params);
