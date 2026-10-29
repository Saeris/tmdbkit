import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { ordinal, tmdbId } from "../validations/integer.js";
import type { TvSeasonDetails } from "./types/TvSeasonDetails.js";

export const getTvSeasonSchema = v.object({
  seriesId: tmdbId,
  seasonNumber: ordinal,
  params: v.exactOptional(
    v.partial(
      v.object({
        language: v.string(),
        /** Fetch these related resources in the same request; each comes back under its own key. At most 20. */
        appendToResponse: v.pipe(
          v.array(
            v.picklist([
              `aggregate_credits`,
              `credits`,
              `external_ids`,
              `images`,
              `translations`,
              `videos`,
              `watch/providers`
            ])
          ),
          v.maxLength(20)
        )
      })
    )
  )
});

/**
 * ### [Details](https://developer.themoviedb.org/reference/tv-season-details)
 *
 * **GET** `/tv/{series_id}/season/{season_number}`
 */
export const getTvSeason: Fetcher<
  typeof getTvSeasonSchema,
  TvSeasonDetails
> = async ({ seriesId, seasonNumber, params }, options) =>
  get(`/tv/${seriesId}/season/${seasonNumber}`, params, options);
