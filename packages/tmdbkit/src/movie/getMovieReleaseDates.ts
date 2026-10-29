import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { MovieReleaseDates } from "./types/MovieReleaseDates.js";

export const getMovieReleaseDatesSchema = v.object({
  movieId: tmdbId
});

/**
 * ### [Release Dates](https://developer.themoviedb.org/reference/movie-release-dates)
 *
 * **GET** `/movie/{movie_id}/release_dates`
 */
export const getMovieReleaseDates: Fetcher<
  typeof getMovieReleaseDatesSchema,
  MovieReleaseDates
> = async ({ movieId }, options) =>
  get(`/movie/${movieId}/release_dates`, undefined, options);
