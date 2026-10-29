import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import type { PagedMediaResults } from "../types/MediaListItem.js";

export const getTrendingSchema = v.object({
  timeWindow: v.picklist(["day", "week"]),
  params: v.exactOptional(
    v.partial(
      v.object({
        /** `ISO-639-1`-`ISO-3166-1` code */
        language: v.string()
      })
    )
  )
});

/**
 * ### [All](https://developer.themoviedb.org/reference/trending-all)
 *
 * **GET** `/trending/all/{time_window}`
 */
export const getTrending: Fetcher<
  typeof getTrendingSchema,
  PagedMediaResults
> = async ({ timeWindow, params }, options) =>
  get(`/trending/all/${encodeURIComponent(timeWindow)}`, params, options);
