import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer, tmdbId } from "../validations/integer.js";
import type { ListsContaining } from "../list/types/ListsContaining.js";

export const getMovieListsSchema = v.object({
  movieId: tmdbId,
  params: v.exactOptional(
    v.partial(
      v.object({
        language: v.string(),
        page: integer
      })
    )
  )
});

/**
 * ### [Lists](https://developer.themoviedb.org/reference/movie-lists)
 *
 * **GET** `/movie/{movie_id}/lists`
 */
export const getMovieLists: Fetcher<
  typeof getMovieListsSchema,
  ListsContaining
> = async ({ movieId, params }, options) =>
  get(`/movie/${movieId}/lists`, params, options);
