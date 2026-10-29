import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { WatchProviders } from "../watch-providers/types/WatchProviders.js";

export const getMovieWatchProvidersSchema = v.object({
  movieId: tmdbId
});

/**
 * ### [Watch Providers](https://developer.themoviedb.org/reference/movie-watch-providers)
 *
 * **GET** `/movie/{movie_id}/watch/providers`
 */
export const getMovieWatchProviders: Fetcher<
  typeof getMovieWatchProvidersSchema,
  WatchProviders
> = async ({ movieId }, options) =>
  get(`/movie/${movieId}/watch/providers`, undefined, options);
