import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import type { MovieKeywords } from "./types/MovieKeywords.js";

export const getMovieKeywordsSchema = v.object({
  movieId: v.string()
});

/**
 * ### [Keywords](https://developer.themoviedb.org/reference/movie-keywords)
 *
 * **GET** `/movie/{movie_id}/keywords`
 */
export const getMovieKeywords: Fetcher<
  typeof getMovieKeywordsSchema,
  MovieKeywords
> = async ({ movieId }, options) =>
  get(`/movie/${encodeURIComponent(movieId)}/keywords`, undefined, options);
