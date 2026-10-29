import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { ordinal, tmdbId } from "../validations/integer.js";
import type { TvSeasonExternalIds } from "./types/TvExternalIds.js";

export const getTvSeasonExternalIdsSchema = v.object({
  seriesId: tmdbId,
  seasonNumber: ordinal
});

/**
 * ### [External IDs](https://developer.themoviedb.org/reference/tv-season-external-ids)
 *
 * **GET** `/tv/{series_id}/season/{season_number}/external_ids`
 */
export const getTvSeasonExternalIds: Fetcher<
  typeof getTvSeasonExternalIdsSchema,
  TvSeasonExternalIds
> = async ({ seriesId, seasonNumber }, options) =>
  get(
    `/tv/${seriesId}/season/${seasonNumber}/external_ids`,
    undefined,
    options
  );
