import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import type { GenreList } from "./types/GenreList.js";

export const getTvGenresSchema = v.object({
  params: v.exactOptional(
    v.partial(
      v.object({
        language: v.string()
      })
    )
  )
});

/**
 * ### [TV List](https://developer.themoviedb.org/reference/genre-tv-list)
 *
 * **GET** `/genre/tv/list`
 */
export const getTvGenres: Fetcher<typeof getTvGenresSchema, GenreList> = async (
  { params },
  options
) => get(`/genre/tv/list`, params, options);
