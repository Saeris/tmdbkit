import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import type { TvShow } from "./types/TvShow.js";

export const getTvSchema = v.object({
  seriesId: v.number(),
  params: v.exactOptional(
    v.partial(
      v.object({
        appendToResponse: v.array(v.string()),
        language: v.string()
      })
    )
  )
});

/**
 * ### [Get TV](https://developer.themoviedb.org/reference/tv-get-details)
 *
 * **GET** `/tv/{series_id}`
 *
 * Get the primary details for a TV show.
 */
export const getTv: Fetcher<typeof getTvSchema, TvShow> = async ({
  seriesId,
  params
}) => get(`/tv/${seriesId}`, params);
