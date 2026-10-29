import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import type { PagedMovieMediaResults } from "../movie/types/MovieListItem.js";

export const getTrendingMoviesSchema = v.object({
  timeWindow: v.picklist(["day", "week"]),
  params: v.exactOptional(
    v.partial(
      v.object({
        /** `ISO-639-1`-`ISO-3166-1` code */
        language: v.string()
      })
    )
  )
});

/**
 * ### [Movies](https://developer.themoviedb.org/reference/trending-movies)
 *
 * **GET** `/trending/movie/{time_window}`
 */
export const getTrendingMovies: Fetcher<
  typeof getTrendingMoviesSchema,
  PagedMovieMediaResults
> = async ({ timeWindow, params }, options) =>
  get(`/trending/movie/${encodeURIComponent(timeWindow)}`, params, options);
