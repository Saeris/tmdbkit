import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { TvSeriesDetails } from "./types/TvSeriesDetails.js";

export const getTvSeriesSchema = v.object({
  seriesId: tmdbId,
  params: v.exactOptional(
    v.partial(
      v.object({
        language: v.string(),
        /** Fetch these related resources in the same request; each comes back under its own key. At most 20. */
        appendToResponse: v.pipe(
          v.array(
            v.picklist([
              `aggregate_credits`,
              `alternative_titles`,
              `changes`,
              `content_ratings`,
              `credits`,
              `episode_groups`,
              `external_ids`,
              `images`,
              `keywords`,
              `lists`,
              `recommendations`,
              `reviews`,
              `screened_theatrically`,
              `similar`,
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
 * ### [Details](https://developer.themoviedb.org/reference/tv-series-details)
 *
 * **GET** `/tv/{series_id}`
 */
export const getTvSeries: Fetcher<
  typeof getTvSeriesSchema,
  TvSeriesDetails
> = async ({ seriesId, params }, options) =>
  get(`/tv/${seriesId}`, params, options);
