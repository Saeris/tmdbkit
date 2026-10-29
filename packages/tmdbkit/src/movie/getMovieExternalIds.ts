import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { MovieExternalIds } from "./types/MovieExternalIds.js";

export const getMovieExternalIdsSchema = v.object({
  movieId: tmdbId
});

/**
 * ### [External IDs](https://developer.themoviedb.org/reference/movie-external-ids)
 *
 * **GET** `/movie/{movie_id}/external_ids`
 */
export const getMovieExternalIds: Fetcher<
  typeof getMovieExternalIdsSchema,
  MovieExternalIds
> = async ({ movieId }, options) =>
  get(`/movie/${movieId}/external_ids`, undefined, options);
