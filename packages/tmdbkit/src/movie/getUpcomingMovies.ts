import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer } from "../validations/integer.js";
import type { DatedMovieResults } from "./types/MovieListItem.js";

export const getUpcomingMoviesSchema = v.object({
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
 * ### [Upcoming](https://developer.themoviedb.org/reference/movie-upcoming-list)
 *
 * **GET** `/movie/upcoming`
 */
export const getUpcomingMovies: Fetcher<
  typeof getUpcomingMoviesSchema,
  DatedMovieResults
> = async ({ params }, options) => get(`/movie/upcoming`, params, options);
