import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import type { PagedResults } from "../types/PagedResults.js";
import type { SearchMovieResult } from "./types/SearchMovieResult.js";

export const searchMovieSchema = v.object({
  query: v.string(),
  params: v.exactOptional(
    v.partial(
      v.object({
        includeAdult: v.boolean(),
        language: v.string(),
        primaryReleaseYear: v.number(),
        page: v.number(),
        region: v.string(),
        year: v.number()
      })
    )
  )
});

/**
 * ### [Search Movie](https://developer.themoviedb.org/reference/search-movie)
 *
 * **GET** `/search/movie`
 *
 * Search for movies by title.
 */
export const searchMovie: Fetcher<
  typeof searchMovieSchema,
  PagedResults<SearchMovieResult>
> = async ({ query, params }) => get(`/search/movie`, { ...params, query });
