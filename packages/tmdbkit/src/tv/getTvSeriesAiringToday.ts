import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer } from "../validations/integer.js";
import type { PagedTvResults } from "./types/TvListItem.js";

export const getTvSeriesAiringTodaySchema = v.object({
  params: v.exactOptional(
    v.partial(
      v.object({
        language: v.string(),
        page: integer,
        timezone: v.string()
      })
    )
  )
});

/**
 * ### [Airing Today](https://developer.themoviedb.org/reference/tv-series-airing-today-list)
 *
 * **GET** `/tv/airing_today`
 */
export const getTvSeriesAiringToday: Fetcher<
  typeof getTvSeriesAiringTodaySchema,
  PagedTvResults
> = async ({ params }, options) => get(`/tv/airing_today`, params, options);
