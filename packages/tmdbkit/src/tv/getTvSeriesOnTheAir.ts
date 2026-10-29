import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { integer } from "../validations/integer.js";
import type { PagedTvResults } from "./types/TvListItem.js";

export const getTvSeriesOnTheAirSchema = v.object({
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
 * ### [On The Air](https://developer.themoviedb.org/reference/tv-series-on-the-air-list)
 *
 * **GET** `/tv/on_the_air`
 */
export const getTvSeriesOnTheAir: Fetcher<
  typeof getTvSeriesOnTheAirSchema,
  PagedTvResults
> = async ({ params }, options) => get(`/tv/on_the_air`, params, options);
