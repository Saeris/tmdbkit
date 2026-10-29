import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer, tmdbId } from "../validations/integer.js";
import { isoDate } from "../validations/isoDate.js";
import type { Changes } from "../types/Changes.js";

export const getMovieChangesSchema = v.object({
  movieId: tmdbId,
  params: v.exactOptional(
    v.partial(
      v.object({
        endDate: isoDate,
        page: integer,
        startDate: isoDate
      })
    )
  )
});

/**
 * ### [Changes](https://developer.themoviedb.org/reference/movie-changes)
 *
 * **GET** `/movie/{movie_id}/changes`
 */
export const getMovieChanges: Fetcher<
  typeof getMovieChangesSchema,
  Changes
> = async ({ movieId, params }, options) =>
  get(`/movie/${movieId}/changes`, params, options);
