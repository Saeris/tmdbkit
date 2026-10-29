import { get, type Fetcher } from "../requests/methods.js";
import type { TvSeriesDetails } from "./types/TvSeriesDetails.js";

/**
 * ### [Latest](https://developer.themoviedb.org/reference/tv-series-latest-id)
 *
 * **GET** `/tv/latest`
 */
export const getLatestTvSeries: Fetcher<null, TvSeriesDetails> = async (
  options
) => get(`/tv/latest`, undefined, options);
