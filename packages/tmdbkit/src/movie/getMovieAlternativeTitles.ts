import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { MovieAlternativeTitles } from "./types/MovieAlternativeTitles.js";

export const getMovieAlternativeTitlesSchema = v.object({
  movieId: tmdbId,
  params: v.exactOptional(
    v.partial(
      v.object({
        /** Specify a ISO-3166-1 value to filter the results */
        country: v.string()
      })
    )
  )
});

/**
 * ### [Alternative Titles](https://developer.themoviedb.org/reference/movie-alternative-titles)
 *
 * **GET** `/movie/{movie_id}/alternative_titles`
 */
export const getMovieAlternativeTitles: Fetcher<
  typeof getMovieAlternativeTitlesSchema,
  MovieAlternativeTitles
> = async ({ movieId, params }, options) =>
  get(`/movie/${movieId}/alternative_titles`, params, options);
