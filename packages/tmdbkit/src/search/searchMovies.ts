import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer } from "../validations/integer.js";
import type { PagedMovieResults } from "../movie/types/MovieListItem.js";

export const searchMoviesSchema = v.object({
  query: v.string(),
  params: v.exactOptional(
    v.partial(
      v.object({
        includeAdult: v.boolean(),
        language: v.string(),
        /** The spec types the year params as strings; TMDB reads `1977` and `"1977"` alike. */
        primaryReleaseYear: v.union([integer, v.string()]),
        page: integer,
        region: v.string(),
        year: v.union([integer, v.string()])
      })
    )
  )
});

/**
 * ### [Movie](https://developer.themoviedb.org/reference/search-movie)
 *
 * **GET** `/search/movie`
 */
export const searchMovies: Fetcher<
  typeof searchMoviesSchema,
  PagedMovieResults
> = async ({ query, params }, options) =>
  get(`/search/movie`, { ...params, query }, options);
