import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer } from "../validations/integer.js";
import type { PagedMovieResults } from "./types/MovieListItem.js";

export const getPopularMoviesSchema = v.object({
  params: v.exactOptional(
    v.partial(
      v.object({
        language: v.string(),
        page: integer,
        /** ISO-3166-1 code */
        region: v.string()
      })
    )
  )
});

/**
 * ### [Popular](https://developer.themoviedb.org/reference/movie-popular-list)
 *
 * **GET** `/movie/popular`
 */
export const getPopularMovies: Fetcher<
  typeof getPopularMoviesSchema,
  PagedMovieResults
> = async ({ params }, options) => get(`/movie/popular`, params, options);
