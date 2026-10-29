import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { ordinal, tmdbId } from "../validations/integer.js";
import type { AggregateCredits } from "./types/AggregateCredits.js";

export const getTvSeasonAggregateCreditsSchema = v.object({
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
 * ### [Aggregate Credits](https://developer.themoviedb.org/reference/tv-season-aggregate-credits)
 *
 * **GET** `/tv/{series_id}/season/{season_number}/aggregate_credits`
 */
export const getTvSeasonAggregateCredits: Fetcher<
  typeof getTvSeasonAggregateCreditsSchema,
  AggregateCredits
> = async ({ seriesId, seasonNumber, params }, options) =>
  get(
    `/tv/${seriesId}/season/${seasonNumber}/aggregate_credits`,
    params,
    options
  );
