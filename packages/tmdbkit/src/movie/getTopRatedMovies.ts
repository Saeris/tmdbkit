import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer } from "../validations/integer.js";
import type { PagedMovieResults } from "./types/MovieListItem.js";

export const getTopRatedMoviesSchema = v.object({
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
 * ### [Top Rated](https://developer.themoviedb.org/reference/movie-top-rated-list)
 *
 * **GET** `/movie/top_rated`
 */
export const getTopRatedMovies: Fetcher<
  typeof getTopRatedMoviesSchema,
  PagedMovieResults
> = async ({ params }, options) => get(`/movie/top_rated`, params, options);
