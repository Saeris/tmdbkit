import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { TvCredits } from "./types/TvCredits.js";

export const getTvSeriesCreditsSchema = v.object({
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
 * ### [Credits](https://developer.themoviedb.org/reference/tv-series-credits)
 *
 * **GET** `/tv/{series_id}/credits`
 */
export const getTvSeriesCredits: Fetcher<
  typeof getTvSeriesCreditsSchema,
  TvCredits
> = async ({ seriesId, params }, options) =>
  get(`/tv/${seriesId}/credits`, params, options);
