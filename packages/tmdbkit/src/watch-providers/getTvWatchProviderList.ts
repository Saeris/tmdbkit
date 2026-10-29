import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import type { WatchProviderList } from "./types/WatchProviderList.js";

export const getTvWatchProviderListSchema = v.object({
  params: v.exactOptional(
    v.partial(
      v.object({
        language: v.string(),
        watchRegion: v.string()
      })
    )
  )
});

/**
 * ### [TV Providers](https://developer.themoviedb.org/reference/watch-provider-tv-list)
 *
 * **GET** `/watch/providers/tv`
 */
export const getTvWatchProviderList: Fetcher<
  typeof getTvWatchProviderListSchema,
  WatchProviderList
> = async ({ params }, options) => get(`/watch/providers/tv`, params, options);
