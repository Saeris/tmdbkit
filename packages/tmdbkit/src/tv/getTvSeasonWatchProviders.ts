import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { ordinal, tmdbId } from "../validations/integer.js";
import type { WatchProviders } from "../watch-providers/types/WatchProviders.js";

export const getTvSeasonWatchProvidersSchema = v.object({
  seriesId: tmdbId,
  seasonNumber: ordinal,
  params: v.exactOptional(
    v.partial(
      v.object({
        language: v.string()
      })
    )
  )
});

/**
 * ### [Watch Providers](https://developer.themoviedb.org/reference/tv-season-watch-providers)
 *
 * **GET** `/tv/{series_id}/season/{season_number}/watch/providers`
 */
export const getTvSeasonWatchProviders: Fetcher<
  typeof getTvSeasonWatchProvidersSchema,
  WatchProviders
> = async ({ seriesId, seasonNumber, params }, options) =>
  get(
    `/tv/${seriesId}/season/${seasonNumber}/watch/providers`,
    params,
    options
  );
