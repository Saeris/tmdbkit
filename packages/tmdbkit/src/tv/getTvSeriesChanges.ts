import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer, tmdbId } from "../validations/integer.js";
import type { Changes } from "../types/Changes.js";

export const getTvSeriesChangesSchema = v.object({
  seriesId: tmdbId,
  params: v.exactOptional(
    v.partial(
      v.object({
        endDate: v.string(),
        page: integer,
        startDate: v.string()
      })
    )
  )
});

/**
 * ### [Changes](https://developer.themoviedb.org/reference/tv-series-changes)
 *
 * **GET** `/tv/{series_id}/changes`
 */
export const getTvSeriesChanges: Fetcher<
  typeof getTvSeriesChangesSchema,
  Changes
> = async ({ seriesId, params }, options) =>
  get(`/tv/${seriesId}/changes`, params, options);
