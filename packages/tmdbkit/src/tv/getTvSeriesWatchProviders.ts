import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { WatchProviders } from "../watch-providers/types/WatchProviders.js";

export const getTvSeriesWatchProvidersSchema = v.object({
  seriesId: tmdbId
});

/**
 * ### [Watch Providers](https://developer.themoviedb.org/reference/tv-series-watch-providers)
 *
 * **GET** `/tv/{series_id}/watch/providers`
 */
export const getTvSeriesWatchProviders: Fetcher<
  typeof getTvSeriesWatchProvidersSchema,
  WatchProviders
> = async ({ seriesId }, options) =>
  get(`/tv/${seriesId}/watch/providers`, undefined, options);
