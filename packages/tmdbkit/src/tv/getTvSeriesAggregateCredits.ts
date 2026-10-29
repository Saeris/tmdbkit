import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { AggregateCredits } from "./types/AggregateCredits.js";

export const getTvSeriesAggregateCreditsSchema = v.object({
  seriesId: tmdbId,
  params: v.exactOptional(
    v.partial(
      v.object({
        language: v.string()
      })
    )
  )
});

/**
 * ### [Aggregate Credits](https://developer.themoviedb.org/reference/tv-series-aggregate-credits)
 *
 * **GET** `/tv/{series_id}/aggregate_credits`
 */
export const getTvSeriesAggregateCredits: Fetcher<
  typeof getTvSeriesAggregateCreditsSchema,
  AggregateCredits
> = async ({ seriesId, params }, options) =>
  get(`/tv/${seriesId}/aggregate_credits`, params, options);
