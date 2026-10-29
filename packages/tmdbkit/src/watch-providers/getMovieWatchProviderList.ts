import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import type { WatchProviderList } from "./types/WatchProviderList.js";

export const getMovieWatchProviderListSchema = v.object({
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
 * ### [Movie Providers](https://developer.themoviedb.org/reference/watch-providers-movie-list)
 *
 * **GET** `/watch/providers/movie`
 */
export const getMovieWatchProviderList: Fetcher<
  typeof getMovieWatchProviderListSchema,
  WatchProviderList
> = async ({ params }, options) =>
  get(`/watch/providers/movie`, params, options);
