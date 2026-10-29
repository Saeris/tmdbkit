import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer } from "../validations/integer.js";
import type { DatedMovieResults } from "./types/MovieListItem.js";

export const getNowPlayingMoviesSchema = v.object({
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
 * ### [Now Playing](https://developer.themoviedb.org/reference/movie-now-playing-list)
 *
 * **GET** `/movie/now_playing`
 */
export const getNowPlayingMovies: Fetcher<
  typeof getNowPlayingMoviesSchema,
  DatedMovieResults
> = async ({ params }, options) => get(`/movie/now_playing`, params, options);
