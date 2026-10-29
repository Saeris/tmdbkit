import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer, tmdbId } from "../validations/integer.js";
import type { Changes } from "../types/Changes.js";

export const getTvSeasonChangesSchema = v.object({
  seasonId: tmdbId,
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
 * ### [Changes](https://developer.themoviedb.org/reference/tv-season-changes-by-id)
 *
 * **GET** `/tv/season/{season_id}/changes`
 */
export const getTvSeasonChanges: Fetcher<
  typeof getTvSeasonChangesSchema,
  Changes
> = async ({ seasonId, params }, options) =>
  get(`/tv/season/${seasonId}/changes`, params, options);
