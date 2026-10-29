import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import type { WatchProviderRegions } from "./types/WatchProviderRegion.js";

export const getWatchProviderRegionsSchema = v.object({
  params: v.exactOptional(
    v.partial(
      v.object({
        language: v.string()
      })
    )
  )
});

/**
 * ### [Available Regions](https://developer.themoviedb.org/reference/watch-providers-available-regions)
 *
 * **GET** `/watch/providers/regions`
 */
export const getWatchProviderRegions: Fetcher<
  typeof getWatchProviderRegionsSchema,
  WatchProviderRegions
> = async ({ params }, options) =>
  get(`/watch/providers/regions`, params, options);
