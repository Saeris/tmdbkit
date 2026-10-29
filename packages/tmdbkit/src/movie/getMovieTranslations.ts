import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { MovieTranslations } from "./types/MovieTranslations.js";

export const getMovieTranslationsSchema = v.object({
  movieId: tmdbId
});

/**
 * ### [Translations](https://developer.themoviedb.org/reference/movie-translations)
 *
 * **GET** `/movie/{movie_id}/translations`
 */
export const getMovieTranslations: Fetcher<
  typeof getMovieTranslationsSchema,
  MovieTranslations
> = async ({ movieId }, options) =>
  get(`/movie/${movieId}/translations`, undefined, options);
