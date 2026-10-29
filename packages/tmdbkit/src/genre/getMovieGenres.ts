import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import type { GenreList } from "./types/GenreList.js";

export const getMovieGenresSchema = v.object({
  params: v.exactOptional(
    v.partial(
      v.object({
        language: v.string()
      })
    )
  )
});

/**
 * ### [Movie List](https://developer.themoviedb.org/reference/genre-movie-list)
 *
 * **GET** `/genre/movie/list`
 */
export const getMovieGenres: Fetcher<
  typeof getMovieGenresSchema,
  GenreList
> = async ({ params }, options) => get(`/genre/movie/list`, params, options);
