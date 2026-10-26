import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import type { Season } from "../types/Season.js";

export const getSeasonSchema = v.object({
  seriesId: v.number(),
  seasonNumber: v.number(),
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
 * ### [Get TV Season](https://developer.themoviedb.org/reference/tv-season-get-details)
 *
 * **GET** `/tv/{series_id}/season/{season_number}`
 *
 * Get the details of a single season by specifying the TV show ID and the
 * season number.
 */
export const getSeason: Fetcher<typeof getSeasonSchema, Season> = async ({
  seriesId,
  seasonNumber,
  params
}) => get(`/tv/${seriesId}/season/${seasonNumber}`, params);
