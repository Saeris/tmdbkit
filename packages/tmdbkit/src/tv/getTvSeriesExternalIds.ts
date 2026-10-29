import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { TvSeriesExternalIds } from "./types/TvExternalIds.js";

export const getTvSeriesExternalIdsSchema = v.object({
  seriesId: tmdbId
});

/**
 * ### [External IDs](https://developer.themoviedb.org/reference/tv-series-external-ids)
 *
 * **GET** `/tv/{series_id}/external_ids`
 */
export const getTvSeriesExternalIds: Fetcher<
  typeof getTvSeriesExternalIdsSchema,
  TvSeriesExternalIds
> = async ({ seriesId }, options) =>
  get(`/tv/${seriesId}/external_ids`, undefined, options);
