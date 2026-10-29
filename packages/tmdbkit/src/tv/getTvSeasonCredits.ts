import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { ordinal, tmdbId } from "../validations/integer.js";
import type { TvCredits } from "./types/TvCredits.js";

export const getTvSeasonCreditsSchema = v.object({
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
 * ### [Credits](https://developer.themoviedb.org/reference/tv-season-credits)
 *
 * **GET** `/tv/{series_id}/season/{season_number}/credits`
 */
export const getTvSeasonCredits: Fetcher<
  typeof getTvSeasonCreditsSchema,
  TvCredits
> = async ({ seriesId, seasonNumber, params }, options) =>
  get(`/tv/${seriesId}/season/${seasonNumber}/credits`, params, options);
