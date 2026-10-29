import * as v from "valibot";
import { get, type Fetcher } from "../requests/methods.js";
import { tmdbId } from "../validations/integer.js";
import type { ScreenedTheatrically } from "./types/ScreenedTheatrically.js";

export const getTvSeriesScreenedTheatricallySchema = v.object({
  seriesId: tmdbId
});

/**
 * ### [Screened Theatrically](https://developer.themoviedb.org/reference/tv-series-screened-theatrically)
 *
 * **GET** `/tv/{series_id}/screened_theatrically`
 */
export const getTvSeriesScreenedTheatrically: Fetcher<
  typeof getTvSeriesScreenedTheatricallySchema,
  ScreenedTheatrically
> = async ({ seriesId }, options) =>
  get(`/tv/${seriesId}/screened_theatrically`, undefined, options);
